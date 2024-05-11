import React, { useState, useEffect, useRef } from 'react';
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonRow,
  IonTextarea,
  IonTitle,
  IonToolbar,
  IonItemDivider,
  useIonToast
} from '@ionic/react';
//Ionicons
import { trashOutline, pencilOutline } from 'ionicons/icons';

import './MyDiary.css';

// Firebase
import { collection, addDoc, onSnapshot, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from './Firebase';

const MyDiary: React.FC = () => {
  const [diary, setDiaries] = useState<{ id: string; diary: string; description: string; dateAdded: string; completed: boolean }[]>([]);
  const [newDiary, setNewDiary] = useState<string>('');
  const [newDescription, setNewDescription] = useState<string>('');
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const inputRefDiary = useRef<HTMLIonInputElement>(null);
  const inputRefDescription = useRef<HTMLIonTextareaElement>(null);
  const [present] = useIonToast();

  // Clear the input field
  const clearInput = () => {
    setNewDiary('');
    setNewDescription('');
    if (inputRefDiary.current && inputRefDescription.current) {
      inputRefDiary.current.setFocus();
    }
  };

  // Toast
  const addDiaryToast = (position: 'middle') => {
    present({
      message: 'Added new Diary',
      duration: 1500,
      position: position,
    });
  };

  const editDiaryToast = (position: 'middle') => {
    present({
      message: 'Changes Saved',
      duration: 1500,
      position: position,
    });
  };

  const deleteDiaryToast = (position: 'middle') => {
    present({
      message: 'Diary deleted',
      duration: 1500,
      position: position,
    });
  };

  //Create Diary
  const addDiary = async () => {
    if (newDiary.trim() !== '') {
      if (editIndex !== null) {
        // Update existing diary (not implemented in this code snippet)
      } else {
        const currentDate = new Date().toISOString();
        addDiaryToast('middle');
        await addDoc(collection(db, 'diary'), {
          diary: newDiary,
          description: newDescription,
          dateAdded: currentDate,
          completed: false
        });

      }
      clearInput();
    }
  };

  //Read Firebase Data
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'diary'), (snapshot) => {
      setDiaries(snapshot.docs.map(doc => ({
        id: doc.id, // Include the id property
        description: doc.data().description,
        diary: doc.data().diary,
        dateAdded: doc.data().dateAdded,
        completed: doc.data().completed
      })));
    });
    return () => unsubscribe();
  }, []);

  // Edit Handler
  const editDiary = (index: number) => {
    setEditIndex(index);
    const editedDiary = diary[index];
    setNewDiary(editedDiary.diary);
    setNewDescription(editedDiary.description);
  };

  // Update Firebase Data
  const updateDiary = async () => {
    if (editIndex !== null) {
      editDiaryToast('middle');
      const diaryToUpdate = diary[editIndex];
      await updateDoc(doc(db, 'diary', diaryToUpdate.id), {
        diary: newDiary,
        description: newDescription,
      });
      // Clear the input fields and reset editIndex
      clearInput();
      setEditIndex(null);
    }
  };

  // Cancel Edit function
  const cancelEdit = () => {
    clearInput(); // Clear input fields
    setEditIndex(null); // Reset editIndex
  };

  // Delete Firebase Data
  const deleteDiary = async (index: number) => {
    deleteDiaryToast('middle');
    const diaryToDelete = diary[index];
    // Delete diary from Firestore
    await deleteDoc(doc(db, 'diary', diaryToDelete.id));
  };

  // Toggle Completion
  const toggleCompletion = async (index: number) => {
    const updatedDiarys = [...diary];
    updatedDiarys[index].completed = !updatedDiarys[index].completed;
    setDiaries(updatedDiarys);

    // Update completion status in Firestore
    await updateDoc(doc(db, 'diary', diary[index].id), {
      completed: updatedDiarys[index].completed
    });
  };

  return (
    <IonPage className="home-page">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/" />
          </IonButtons>
          <IonTitle>My Diaries</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonItemDivider color="light">
          <IonLabel>My Diaries</IonLabel>
        </IonItemDivider>
        <IonList id="list_body">
          {diary
            .slice() // Create a shallow copy of the diary array to avoid mutating the original array
            .sort((a, b) => new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime()) // Sort the array by dateAdded
            .map((diary, index) => (
            <IonItem key={index}>
              <IonLabel onClick={() => toggleCompletion(index)} style={{ textDecoration: diary.completed ? 'line-through' : 'none' }}>
                <h2>{diary.diary}</h2>
                <p>{diary.description}</p>
                <p>{new Date(diary.dateAdded).toLocaleString()}</p>
              </IonLabel>
              <IonButton fill="clear" onClick={() => editDiary(index)}>
                <IonIcon icon={pencilOutline} />
                Edit
              </IonButton>
              <IonButton fill="clear" onClick={() => deleteDiary(index)}>
                <IonIcon icon={trashOutline} />
                Delete
              </IonButton>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default MyDiary;
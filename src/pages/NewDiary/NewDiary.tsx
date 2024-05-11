import React, { useState, useEffect, useRef } from 'react';
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
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
import { trashOutline, pencilOutline, checkmarkOutline } from 'ionicons/icons';

import './NewDiary.css';

// Firebase
import { collection, addDoc, onSnapshot, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from './Firebase';

const NewDiary: React.FC = () => {
  const [diary, setDiaries] = useState<{ id: string; title: string; description: string; dateAdded: string; completed: boolean }[]>([]);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newDescription, setNewDescription] = useState<string>('');
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const inputRefTitle = useRef<HTMLIonInputElement>(null);
  const inputRefDescription = useRef<HTMLIonTextareaElement>(null);
  const [present] = useIonToast();

  // Clear the input field
  const clearInput = () => {
    setNewTitle('');
    setNewDescription('');
    if (inputRefTitle.current && inputRefDescription.current) {
      inputRefTitle.current.setFocus();
    }
  };

  // Toast
  const addDiariesToast = (position: 'middle') => {
    present({
      message: 'Added new Diaries',
      duration: 1500,
      position: position,
    });
  };

  const editDiariesToast = (position: 'middle') => {
    present({
      message: 'Changes Saved',
      duration: 1500,
      position: position,
    });
  };

  const deleteDiariesToast = (position: 'middle') => {
    present({
      message: 'Diaries deleted',
      duration: 1500,
      position: position,
    });
  };

  //Create Diaries
  const addDiaries = async () => {
    if (newTitle.trim() !== '') {
      if (editIndex !== null) {
        // Update existing diary (not implemented in this code snippet)
      } else {
        const currentDate = new Date().toISOString();
        addDiariesToast('middle');
        await addDoc(collection(db, 'diary'), {
          title: newTitle,
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
        title: doc.data().title,
        dateAdded: doc.data().dateAdded,
        completed: doc.data().completed
      })));
    });
    return () => unsubscribe();
  }, []);

  // Edit Handler
  const editDiaries = (index: number) => {
    setEditIndex(index);
    const editedDiaries = diary[index];
    setNewTitle(editedDiaries.title);
    setNewDescription(editedDiaries.description);
  };

  // Update Firebase Data
  const updateDiaries = async () => {
    if (editIndex !== null) {
      editDiariesToast('middle');
      const diaryToUpdate = diary[editIndex];
      await updateDoc(doc(db, 'diary', diaryToUpdate.id), {
        title: newTitle,
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
  const deleteDiaries = async (index: number) => {
    deleteDiariesToast('middle');
    const diaryToDelete = diary[index];
    // Delete diary from Firestore
    await deleteDoc(doc(db, 'diary', diaryToDelete.id));
  };

  // Toggle Completion
  const toggleCompletion = async (index: number) => {
    const updatedDiaries = [...diary];
    updatedDiaries[index].completed = !updatedDiaries[index].completed;
    setDiaries(updatedDiaries);

    // Update completion status in Firestore
    await updateDoc(doc(db, 'diary', diary[index].id), {
      completed: updatedDiaries[index].completed
    });
  };

  return (
    <IonPage className="home-page">
      <img alt="Profile" id="profile_pic" src="https://raw.githubusercontent.com/RyanPCepada/ion-t-cepada/main/src/assets/img/GALAXY_GIF.gif"
        style={{width:'100%', position: 'absolute'}}/>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/" />
          </IonButtons>
          <IonTitle>My Diary</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonCard id="card_body">
          <IonCardHeader>
            <IonCardTitle>
              <IonInput
                placeholder="Type your diary here"
                label="Add a new diary..."
                id="custom-input"
                labelPlacement="floating"
                counter={true}
                maxlength={1000}
                counterFormatter={(inputLength, maxLength) => `${maxLength - inputLength} / ${maxLength} characters remaining`}
                value={newTitle}
                onIonInput={(e) => setNewTitle(e.detail.value!)}
                ref={inputRefTitle}
              ></IonInput>
            </IonCardTitle>
            <IonCardSubtitle>
              <IonTextarea
                placeholder="Type task description here"
                label="Description"
                id="custom-input"
                labelPlacement="floating"
                counter={true}
                maxlength={200}
                counterFormatter={(inputLength, maxLength) => `${maxLength - inputLength} / ${maxLength} characters remaining`}
                value={newDescription}
                onIonInput={(e) => setNewDescription(e.detail.value!)}
                ref={inputRefDescription}
              ></IonTextarea>
            </IonCardSubtitle>
          </IonCardHeader>
          <IonCardContent>
            <IonRow>
              <IonCol>
                <IonButton expand="block" onClick={editIndex !== null ? updateDiaries : addDiaries}>
                  {editIndex !== null ? 'Update' : 'Add'}
                </IonButton>
              </IonCol>
              <IonCol>
                <IonButton expand="block" fill="clear" onClick={editIndex !== null ? cancelEdit : clearInput}>
                  {editIndex !== null ? 'Cancel' : 'Clear'}
                </IonButton>
              </IonCol>
            </IonRow>
          </IonCardContent>
        </IonCard>
        {/*Diaries list output*/}
        <br></br>
      </IonContent>
    </IonPage>
  );
};

export default NewDiary;
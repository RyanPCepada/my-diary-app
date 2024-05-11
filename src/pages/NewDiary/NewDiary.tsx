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
  IonTitle,
  IonToolbar,
  IonItemDivider,
  IonTextarea,
  useIonToast
} from '@ionic/react';
//Ionicons
import { trashOutline, pencilOutline } from 'ionicons/icons';

import './NewDiary.css';

// Firebase
import { collection, addDoc, onSnapshot,updateDoc,doc, deleteDoc} from 'firebase/firestore';
import { db } from './Firebase';

const NewDiary: React.FC = () => {
  const [diaries, readDiaries] = useState<{ id: string; title: string; description: string;dateAdded: string; }[]>([]);
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
    if (newTitle.trim() !== '') {
      if (editIndex !== null) {
        // Update existing diary (not implemented in this code snippet)
      } else {
        const currentDate = new Date().toISOString(); 
        addDiaryToast('middle');
        await addDoc(collection(db, 'diary'), {
          title: newTitle,
          description: newDescription,
          dateAdded: currentDate
        });
        
      }
      clearInput();
    }
  };

  //Read Firebase Data
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'diary'), (snapshot) => {
      readDiaries(snapshot.docs.map(doc => ({
        id: doc.id, // Include the id property
        description: doc.data().description,
        title: doc.data().title,
        dateAdded: doc.data().dateAdded
      })));
    });
    return () => unsubscribe();
  }, []);

// Edit Handler
const editDiary = (index: number) => {
  setEditIndex(index);
  const editedDiary = diaries[index];
  setNewTitle(editedDiary.title);
  setNewDescription(editedDiary.description);
};

// Update Firebase Data
const updateDiary = async () => {
  if (editIndex !== null) {
    editDiaryToast('middle');
    const DiaryToUpdate = diaries[editIndex];
    await updateDoc(doc(db, 'diary', DiaryToUpdate.id), {
      title: newTitle,
      description: newDescription,
    });
    // Clear the input fields and reset editIndex
    clearInput();
    setEditIndex(null);
  }
};

//Cancel Edit function
const cancelEdit = () => {
  clearInput(); // Clear input fields
  setEditIndex(null); // Reset editIndex
};

// Delete Firebase Data
const deleteDiary = async (index: number) => {
  deleteDiaryToast('middle');
  const DiaryToDelete = diaries[index];
  // Delete diary from Firestore
  await deleteDoc(doc(db, 'diary', DiaryToDelete.id));
};

  return (
    <IonPage className="home-page">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/" />
          </IonButtons>
          <IonTitle>Diaries</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonCard id="card_body">
          <IonCardHeader>
            <IonCardTitle>
              <IonInput
                placeholder="Type your diary here"
                label="Add a diary..."
                id="custom-input"
                labelPlacement="floating"
                counter={true}
                maxlength={50}
                counterFormatter={(inputLength, maxLength) => `${maxLength - inputLength} / ${maxLength} characters remaining`}
                value={newTitle}
                onIonInput={(e) => setNewTitle(e.detail.value!)}
                ref={inputRefTitle}
              ></IonInput>
            </IonCardTitle>
            <IonCardSubtitle>
              <IonTextarea 
                placeholder="Type diary description here"
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
                <IonButton expand="block" onClick={editIndex !== null ? updateDiary : addDiary}>
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
        {/*Todo list output*/}
        <br></br>
        
      </IonContent>
    </IonPage>
  );
};

export default NewDiary;
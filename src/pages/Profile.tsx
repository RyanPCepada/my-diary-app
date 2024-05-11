import React from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonRow, IonCol, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCardSubtitle, IonButton, IonAlert, IonActionSheet } from '@ionic/react';
import './Profile.css';
import selfIntroVideo from '../assets/img/self_intro_video.mp4';

const Profile: React.FC = () => {

  // Function to handle the click event of the "Learn More" button
  const handleLearnMoreClick = () => {
    window.location.href = 'https://www.facebook.com/andreacrzalove.figueroa';
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Profile</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Profile</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonCard>
          <img alt="Profile" id="cover_pic" src="../src/assets/img/KIKIT_COVERPIC_PNG.png" />
          <IonRow>
            <IonCol size="4">
              <img alt="Profile" id="profile_pic" src="../src/assets/img/KIKIT_CIRCLE_PINK_PNG.png" />
            </IonCol>
            <IonCol size="8">
              <IonCardHeader>
                <IonCardTitle>Lovely Nicole Sapong Fifueroa</IonCardTitle>
                <IonCardSubtitle>Studied at: Northern Bukidnon State College</IonCardSubtitle>
                <IonCardSubtitle>Works at: Dahilayan Forest Park</IonCardSubtitle>
              </IonCardHeader>
            </IonCol>
          </IonRow>

          <IonCardContent>&#x1F64C; I Love Jesus &#x1F64C;</IonCardContent>

          <IonButton id="present-alert" expand="block" color="primary">Quick Facts</IonButton>
          <IonAlert
            trigger="present-alert"
            header="Explore Quick Facts?"
            subHeader="Unlock valuable insights"
            message="Discover a wealth of information with Quick Facts."
            buttons={[{
              text: 'Learn More',
              handler: handleLearnMoreClick // Call the handler function when the button is clicked
            }]}
          ></IonAlert>

          <IonButton id="open-action-sheet" expand="block" color="light">Open Action Sheet</IonButton>
          <IonActionSheet
            trigger="open-action-sheet"
            header="Actions"
            buttons={[
              {
                text: 'Delete',
                role: 'destructive',
                data: {
                  action: 'delete',
                },
              },
              {
                text: 'Share',
                data: {
                  action: 'share',
                },
              },
              {
                text: 'Cancel',
                role: 'cancel',
                data: {
                  action: 'cancel',
                },
              },
            ]}
          ></IonActionSheet>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default Profile;

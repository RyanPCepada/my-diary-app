import React, { useState } from 'react';
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
  IonSearchbar,
  IonBadge
} from '@ionic/react';

//Custom CSS
import './Home.css';

//Ionic Icons
import { pencil, book, logoIonic, logoReact } from 'ionicons/icons';

//Additional Routes
// import Click_counter from './Click_counter';


const cardData = [
  {
    title: 'Create Diary',
    icon: pencil,
    subtitle: 'How is your day going?',
    link: '/newdiary',
    tags: {
      tag1: logoIonic,
      tag2: logoReact
    }
  },
  {
    title: 'My Diary',
    icon: book,
    subtitle: 'See your diaries!',
    link: '/mydiary',
    tags: {
      tag1: logoIonic,
      tag2: logoReact
    }
  }
  
];

  const Home: React.FC = () => {

    {/*Dynamic Search*/}
    const [searchTerm, setSearchTerm] = useState<string>('');

    return (
      <IonPage className="home-page">
        <IonHeader>
          <IonToolbar>
            <IonTitle>Home</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen className="home-content">
          <img alt="background" id="profile_pic" src="../src/assets/img/GALAXY_GIF.gif"
          style={{width:'100%', position: 'absolute'}}/>
          <IonHeader collapse="condense">
            <IonToolbar>
              <IonTitle size="large">Home</IonTitle>
            </IonToolbar>
          </IonHeader>
        <>
          {cardData
            .map((card, index) => (
              <IonCard key={index} routerLink={card.link} routerDirection='forward' id="card_body">
                <IonCardHeader>
                  <IonCardTitle>
                    <IonGrid>
                      <IonRow>
                        <IonCol push=".75">
                          <IonIcon className="home-card-icon" icon={card.icon} />
                        </IonCol>
                        <IonCol pull='3'>
                          <div className="home-card-title">{card.title}</div>
                          <IonCardSubtitle>{card.subtitle}</IonCardSubtitle>
                        </IonCol>
                      </IonRow>
                    </IonGrid>
                  </IonCardTitle>
                </IonCardHeader>
              </IonCard>
          ))}
        </>
          </IonContent>
        </IonPage>
    );
  };
  
  //
  export default Home;
  
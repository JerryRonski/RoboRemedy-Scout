import { IonMenuButton, IonButtons, IonHeader, IonPage, IonToolbar, IonTitle, IonContent } from "@ionic/react";
import logo from '../assets/images/Dr.Scout.png';
import './Pages.css';

const HomePage = () => {

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar className="toolbar-spaced">
                    <div className="toolbar-content">
                        <IonButtons slot="start">
                            <IonMenuButton />
                        </IonButtons>
                        <IonTitle>Home</IonTitle>
                    </div>
                </IonToolbar>
            </IonHeader>

            <IonContent fullscreen className="ion-padding">
                <div className="dr-jerry-container">
                    <img src={logo} alt="Dr. Jerry as a Scout" className="dr-jerry-img" />
                </div>

                <div className="ion-text-center ion-margin-top">
                    <h1>Robo Remedy</h1>
                    <h6>v1.0 • © 2025 Jeremiah Ronski</h6>
                    <h6>For Robo Remedy FRC Team #7103</h6>
                </div>
            </IonContent>
        </IonPage>
    );
}

export default HomePage;
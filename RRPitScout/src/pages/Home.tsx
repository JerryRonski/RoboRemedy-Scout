import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from "@ionic/react";
import React from "react";
import './Pages.css';
import logo from '../assets/images/Dr.Scout.png';

const HomePage = () => {

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar className="toolbar-spaced">
                    <div className="toolbar-content">
                        <IonButtons>
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
import { IonMenuButton, IonButtons, IonHeader, IonPage, IonToolbar, IonTitle, IonContent } from "@ionic/react";
import logo from '../assets/images/Dr.Scout.png'

const HomePage = () => {

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonMenuButton />
                    </IonButtons>
                    <IonTitle>Home</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent>
                <div className="container-fluid">
                    <div className="row justify-content-center">
                        <div className="col-8">
                            <img src={logo} alt="Dr. Jerry as a Scout" className="dr_scout"/>
                        </div>
                    </div>
                    
                    <div className="row mt-5">
                        <div className="col-12 ion-text-center">
                            <h1>Robo Scout</h1>
                            <h6>1.0.26v</h6>
                        </div>
                    </div>
                </div>
            </IonContent>
        </IonPage>
    );
}

export default HomePage;
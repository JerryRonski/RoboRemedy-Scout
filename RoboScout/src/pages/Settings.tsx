import { IonContent, IonPage, IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonButton } from "@ionic/react";
import storage from "../storage";


const SettingsPage = () => {

    const handleClear = async () => {
        storage.set('entries', []);
        console.log( await storage.get('entries'));
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                    <IonMenuButton />
                    </IonButtons>
                    <IonTitle>Settings</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent>
                <IonButton expand="block" color="danger" onClick={handleClear}>Clear</IonButton>
            </IonContent>
        </IonPage>
    );

}

export default SettingsPage;
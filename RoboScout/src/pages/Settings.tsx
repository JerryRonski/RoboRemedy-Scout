import { IonContent, IonPage, IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonButton, IonSelect, IonSelectOption } from "@ionic/react";
import storage from "../storage";
import getConfig, { getConfigList, loadConfig } from "../assets/config";
import { useEffect, useState } from "react";


const SettingsPage = () => {
    const [versions, setVersions] = useState<string[]>([]);

    useEffect(() => {
        const load = async () => {
            await loadConfig(); // Waits for fetch to finish
            const vers = getConfigList();
            setVersions(vers); // Set local state or use vers as needed
        };

        load();
    }, []);

    const handleClear = async () => {
        storage.set('entries', []);
        console.log( await storage.get('entries'));
    }

    const handleVersion = async (e: CustomEvent) => {
        await storage.set('version', getConfig(e.detail.value));
        console.log(await storage.get('version'));
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
                <IonSelect placeholder="Select One" onIonChange={(e) => handleVersion(e)}>
                    {versions.map((ver, index) => (
                        <IonSelectOption key={index} value={ver}>
                            {ver}
                        </IonSelectOption>
                    ))}
                </IonSelect>
                <IonButton expand="block" color="danger" onClick={handleClear}>Clear</IonButton>
            </IonContent>
        </IonPage>
    );

}

export default SettingsPage;
import { IonContent, IonPage, IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonButton, IonSelect, IonSelectOption } from "@ionic/react";
import { DataService } from "../services/DataService";
import { ConfigService } from "../services/ConfigService";
import { useEffect, useState } from "react";


const SettingsPage = () => {
    const [versions, setVersions] = useState<string[]>([]);

    const dataService = new DataService();
    const configService = new ConfigService();

    useEffect(() => {
        const load = async () => {
            await dataService.ready();
            await configService.ready();
            setVersions(configService.getList());
            console.log(versions);
        };
        load();
    }, []);

    const handleClear = async () => {
        await dataService.set('entries', []);
        console.log( await dataService.get('entries'));
    }

    const handleVersion = async (e: CustomEvent) => {
        await dataService.set('currVers', configService.get(e.detail.value));
        console.log(await dataService.get('version'));
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar className="toolbar-spaced">
                    <div className="toolbar-content">
                        <IonButtons slot="start">
                            <IonMenuButton />
                        </IonButtons>
                        <IonTitle>Settings</IonTitle>
                    </div>
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
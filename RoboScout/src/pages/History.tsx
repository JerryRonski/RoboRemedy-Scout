import React, { useState } from "react";
import { IonButtons, IonContent, IonHeader, IonItem, IonLabel, IonList, IonMenuButton, IonPage, IonTitle, IonToolbar, useIonViewWillEnter, } from "@ionic/react";
import storage from "../storage";
import { useHistory } from "react-router";

interface MatchEntry {
    matchId: string;
    teamNumber: string;
}

const HistoryPage = () => {
    const [entries, setEntries] = useState<MatchEntry[]>([]);
    const history = useHistory();

    useIonViewWillEnter(() => {
        (async () => {
            const data = await storage.get('entries');
            setEntries(data || []);
        })();
    });
    
    const handleOnClick = (id: string) => {
        history.push(`/History/${id}`);
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonMenuButton />
                    </IonButtons>
                    <IonTitle>History</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent>
                <IonList>
                    {entries.map((entry: MatchEntry, index: number) => (
                        <IonItem button key={index} onClick={() => handleOnClick(entry.matchId)}>
                            <IonLabel>Match {entry.matchId} - Team {entry.teamNumber}</IonLabel>
                        </IonItem>
                    ))}
                </IonList>

            </IonContent>
        </IonPage>
    );
};

export default HistoryPage;
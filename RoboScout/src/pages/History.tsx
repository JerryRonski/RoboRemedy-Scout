import React, { useState } from "react";
import { IonButtons, IonContent, IonHeader, IonItem, IonLabel, IonList, IonMenuButton, IonPage, IonTitle, IonToolbar, useIonViewWillEnter, } from "@ionic/react";
import { DataService } from "../services/DataService";
import { useHistory } from "react-router";
import './Pages.css';
import { DynamicEntry } from "../assets/MatchEntry";

const HistoryPage = () => {
    const [entries, setEntries] = useState<DynamicEntry[]>([]);
    const history = useHistory();

    const dataService = new DataService();
    dataService.ready();

    useIonViewWillEnter(() => {
        (async () => {
            setEntries(await dataService.get('entries') || []);
        })();
    });
    
    const handleOnClick = (id: number, team: number) => {
        history.push(`/History/${id}/${team}`);
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar className="toolbar-spaced">
                    <div className="toolbar-content">
                        <IonButtons slot="start">
                            <IonMenuButton />
                        </IonButtons>
                        <IonTitle>History</IonTitle>
                    </div>
                </IonToolbar>
            </IonHeader>

            <IonContent>
                <IonList>
                    {entries.map((entry: DynamicEntry, index: number) => (
                        <IonItem button key={index} onClick={() => handleOnClick(entry.matchId, entry.teamNumber)}>
                            <IonLabel>Match {entry.matchId} - Team {entry.teamNumber}</IonLabel>
                        </IonItem>
                    ))}
                </IonList>

            </IonContent>
        </IonPage>
    );
};

export default HistoryPage;
import React, { useState } from "react";
import { IonButton, IonButtons, IonCol, IonContent, IonHeader, IonIcon, IonItem, IonList, IonModal, IonPage, IonRow, IonTitle, IonToolbar, useIonViewWillEnter } from "@ionic/react";
import { DataService } from "../services/DataService";
import { useParams } from "react-router-dom";
import QRCode from "qrcode";
import { arrowBack } from "ionicons/icons";
import { DynamicEntry } from "../assets/MatchEntry";

interface RouteParams {
  id: string;
  team: string
}

const MatchDetailsPage = () => {
    const [entry, setEntry] = useState<DynamicEntry>();
    const [qrCodeURL, setQrCodeUrl] = useState<string | null>(null);
    const [showQr, setShowQr] = useState(false);
    const { id, team } = useParams<RouteParams>();
    console.log("Id: " + id + " | #: " + team);

    const dataService = new DataService();
    dataService.ready();

    useIonViewWillEnter(() => {
        const load = async () => {
            setEntry(await dataService.getEntry(Number(id), Number(team)));
        }
        load(); 
    });

    const handleGenerate = async () => {
            console.log("Gen Clicked");
            try {
                const dataString = JSON.stringify(entry);
                const url = await QRCode.toDataURL(dataString);
                setQrCodeUrl(url);
                setShowQr(true);
                console.log("QR Code Generated");
            }
            catch (err) {
                console.error(err);
            }
        };


    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonButton onClick={() => history.back()}>
                            <IonIcon icon={arrowBack}></IonIcon>
                        </IonButton>
                    </IonButtons>

                    <IonTitle>Match Details</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                
                <IonList>
                    {entry && Object.keys(entry).map((key) => (
                        <IonRow>
                            <IonCol size="4">
                                <IonItem>
                                    <strong>{key}:</strong>
                                </IonItem>
                            </IonCol>
                            <IonCol size="6">
                                <IonItem>
                                    {String(entry[key])}
                                </IonItem>
                            </IonCol>
                        </IonRow>
                    ))}
                </IonList>

                <IonButton expand="block" color="success" className="ion-margin-bottom" onClick={handleGenerate}>Generate QR Code</IonButton>

                <IonModal isOpen={showQr} onDidDismiss={() => setShowQr(false)}>
                    <IonContent className="ion-padding ion-text-center">
                        <h2>QR Code</h2>
                        {qrCodeURL && <img src={qrCodeURL} alt="QR Code" style={{ width: '80%' }} />}
                        <IonButton className="ion-padding " expand="block" color="danger" onClick={() => setShowQr(false)}>Close</IonButton>
                    </IonContent>
                </IonModal>
            </IonContent>
        </IonPage>
    );
};

export default MatchDetailsPage;
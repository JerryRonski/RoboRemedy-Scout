import React, { useState } from "react";
import { IonContent, IonPage, IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonGrid, IonList, IonItem, IonInput, IonButton, IonRange, IonCheckbox, IonRadioGroup, IonRadio, IonModal, useIonAlert, IonRow, IonCol, IonText, useIonToast } from "@ionic/react";
import storage from "../storage";
import QRCode from 'qrcode';
import MatchEntry, { DynamicEntry } from "../assets/MatchEntry";
import test_config from '../assets/test_config.json';


const ScoutPage = () => {
    const [formData, setFormData] = useState(MatchEntry);
    const [showQr, setShowQr] = useState(false);
    const [qrCodeURL, setQrCodeUrl] = useState<string | null>(null);
    const [toast] = useIonToast();

    const [confirmClear] = useIonAlert();

    const handleChange = (e: CustomEvent, field: string, type: 'text' | 'number' | 'checkbox' = 'text') => {
        let value: string | number | boolean;
        
        if (type === 'checkbox') {
            value = (e.detail.checked ? true : false);
        } else if (type === 'number') {
            const raw = e.detail.value;
            value = typeof raw === 'number' ? raw : Number(raw ?? 0);
        } else {
            value = String(e.detail.value ?? '');
        }

        setFormData(prev => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSave = async () => {
        console.log("Save Clicked");
        const entries = await storage.get('entries') || [];

        const index = entries.findIndex((m: DynamicEntry) => m.matchId === Number(formData['matchId']) && m.teamNumber === Number(formData['teamNumber'])); // find existing entry
        console.log("Index: " + index)

        if (index !== -1) {
            entries[index] = formData; // replace existing
            toast({
                message: 'Entry updated',
                duration: 1500,
                color: 'warning',
            });
        } else {
            entries.push(formData); // add new
            toast({
                message: 'Entry saved',
                duration: 1500,
                color: 'success',
            });
        }

        await storage.set('entries', entries);
        console.log( await storage.get('entries') );
    };

    const handleGenerate = async () => {
        console.log("Gen Clicked");
        try {
            const dataString = JSON.stringify(formData);
            const url = await QRCode.toDataURL(dataString);
            setQrCodeUrl(url);
            setShowQr(true);
            console.log("QR Code Generated");
        }
        catch (err) {
            console.error(err);
        }
    };

    const resetData = (entry: DynamicEntry) => {
        const cleared: DynamicEntry = {matchId: 0, teamNumber: 0};

        for (const key in entry) {
            const valueType = typeof entry[key];

            if (valueType === 'string') {
                cleared[key] = '';
            } else if (valueType === 'number') {
                cleared[key] = '';
            } else if (valueType === 'boolean') {
                cleared[key] = false;
            }
        }

        setFormData(cleared);
    };

    const handleClear = () => {
        confirmClear({
            header: 'Clear Form?',
            message: 'This will clear all form data and QR Code Data',
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                },
                {
                    text: 'Clear',
                    role: 'destructive',
                    handler: () => {
                        resetData(formData);
                    },
                },
            ],
        });
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                    <IonMenuButton />
                    </IonButtons>
                    <IonTitle>Scout Form</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent>
                <IonGrid>
                    <IonList>
                        <IonRow>
                            <IonCol size="6">
                                <IonItem>
                                    <IonInput type="number" min={1} max={99} label="Match Number" labelPlacement="floating" placeholder="" value={formData.matchId} onIonChange={(e) => handleChange(e, "matchId", "number")} />
                                </IonItem>
                            </IonCol>

                            <IonCol size="6">
                                <IonItem>
                                    <IonInput type="number" min={1} max={9999} label="Team Number" labelPlacement="floating" placeholder="" value={formData.teamNumber} onIonChange={(e) => handleChange(e, "teamNumber", "number")} />
                                </IonItem>
                            </IonCol>
                        </IonRow>

                        {Object.entries(test_config.customFields).map(([fieldName, fieldType]) => { 
                            if (fieldType.type === 'text' || fieldType.type === 'number') { // render text or number input 
                                return (
                                    <IonItem key={fieldName}>
                                        <IonInput
                                            type={fieldType.type === 'number' ? 'number' : 'text'}
                                            label={fieldType.label}
                                            labelPlacement="floating"
                                            placeholder=""
                                            value={String(formData[fieldName])}
                                            onIonChange={(e) => handleChange(e, fieldName, (fieldType.type === 'number' ? 'number' : 'text'))}
                                        />
                                    </IonItem>
                                );
                            } else if (fieldType.type === 'range') { // render range
                                return (
                                    <IonItem>
                                        <IonRange 
                                            label={fieldType.label}
                                            labelPlacement="start"
                                            aria-label="Range with ticks" 
                                            pin={true} 
                                            ticks={true} 
                                            snaps={true} 
                                            min={0} 
                                            max={10} 
                                            value={Number(formData[fieldName])}
                                            onIonChange={(e) => handleChange(e, fieldName, "number")}
                                        />
                                    </IonItem>
                                );
                            } else if (fieldType.type === 'checkbox') { // render checkbox
                                return (
                                    <IonItem>
                                        <IonCheckbox 
                                            labelPlacement="end" 
                                            checked={Boolean(formData[fieldName])}
                                            onIonChange={(e) => handleChange(e, fieldName, 'checkbox')}
                                        >
                                            {fieldType.label}
                                        </IonCheckbox>
                                    </IonItem>
                                )
                            } else if (fieldType.type === 'radio') { // render radio buttons
                                const options = (fieldType as {options: Record<string, string> }).options;

                                return (
                                    <IonItem>
                                        <IonText>
                                            <h2>{fieldType.label}</h2>
                                        </IonText>

                                        <IonRadioGroup value={formData[fieldName]} onIonChange={(e) => handleChange(e, fieldName)}>
                                            {Object.entries(options).map(([optionValue, optionLabel]) => (
                                                <IonRadio className="ion-padding" value={optionValue}>
                                                    {optionLabel}
                                                </IonRadio>
                                            ))}
                                        </IonRadioGroup>
                                    </IonItem>
                                );
                            }

                            return null; // skip rendering if not a supported field
                        })}


                        <IonButton expand="block" color="medium" className="ion-margin-vertical" onClick={handleSave}>Save</IonButton>

                        <IonButton expand="block" color="success" className="ion-margin-bottom" onClick={handleGenerate}>Generate QR Code</IonButton>

                        <IonButton expand="block" color="danger" className="ion-margin-bottom" onClick={handleClear}>Clear</IonButton>


                    </IonList>
                </IonGrid>

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

}

export default ScoutPage;
import React, { useEffect, useState } from "react";
import { IonContent, IonPage, IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonGrid, IonList, IonItem, IonInput, IonButton, IonRange, IonCheckbox, IonRadioGroup, IonRadio, IonModal, useIonAlert, IonRow, IonCol, IonText, useIonToast } from "@ionic/react";
import { DataService } from "../services/DataService";
import QRCode from 'qrcode';
import { createMatchEntry, DynamicEntry } from "../assets/MatchEntry";
import './Pages.css';




const ScoutPage = () => {
    const [formData, setFormData] = useState<DynamicEntry | null>(null);  // where form data is saved
    const [showQr, setShowQr] = useState(false); // boolean for whether to show qr code
    const [qrCodeURL, setQrCodeUrl] = useState<string | null>(null); // qr string variable
    const [toast] = useIonToast(); // add/update/error pop-up notification 
    const [confirmClear] = useIonAlert(); // clear confirm pop-up
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [config, setConfig] = useState<Record<string, any> | null>(null);

    const dataService = new DataService(); // service/class that handles all data storage
    
    useEffect(() => { // handles the async
        const load = async () => {
            await dataService.ready();
            setConfig(await dataService.get('currVers'));

            const entry = await createMatchEntry();
            setFormData(entry);
        };
        load();
    }, []);

    // updates form with onIonInput(updates while typing) and onIonChange(updates on unfocus)
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
            ...(prev as DynamicEntry),
            [field]: value,
        }));
    };

    const handleSave = async () => {
        // console.log('save clicked');

        // leaves time for handleChange to run
        await new Promise(res => setTimeout(res, 500));

        let saveResult = ''

        if (formData) {
            saveResult = await dataService.addEntry(formData);
        } else {
            saveResult = 'null';
        }
        

        if (saveResult === 'add') {
            toast({
                message: "Entry Added",
                duration: 1500,
                position: 'bottom',
                color: 'success',
            });
        } else if (saveResult === 'update') {
            toast({
                message: "Entry Added",
                duration: 1500,
                position: 'bottom',
                color: 'warning',
            });
        } else if (saveResult === 'null') { 
            toast({
                message: "Entry can not be null",
                duration: 1500,
                position: 'bottom',
                color: 'danger',
            });
        }else {
            toast({
                message: "Failed to Save Entry",
                duration: 1500,
                position: 'bottom',
                color: 'danger',
            });
        }

        //console.log( await dataService.get('entries') );
    };

    // generates qr code and shows qr code
    const handleGenerate = async () => {
        // console.log("Gen Clicked");
        try {
            const dataString = JSON.stringify(formData);
            const url = await QRCode.toDataURL(dataString);
            setQrCodeUrl(url);
            setShowQr(true);
            //console.log("QR Code Generated");
        }
        catch (err) {
            console.error(err);
        }
    };

    // resets the formData
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

    // Clear confirm pop-up
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
                        if (formData) resetData(formData);
                    },
                },
            ],
        });
    };

    if (!formData || !config) {
        return (
            <IonPage>
                <IonHeader>
                    <IonToolbar>
                        <IonTitle>Loading...</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonContent className="ion-padding">
                    <IonText>Loading form data...</IonText>
                </IonContent>
            </IonPage>
        );
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar className="toolbar-spaced">
                    <div className="toolbar-content">
                        <IonButtons slot="start">
                            <IonMenuButton />
                        </IonButtons>
                        <IonTitle>Scout Form</IonTitle>
                    </div>
                </IonToolbar>
            </IonHeader>

            <IonContent>
                <IonGrid>
                    <IonList>
                        <IonRow>
                            {/* Generate the default Match Number and Team Number fields */}
                            <IonCol size="6">
                                <IonItem>
                                    <IonInput type="number" min={1} max={99} label="Match Number" labelPlacement="floating" placeholder="" value={formData.matchId} onIonInput={(e) => handleChange(e, "matchId", "number")} />
                                </IonItem>
                            </IonCol>

                            <IonCol size="6">
                                <IonItem>
                                    <IonInput type="number" min={1} max={9999} label="Team Number" labelPlacement="floating" placeholder="" value={formData.teamNumber} onIonInput={(e) => handleChange(e, "teamNumber", "number")} />
                                </IonItem>
                            </IonCol>
                        </IonRow>

                        {/* Dynamically Generate Fields from .JSON file */}
                        {config && Object.entries(config).map(([fieldName, fieldType]) => { 
                            if (fieldType.type === 'text' || fieldType.type === 'number') { // render text or number input 
                                /*
                                    use onIonInput for IonInput and IonTextarea, and onIonChange for everything else
                                    this is to make sure that they update properly so that it is saved properly
                                */
                                return (
                                    <IonItem key={fieldName}>
                                        <IonInput
                                            type={fieldType.type === 'number' ? 'number' : 'text'}
                                            label={fieldType.label}
                                            labelPlacement="floating"
                                            placeholder=""
                                            value={String(formData[fieldName])}
                                            onIonInput={(e) => handleChange(e, fieldName, (fieldType.type === 'number' ? 'number' : 'text'))}
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
                
                {/* Hidden Qr Code element */}
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
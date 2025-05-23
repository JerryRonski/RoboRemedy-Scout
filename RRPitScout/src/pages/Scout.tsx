/* eslint-disable @typescript-eslint/no-explicit-any */
import { IonButton, IonButtons, IonCheckbox, IonContent, IonHeader, IonInput, IonItem, IonItemDivider, IonLabel, IonList, IonMenuButton, IonPage, IonSelect, IonSelectOption, IonText, IonTextarea, IonTitle, IonToolbar } from "@ionic/react";
import { useState } from "react";
import pitConfig from '../assets/config.json';

const ScoutPage = () => {
    const [entry, setEntry] = useState<{ [key: string]: any }>({
        teamNum: 0,
        image: "",
    });

    const handleSave = () => {
        console.log(entry);
    };

    const formConfig = pitConfig["2025"];

    const renderForm = (key: string, config: any) => {
        const value = entry[key];
        const type = config.type;
        
        switch (type) {
            case "bool":
                return (
                    <IonItem key={key}>
                        <IonCheckbox
                            labelPlacement="end"
                            checked={!!value}
                            onChange={(e) => {
                                const customEvent = e as unknown as CustomEvent<{ checked: boolean }>;
                                setEntry({ ...entry, [key]: customEvent.detail.checked });
                            }}
                        >
                            {config.title}
                        </IonCheckbox>
                    </IonItem>
                );
            case "textarea":
                return (
                    <IonItem key={key}>
                        <IonTextarea
                            autoGrow={true}
                            label={config.title}
                            labelPlacement="stacked"
                            value={value}
                            onIonInput={(e) => setEntry({ ...entry, [key]: e.target.value })}
                        ></IonTextarea>
                    </IonItem>
                );
            case "text":
            case "number":
                return (
                    <IonItem key={key}>
                        <IonInput
                            type={type}
                            label={config.title}
                            labelPlacement="stacked"
                            value={value}
                            onIonInput={(e) => setEntry({ ...entry, [key]: e.target.value })}
                        />
                    </IonItem>
                );
            case "switch":
                return (
                    <IonItem key={key}>
                        <IonSelect 
                            label={config.title}
                            labelPlacement="stacked"
                            value={value}
                            onChange={(e) => setEntry({ ...entry, [key]: (e.target as HTMLSelectElement).value })}
                        >
                            {config.opt.map((o: string) => (
                                <IonSelectOption key={o} value={o}>{o}</IonSelectOption>
                            ))}
                        </IonSelect>
                    </IonItem>
                );
            case "check":
                return (
                    <div key={key} className="ion-margin-bottom">
                        <IonItem lines="none">
                            <IonLabel className="ion-text-wrap">
                                <strong>{config.title}</strong>
                            </IonLabel>
                        </IonItem>
                        
                        <div className="ion-padding-start">
                            {config.opt.map((option: string) => (
                                <IonItem key={option} lines="none" className="ion-no-padding">
                                    <IonCheckbox
                                        slot="start"
                                        labelPlacement="end"
                                        checked={Array.isArray(entry[key]) && entry[key].includes(option)}
                                        onIonChange={(e) => {
                                            const customEvent = e as unknown as CustomEvent<{ checked: boolean }>;
                                            const isChecked = customEvent.detail.checked;
                                            const currentValues = Array.isArray(entry[key]) ? [...entry[key]] : [];

                                            if (isChecked) {
                                                if (!currentValues.includes(option)) currentValues.push(option);
                                            } else {
                                                const index = currentValues.indexOf(option);
                                                if (index > -1) currentValues.splice(index, 1);
                                            }

                                            setEntry({ ...entry, [key]: currentValues });
                                        }}
                                    >
                                        {option}
                                    </IonCheckbox>
                                </IonItem>
                            ))}
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar className="toolbar-spaced">
                    <div className="toolbar-content">
                        <IonButtons>
                            <IonMenuButton />
                        </IonButtons>
                        <IonTitle>Pit Scout</IonTitle>
                    </div>
                </IonToolbar>
            </IonHeader>

            <IonContent fullscreen className="ion-padding">
                {Object.entries(formConfig).map(([section, fields]) => (
                    <IonList key={section}>
                        <IonItemDivider color="light">
                            <IonText>
                            <h3 className="ion-padding-horizontal ion-margin-vertical">
                                {section.toUpperCase()}
                            </h3>
                            </IonText>
                        </IonItemDivider>
                        
                        {
                            // eslint-disable-next-line @typescript-eslint/no-unused-vars
                            Object.entries(fields).map(([_, fieldConfig]) => {
                                const id = fieldConfig.id;
                                return renderForm(id, fieldConfig);
                            })
                        }
                    </IonList>
                ))}

                <IonButton expand="block" color="success" onClick={handleSave}>Save</IonButton>
            </IonContent>
        </IonPage>
    );
}

export default ScoutPage;
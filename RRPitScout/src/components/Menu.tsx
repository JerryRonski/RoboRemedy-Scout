import { IonContent, IonIcon, IonItem, IonLabel, IonList, IonListHeader, IonMenu, IonMenuToggle, IonNote, } from '@ionic/react';
import { useLocation } from 'react-router-dom';
import { clipboard, fileTray, home, settings } from 'ionicons/icons';
import './Menu.css';
import side_logo from '../assets/images/side_logo.png';

interface AppPage {
url: string;
iosIcon: string;
mdIcon: string;
title: string;
}

const appPages: AppPage[] = [
    {
        title: 'Home',
        url: '/Home',
        iosIcon: home,
        mdIcon: home
    },
    {
        title: 'Scout Form',
        url: '/Scout',
        iosIcon: clipboard,
        mdIcon: clipboard
    },
    {
        title: 'History',
        url: '/History',
        iosIcon: fileTray,
        mdIcon: fileTray
    },
    {
        title: 'Settings',
        url: '/Settings',
        iosIcon: settings,
        mdIcon: settings
    }
];

const Menu: React.FC = () => {
    const location = useLocation();

    return (
        <IonMenu contentId="main" type="overlay">
            <IonContent>
                <IonList id="inbox-list">
                    <IonListHeader className="ion-padding ion-text-center">
                        <div className="ion-align-items-center ion-justify-content-start ion-padding-start" style={{ display: 'flex', gap: '10px' }}>
                            <img src={side_logo} alt="Robo Remedy Logo" />
                            <h3 style={{ margin: 0 }}>Robo Scout</h3>
                        </div>
                    </IonListHeader>
                    <IonNote></IonNote> {/* Sub Note */}
                    {appPages.map((appPage, index) => {
                        return (
                            <IonMenuToggle key={index} autoHide={false}>
                                <IonItem 
                                    className={location.pathname === appPage.url ? 'selected' : ''} 
                                    routerLink={appPage.url} 
                                    routerDirection="none" 
                                    lines="none" detail={false}
                                >
                                    <IonIcon aria-hidden="true" slot="start" ios={appPage.iosIcon} md={appPage.mdIcon} />
                                    <IonLabel>{appPage.title}</IonLabel>
                                </IonItem>
                            </IonMenuToggle>
                        );
                    })}
                </IonList>
            </IonContent>
        </IonMenu>
    );
};

export default Menu;
// Imports
import {Alert} from 'react-native';
import {StatusBar} from 'expo-status-bar';
import {Slot, Redirect} from 'expo-router';
import {AuthContext} from '../../context/Auth';
import Tabs from '../../components/layout/Tabs';
import {Icon, Snackbar} from 'react-native-paper';
import {useContext, useEffect, useState} from 'react';
import messaging from '@react-native-firebase/messaging';





// Main function
export default function HomeLayout() {

    // User check
    const {user} = useContext(AuthContext);
    if(!user) return <Redirect href='/school-code' />;


    // Snack bar actions
    const [visible, setVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [messageStyle, setMessageStyle] = useState('');
    const onDismissSnackBar = () => setVisible(false);


    // // Reqquesting push messages permission (Working only in deployment build)
    // const requestPushMessagesPermission = async () => {
    //     const authStatus = await messaging().requestPermission();
    //     const enabled =
    //         authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    //         authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    //     if(enabled){
    //         console.log('Authorization status: ', authStatus);
    //     }
    // };


    // // Use effect (Working only in deployment build)
    // useEffect(() => {

    //     // Messaging request
    //     if(requestPushMessagesPermission()){
    //         messaging().getToken();
    //     }else{
    //         setMessageStyle('alert');
    //         setSnackbarMessage('Permission not granted');
    //         setVisible(true);
    //     };

    //     // Checking for initial notification
    //     messaging()
    //         .getInitialNotification()
    //         .then(async remoteMessage => {
    //             if(remoteMessage){
    //                 console.log('Notification caused app to open from quit state', remoteMessage.notification);
    //             }
    //         });

    //     // On notification opened app
    //     messaging().onNotificationOpenedApp(remoteMessage => {
    //         console.log('Notification caused app to open from quit state', remoteMessage.notification);
    //     });


    //     // Background notification
    //     messaging().setBackgroundMessageHandler(async remoteMessage => {
    //         console.log('Message handled in the background', remoteMessage);
    //     });


    //     // Unsubscribe
    //     const unsubscribe = messaging().onMessage(async remoteMessage => {
    //         Alert.alert('A new FCM message arrived', JSON.stringify(remoteMessage));
    //     });


    //     // Return
    //     return unsubscribe;

    // }, []);

    return (
        <>
            <StatusBar style='auto' />
            <Slot/>

            {/* Snackbar */}
            <Snackbar
                style={{backgroundColor:snackbarMessage === 'Error Downloading The Document' ? 'red' : 'green'}}
                visible={visible}
                onDismiss={onDismissSnackBar}
                action={{
                    label: <Icon source='close' color='#fff' size={20}/>,
                    onPress:() => setVisible(false)
                }}
            >
                {snackbarMessage}
            </Snackbar>

            <Tabs />
        </>

    );
};
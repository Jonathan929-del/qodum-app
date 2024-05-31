// Imports
import {Alert} from 'react-native';
import {StatusBar} from 'expo-status-bar';
import {Slot, Redirect} from 'expo-router';
import {useContext, useEffect} from 'react';
import {AuthContext} from '../../context/Auth';
import Tabs from '../../components/layout/Tabs';
import messaging from '@react-native-firebase/messaging';





// Main function
export default function HomeLayout() {

    // User check
    const {user} = useContext(AuthContext);
    if(!user) return <Redirect href='/school-code' />;


    // Reqquesting push messages permission (Working only in deployment build)
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
    //         messaging()
    //             .getToken()
    //             .then(token => {
    //                 console.log(token);
    //             });
    //     }else{
    //         console.log('Permission not granted');
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
            <Tabs />
        </>

    );
};
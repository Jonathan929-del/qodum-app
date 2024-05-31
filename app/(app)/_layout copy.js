// Imports
import '../../firebase';
import {app} from '../../firebase';
import {getAuth} from 'firebase/auth';
import messaging from '@react-native-firebase/messaging';
import {collection, getFirestore, setDoc} from 'firebase/firestore';

import {Alert} from 'react-native';
import {StatusBar} from 'expo-status-bar';
import {Slot, Redirect} from 'expo-router';
import {useContext, useEffect} from 'react';
import {AuthContext} from '../../context/Auth';
import Tabs from '../../components/layout/Tabs';





// Main function
export default function HomeLayout() {


    // User check
    const {user} = useContext(AuthContext);
    if(!user) return <Redirect href='/school-code' />;


    // Reqquesting push messages permission (Working only in deployment build)
    const requestPushMessagesPermission = async () => {
        const authStatus = await messaging().requestPermission();
        const enabled =
            authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if(enabled){
            console.log('Authorization status: ', authStatus);
        }
    };


    // Use effect (Working only in deployment build)
    useEffect(() => {

        // Messaging request
        if(requestPushMessagesPermission()){
            messaging()
                .getToken()
                .then(token => {
                    console.log(token);
                });
        }else{
            console.log('Permission not granted');
        };

        // Checking for initial notification
        messaging()
            .getInitialNotification()
            .then(async remoteMessage => {
                if(remoteMessage){
                    console.log('Notification caused app to open from quit state', remoteMessage.notification);
                }
            });

        // On notification opened app
        messaging().onNotificationOpenedApp(remoteMessage => {
            console.log('Notification caused app to open from quit state', remoteMessage.notification);
        });


        // Background notification
        messaging().setBackgroundMessageHandler(async remoteMessage => {
            console.log('Message handled in the background', remoteMessage);
        });


        // Unsubscribe
        const unsubscribe = messaging().onMessage(async remoteMessage => {
            Alert.alert('A new FCM message arrived', JSON.stringify(remoteMessage));
        });









        // Sending a test message
        const uid = getAuth().currentUser.uid;
        getFcmTokenAndSaveToFirestore(uid);

        const getFcmTokenAndSaveToFirestore = async (uid) => {
            try {
              // Get the FCM token
              const fcmToken = await messaging().getToken();
              if (fcmToken) {
                // Save the FCM token to Firestore
                const db = getFirestore(app);
                await setDoc(collection(db, 'users', uid), {
                    token:fcmToken,
                }, {merge:true});

              } else {
                console.log('Failed to get FCM token');
              }
            } catch (error) {
              console.error('Error getting FCM token or saving to Firestore:', error);
            }
          };



          const sendNotificationToStudents = async (title, body) => {
            const students = await collection('users').where('role', '==', 'student').get();
            const tokens = students.docs.map(doc => doc.data().fcmToken);
          
            const message = {
              registration_ids: tokens,
              notification: {
                title: title,
                body: body,
              },
            };
          
            try {
              const response = await fetch('https://fcm.googleapis.com/fcm/send', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(message),
              });
          
              if (response.ok) {
                Alert.alert('Notification sent successfully');
              } else {
                Alert.alert('Failed to send notification');
              }
            } catch (error) {
              console.error('Error sending notification:', error);
              Alert.alert('Error sending notification');
            }
          };
          sendNotificationToStudents('Hello Students!', 'This is a notification to all students.');













        // Return
        return unsubscribe;

    }, []);


    return (
        <>
            <StatusBar style='auto' />
            <Slot/>
            <Tabs />
        </>

    );
};
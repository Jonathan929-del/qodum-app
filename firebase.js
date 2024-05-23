// Imports
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/analytics';
import {Platform} from 'react-native';
import {initializeApp} from 'firebase/app';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';





// Configuration
const firebaseConfig = {
    apiKey:'AIzaSyCsz7AYm9jQRgfmhP3pZoznep_XqNX8Tgo',
    projectId:'qodum-9c179',
    project_number:'1045991956002',
    messagingSenderId:'1045991956002',
    packageName:'com.jonathanadel.qodum',
    appId:'1:1045991956002:android:b16751feaf386327f2347b'
};





// Firebase
export default function Firebase() {

    // Get tokem
    async function getFirebaseToken() {
        
        // Initialzing app
        initializeApp(firebaseConfig);

        // Vapid key
        const vapidKey = 'BHt4h5Hfhrkcl-FQHzpWWWjDg2ObRFLH04s2qOmhM-QLQWr1l8U64fla8A7DRhRpXV_78gdoJcs2E799MgJKx04';

        // Current user id
        const authUserId = 1;

        // Permission
        const hasPermissions = await messaging().hasPermission();

        // Get token
        function getFCMToken() {
            return messaging().getToken({
                vapidKey:vapidKey,
            });
        };

        // Setting user in the local storage
        if (Platform.OS === 'ios') {
            if (hasPermissions) {
                await messaging().registerDeviceForRemoteMessages();

                const fcmToken = await getFCMToken();

                await AsyncStorage.setItem('authUser', JSON.stringify({fcm_token:fcmToken, id:authUserId}));
            } else {
                await messaging().requestPermission();
            };
        } else if (Platform.OS === 'android') {
            if(hasPermissions){
                const fcmToken = await getFCMToken();
                await AsyncStorage.setItem('authUser', JSON.stringify({fcm_token:fcmToken, id:authUserId}));
            };
        };
    };

    // Get firebase token
    getFirebaseToken()
        .then((r) => console.log(r))
        .catch((error) => console.log(error));

};
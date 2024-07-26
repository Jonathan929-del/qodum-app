// Imports
import {app} from '../firebase';
import axios from 'axios';
import configs from '../configs';
import {AuthContext} from './Auth';
import {Snackbar} from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
// Change
import messaging from '@react-native-firebase/messaging';
import {createContext, useContext, useState, useEffect} from 'react';





// Creating context
const NotificationContext = createContext();





// Use notification
export const useNotification = () => useContext(NotificationContext);





// Notification provider
export const NotificationProvider = ({children}) => {

  // User
  const {user} = useContext(AuthContext);

  
  // States
  const [visible, setVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [messageStyle, setMessageStyle] = useState('');
  const onDismissSnackBar = () => setVisible(false);


  // Notifications count
  const [notificationsCount, setNotificationsCount] = useState(0);


  // Class notices count
  const [classNoticesCount, setClassNoticesCount] = useState(0);


  // Notices count
  const [noticesCount, setNoticesCount] = useState(0);


  // Ediaries count
  const [ediariesCount, setEdiariesCount] = useState(0);


  // Change
  // Request push notification
  const requestPushMessagesPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status: ', authStatus);
    }
  };


  // Use effect
  useEffect(() => {

    // Fetcher
    const fetcher = async () => {

      // Setting notifications count
      const notificationsLink = `${configs.EXPO_PUBLIC_API_URL}/notifications/notifications-count`;
      const notificationsRes = await axios.post(notificationsLink, {topic:[user.adm_no.replace(/\//g, '_'), user?.student?.class_name]});
      setNotificationsCount(notificationsRes.data);

      // Class notices count
      const classNoticesLink = `${configs.EXPO_PUBLIC_API_URL}/notifications/class-notices-count`;
      const classNoticesRes = await axios.post(classNoticesLink, {topic:[user.adm_no.replace(/\//g, '_'), user?.student?.class_name]});
      setClassNoticesCount(classNoticesRes.data);

      // Notices count
      const noticesLink = `${configs.EXPO_PUBLIC_API_URL}/notifications/notices-count`;
      const noticesRes = await axios.post(noticesLink, {topic:[user.adm_no.replace(/\//g, '_'), user?.student?.class_name]});
      setNoticesCount(noticesRes.data);

      // Ediaries count
      const ediariesCountLink = `${configs.EXPO_PUBLIC_API_URL}/notifications/ediaries-count`;
      const ediariesCountRes = await axios.post(ediariesCountLink, {topic:[user.adm_no.replace(/\//g, '_'), user?.student?.class_name]});
      setEdiariesCount(ediariesCountRes.data);

    };
    fetcher();


    // Change
    // Messaging request
    if(requestPushMessagesPermission()){
      messaging().getToken();
    }else{
      setMessageStyle('alert');
      setSnackbarMessage('Permission not granted');
      setVisible(true);
    };

    // On notification opened app
    // messaging().onNotificationOpenedApp(remoteMessage => {
    // console.log('Notification caused app to open from quit state', remoteMessage.notification);
    // });

    // Background notification
    // messaging().setBackgroundMessageHandler(async remoteMessage => {
    //     console.log('Message handled in the background', remoteMessage);
    // });


    // Change
    // Unsubscribe
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      setMessageStyle('green');
      setSnackbarMessage(remoteMessage.notification.body);
      setVisible(true);
    });


    // Change
    // Return
    return unsubscribe;

}, []);

  return (
    <NotificationContext.Provider value={{setMessageStyle, setSnackbarMessage, setVisible, notificationsCount, setNotificationsCount, classNoticesCount, setClassNoticesCount, noticesCount, setNoticesCount, ediariesCount, setEdiariesCount}}>
      {children}
      <Snackbar
        style={{ backgroundColor: messageStyle }}
        visible={visible}
        onDismiss={onDismissSnackBar}
        action={{
          label: <Icon name='close' color='#fff' size={20} />,
          onPress: () => setVisible(false),
        }}
      >
        {snackbarMessage}
      </Snackbar>
    </NotificationContext.Provider>
  );
};
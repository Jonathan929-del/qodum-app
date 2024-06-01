// Imports
import {Snackbar, Icon} from 'react-native-paper';
import messaging from '@react-native-firebase/messaging';
import {createContext, useContext, useState, useEffect} from 'react';





// Creating context
const NotificationContext = createContext();





// Use notification
export const useNotification = () => useContext(NotificationContext);





// Notification provider
export const NotificationProvider = ({ children }) => {

    
    const [visible, setVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [messageStyle, setMessageStyle] = useState('');
    const onDismissSnackBar = () => setVisible(false);

    const requestPushMessagesPermission = async () => {
        const authStatus = await messaging().requestPermission();
        const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (enabled) {
            console.log('Authorization status: ', authStatus);
        }
    };

    useEffect(() => {
        // Messaging request
        if (requestPushMessagesPermission()) {
        messaging().getToken();
        } else {
        setMessageStyle('alert');
        setSnackbarMessage('Permission not granted');
        setVisible(true);
        }

        // On notification opened app
        // messaging().onNotificationOpenedApp(remoteMessage => {
        // console.log('Notification caused app to open from quit state', remoteMessage.notification);
        // });

        // Background notification
        // messaging().setBackgroundMessageHandler(async remoteMessage => {
        //     console.log('Message handled in the background', remoteMessage);
        // });

        // Unsubscribe
        const unsubscribe = messaging().onMessage(async remoteMessage => {
            setMessageStyle('green');
            setSnackbarMessage(remoteMessage.notification.body);
            setVisible(true);
        });

        // Return
        return unsubscribe;
  }, []);

  return (
    <NotificationContext.Provider value={{setMessageStyle, setSnackbarMessage, setVisible}}>
      {children}
      <Snackbar
        style={{ backgroundColor: messageStyle }}
        visible={visible}
        onDismiss={onDismissSnackBar}
        action={{
          label: <Icon source='close' color='#fff' size={20} />,
          onPress: () => setVisible(false),
        }}
      >
        {snackbarMessage}
      </Snackbar>
    </NotificationContext.Provider>
  );
};

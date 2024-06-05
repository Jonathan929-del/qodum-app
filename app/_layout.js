// Imports
import '../firebase';
import {useEffect} from 'react';
import {Slot} from 'expo-router';
import theme from '../theme/theme';
import * as Updates from 'expo-updates';
import {StatusBar} from 'expo-status-bar';
import {AuthProvider} from '../context/Auth';
import {PaperProvider} from 'react-native-paper'
// import {NotificationProvider} from '../context/NotificationProvider';





// Main function
export default function HomeLayout() {


    // Update function
    const onFetchUpdateAsync = async  () => {
        try {
            const updates = await Updates.checkForUpdateAsync();
            if(updates.isAvailable){
                await Updates.fetchUpdateAsync();
                await Updates.reloadAsync();
            }
        }catch (error){
            alert(`Error fetching last expo update: ${error}`);
        }
    };


    // Use effect
    useEffect(() => {

        // Eas update
        onFetchUpdateAsync();

    }, []);


    return (
        <AuthProvider>
            {/* <NotificationProvider> */}
                <PaperProvider theme={theme}>
                    <StatusBar style='auto' />
                    <Slot/>
                </PaperProvider>
            {/* </NotificationProvider> */}
        </AuthProvider>
    );
};
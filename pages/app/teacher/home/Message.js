// Imports
import axios from 'axios';
import moment from 'moment';
import {Image, Text, View} from 'react-native';
import configs from '../../../../configs';
import {AuthContext} from '../../../../context/Auth';
import {ActivityIndicator} from 'react-native-paper';
import {useContext, useEffect, useState} from 'react';





// Main function
const Message = () => {

    // User
    const {user} = useContext(AuthContext);


    // Is loading
    const [isLoading, setIsLoading] = useState(false);


    // Flash messages
    const [flashMessages, setFlashMessages] = useState([]);


    // Use effect
    useEffect(() => {
        const fetcher = async () => {
            
            // Setting is loading to true
            setIsLoading(true);


            // Fetching flash messages
            const flashMessagesLink = `${configs.EXPO_PUBLIC_API_URL}/notifications/fetch-flash-messages`;
            const flashMessagesRes = await axios.get(flashMessagesLink);
            setFlashMessages(flashMessagesRes.data);


            // Setting is loading to false
            setIsLoading(false);

        };
        fetcher();
    }, []);

    return (
        <View style={{width:'100%', alignItems:'center', gap:10}}>
            {moment(new Date()).format('D-M-YYYY') === moment(new Date(user?.dob)).format('D-M-YYYY') && (
                <View>
                    <Text style={{textAlign:'center', fontSize:16, color:'green'}}>Happy Birthday {user?.name}!</Text>
                </View>
            )}
            {isLoading ? (
                <ActivityIndicator />
            ) : flashMessages.map(m => (
                <View
                    key={m.id}
                    style={{width:'90%', display:'flex', alignItems:'center', justifyContent:'center', padding:10, borderRadius:4, borderColor:'#000', borderWidth:1}}
                >
                    <Text style={{textAlign:'center'}}>{m.message}</Text>
                    {m.img && (
                        <Image
                            source={{uri:m.img}}
                            width={100}
                            height={50}
                        />
                    )}
                </View>
            ))}
        </View>
    );
};





// Export
export default Message
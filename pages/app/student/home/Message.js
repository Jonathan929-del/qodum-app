// Imports
import axios from 'axios';
import moment from 'moment';
import configs from '../../../../configs';
import {Image, Text, View,} from 'react-native';
import {AuthContext} from '../../../../context/Auth';
import {ActivityIndicator} from 'react-native-paper';
import {useContext, useEffect, useState} from 'react';





// Main function
const Message = () => {

    // User
    const {user} = useContext(AuthContext);


    // Overdue installmetns
    const [overdueInstallments, setOverdueInstallments] = useState([]);


    // Is loading
    const [isLoading, setIsLoading] = useState(false);


    // Flash messages
    const [flashMessages, setFlashMessages] = useState([]);


    // Use effects
    useEffect(() => {
        const fetcher = async () => {

            // Setting is loading to true
            setIsLoading(true);


            // Fetching overdue installments
            const overdueInstallmentsLink = `${configs.EXPO_PUBLIC_API_URL}/installments/overdues`;
            const overdueInstallmentsRes = await axios.post(overdueInstallmentsLink, {adm_no:user?.adm_no});
            setOverdueInstallments(overdueInstallmentsRes.data);


            // Fetching flash messages
            const flashMessagesLink = `${configs.EXPO_PUBLIC_API_URL}/notifications/fetch-flash-messages`;
            const flashMessagesRes = await axios.get(flashMessagesLink);
            setFlashMessages(flashMessagesRes.data);


            // Setting is loading to false
            setIsLoading(false);

        };
        if(user) fetcher();
    }, []);
    useEffect(() => {
        const fetcher = async () => {

            // Setting is loading to true
            setIsLoading(true);


            // Fetching overdue installments
            const overdueInstallmentsLink = `${configs.EXPO_PUBLIC_API_URL}/installments/overdues`;
            const overdueInstallmentsRes = await axios.post(overdueInstallmentsLink, {adm_no:user?.adm_no});
            setOverdueInstallments(overdueInstallmentsRes.data);


            // Fetching flash messages
            const flashMessagesLink = `${configs.EXPO_PUBLIC_API_URL}/notifications/fetch-flash-messages`;
            const flashMessagesRes = await axios.get(flashMessagesLink);
            setFlashMessages(flashMessagesRes.data);


            // Setting is loading to false
            setIsLoading(false);

        };
        if(user) fetcher();
    }, [user]);

    return (
        <View style={{width:'100%', alignItems:'center', paddingHorizontal:20, gap:10}}>
            {moment(new Date()).format('D-M-YYYY') === moment(new Date(user?.student?.dob)).format('D-M-YYYY') && (
                <View>
                    <Text style={{textAlign:'center', fontSize:16, color:'green'}}>Happy Birthday {user?.student?.name}!</Text>
                </View>
            )}
            {isLoading ? (
                <ActivityIndicator />
            ) : (
                <>

                    {/* Flash messages */}
                    {flashMessages.map(m => (
                        <View
                            key={m.id}
                            style={{width:'100%', display:'flex', alignItems:'center', justifyContent:'center', padding:10, borderRadius:4, borderColor:'#000', borderWidth:1}}
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

                    {/* Overdue installments */}
                    {overdueInstallments.map(i => (
                        <View
                            style={{width:'100%', borderWidth:1, borderColor:'red', padding:8, borderRadius:6}}
                            key={i._id}
                        >
                            <Text style={{fontSize:14, color:'red'}}>Warning! You are late on {i.name} payment.</Text>
                            <Text style={{fontSize:14, color:'red'}}>Due date was: {i.due_on_date.day}-{i.due_on_date.month}-{i.due_on_date.year}</Text>
                        </View>
                    ))}

                </>
            )}
        </View>
    );
};





// Export
export default Message;
// Imports
import axios from 'axios';
import moment from 'moment';
import {Text, View} from 'react-native';
import {AuthContext} from '../../../context/Auth';
import {useContext, useEffect, useState} from 'react';





// Main function
const Message = () => {

    // User
    const {user} = useContext(AuthContext);


    // Overdue installmetns
    const [overdueInstallments, setOverdueInstallments] = useState([]);


    // Use effect
    useEffect(() => {
        const fetcher = async () => {

            // Fetching overdue installments
            const overdueInstallmentsLink = `${process.env.EXPO_PUBLIC_API_URL}/installments/overdues`;
            const overdueInstallmentsRes = await axios.post(overdueInstallmentsLink, {adm_no:user.adm_no});
            setOverdueInstallments(overdueInstallmentsRes.data);
        };
        fetcher();
    }, []);

    return (
        <View style={{gap:10}}>
            {overdueInstallments.map(i => (
                <View
                    style={{borderWidth:1, borderColor:'red', padding:8, borderRadius:6}}
                    key={i._id}
                >
                    <Text style={{fontSize:14, color:'red'}}>Warning! You are late on {i.name} payment.</Text>
                    <Text style={{fontSize:14, color:'red'}}>Due date was: {i.due_on_date.day}-{i.due_on_date.month}-{i.due_on_date.year}</Text>
                </View>
            ))}
            {moment(new Date()).format('D-M-YYYY') === moment(new Date(user.student.dob)).format('D-M-YYYY') && (
                <View>
                    <Text style={{textAlign:'center', fontSize:16, color:'green'}}>Happy Birthday {user.student.name}!</Text>
                </View>
            )}
        </View>
    );
};





// Export
export default Message;
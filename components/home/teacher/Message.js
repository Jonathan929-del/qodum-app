// Imports
import moment from 'moment';
import {useContext} from 'react';
import {Text, View} from 'react-native';
import {AuthContext} from '../../../context/Auth';





// Main function
const Message = () => {

    // User
    const {user} = useContext(AuthContext);

    return (
        <View style={{gap:10}}>
            {moment(new Date()).format('D-M-YYYY') === moment(new Date(user.dob)).format('D-M-YYYY') && (
                <View>
                    <Text style={{textAlign:'center', fontSize:16, color:'green'}}>Happy Birthday {user.name}!</Text>
                </View>
            )}
        </View>
    );
};





// Export
export default Message
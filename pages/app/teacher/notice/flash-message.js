// Imports
import axios from 'axios';
import moment from 'moment';
import {useState} from 'react';
import configs from '../../../../configs';
import Icon from 'react-native-vector-icons/Ionicons';
import {Text, TouchableOpacity, View} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {TextInput as PaperTextInput, ActivityIndicator, Button} from 'react-native-paper';





// Main functions
export default function App({navigation}) {

    // States
    const [states, setStates] = useState({
        errors:{
            message:'',
            expires_on:''
        },
        loading:false,
        loadingData:false
    });


    // Openeded field
    const [openedField, setOpenedField] = useState('');


    // Receptients
    const [expiresOnDate, setExpiresOnDate] = useState(new Date());


    // Message
    const [message, setMessage] = useState('');


    // Submit handler
    const submitHandler = async () => {
        setStates({...states, loading:true});
        try {

            // Empty validations
            if(expiresOnDate < new Date() || !message){
                setStates({...states, errors:{
                    expires_on:expiresOnDate < new Date() ? '*Please select a future date' : '',
                    message:!message ? '*Please enter a message' : ''
                }});
                return;
            };
            

            // Sending notification
            const params = {
                message,
                expires_on:expiresOnDate
            };
            const notificationLink = `${configs.EXPO_PUBLIC_API_URL}/notifications/create-flash-message`;
            await axios.post(notificationLink, params);


            // Reseting
            setMessage('');
            setExpiresOnDate(new Date());
            setStates({...states, loading:false});
            navigation.navigate('teacher-notices', {isSubmitted:true});

        }catch(err){
            console.log(err);
        }
    };

    return (
        <View style={{height:'100%', alignItems:'center'}}>
            <View style={{width:'100%', display:'flex', flexDirection:'row', alignItems:'flex-end', justifyContent:'space-between', paddingHorizontal:10, paddingVertical:30, backgroundColor:'#0094DA', borderBottomRightRadius:40, borderBottomLeftRadius:40}}>
                <View style={{display:'flex', flexDirection:'row', alignItems:'center', gap:20}}>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('teacher-notices')}
                    >
                        <Icon name='arrow-back-outline' size={35} color='#fff'/>
                    </TouchableOpacity>
                    <Text style={{textAlign:'center', fontSize:18, color:'#fff', fontWeight:'900'}}>Flash Message</Text>
                </View>
            </View>


            {/* Send notice */}
            {states.loadingData ? (
                <View style={{paddingTop:50}}>
                    <ActivityIndicator />
                </View>
            ) : (
                <View style={{width:'80%', flex:1, display:'flex', flexDirection:'column', justifyContent:'space-between', paddingVertical:50}}>


                    <View style={{gap:10}}>

                        {/* Message */}
                        <View style={{gap:6}}>
                            <Text>Message</Text>
                            <View style={{position:'relative', width:'100%'}}>
                                <Icon name='pencil' size={30} color='gray' style={{position:'absolute', zIndex:2, top:10, left:10}}/>
                                <PaperTextInput
                                    placeholder='Enter Message'
                                    onBlur={v => setStates({states, errors:{...states.errors, message:v === ''  ? '*Please enter a message' : ''}})}
                                    placeholderTextColor='gray'
                                    style={{paddingLeft:35, backgroundColor:'#F5F5F8'}}
                                    value={message}
                                    multiline
                                    numberOfLines={4}
                                    onChangeText={v => setMessage(v)}
                                />
                            </View>
                            {states.errors.message !== '' && <Text style={{color:'red', marginTop:-6}}>{states.errors.message}</Text>}
                        </View>


                        {/* Expires On */}
                        <View style={{gap:6}}>
                            <Text>Expires On</Text>
                            <TouchableOpacity
                                onPress={() => setOpenedField('expires_on')}
                                style={{display:'flex', flexDirection:'row', alignItems:'center', backgroundColor:'#F5F5F8', height:60, paddingHorizontal:20, borderTopLeftRadius:5, borderTopRightRadius:5, borderBottomWidth:openedField === 'expires_on' ? 2 : 1, borderBottomColor:openedField === 'expires_on' ? '#0094DA' : 'gray'}}
                            >
                                <Icon name='calendar' size={30} color='gray'/>
                                <Text style={{marginLeft:10}}>{moment(expiresOnDate).format('D-M-YYYY')}</Text>
                            </TouchableOpacity>
                            {openedField === 'expires_on' && (
                                <DateTimePicker
                                    mode='date'
                                    display='spinner'
                                    value={expiresOnDate}
                                    onChange={(v, date) => {
                                        setOpenedField('');
                                        setExpiresOnDate(date);
                                    }}
                                />
                            )}
                            {states.errors.expires_on !== '' && <Text style={{color:'red', marginTop:-6}}>{states.errors.expires_on}</Text>}
                        </View>

                    </View>


                    {/* Button */}
                    {states.loading ? (
                        <ActivityIndicator />
                    ) : (
                        <Button
                            onPress={submitHandler}
                            textColor='#fff'
                            style={{backgroundColor:'#0094DA', borderRadius:4}}
                        >
                            Submit
                        </Button>
                    )}
                    {states.errors.receptients !== '' && <Text style={{color:'red'}}>{states.errors.receptients}</Text>}

                </View>
            )}
        </View>
    );
};
// Imports
import axios from 'axios';
import {useState} from 'react';
import {router, useLocalSearchParams} from 'expo-router';
import {Text, TouchableOpacity, View} from 'react-native';
import {TextInput as PaperTextInput, ActivityIndicator, Icon, Button} from 'react-native-paper';





// Main functions
export default function App() {

    // Local params
    const classNotice = useLocalSearchParams();


    // States
    const [states, setStates] = useState({
        errors:{
            message:''
        },
        loading:false,
        loadingData:false
    });


    // Message
    const [message, setMessage] = useState(classNotice.body);


    // Submit handler
    const submitHandler = async () => {
        setStates({...states, loading:true});
        try {

            // Empty validations
            if(!message){
                setStates({...states, errors:{
                    message:!message ? '*Please enter a message' : ''
                }});
                return;
            };
            
            // Sending notification
            const params = {
                id:classNotice.id,
                body:message
            };
            const notificationLink = `${process.env.EXPO_PUBLIC_API_URL}/notifications/edit-class-notice`;
            await axios.post(notificationLink, params);

            // Reseting
            setMessage('');
            setStates({...states, loading:false});
            router.push({pathname:'/class-notice/teacher', params:{isEdited:true}});
        }catch(err){
            console.log(err);
        }
    };

    return (
        <View style={{height:'100%', alignItems:'center'}}>
            <View style={{width:'100%', height:120, display:'flex', flexDirection:'row', alignItems:'flex-end', justifyContent:'space-between', paddingHorizontal:10, paddingBottom:30, backgroundColor:'#0094DA', borderBottomRightRadius:40, borderBottomLeftRadius:40}}>
                <View style={{display:'flex', flexDirection:'row', alignItems:'center', gap:20}}>
                    <TouchableOpacity
                        onPress={() => router.push('/class-notice/teacher')}
                    >
                        <Icon source='chevron-left' size={40} color='#fff'/>
                    </TouchableOpacity>
                    <Text style={{textAlign:'center', fontSize:18, color:'#fff', fontWeight:'900'}}>Edit Class Notice</Text>
                </View>
            </View>

            {/* Send class notice */}
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
                                <PaperTextInput
                                    placeholder='Enter Message'
                                    onBlur={v => setStates({states, errors:{...states.errors, message:v === ''  ? '*Please enter a message' : ''}})}
                                    placeholderTextColor='gray'
                                    style={{backgroundColor:'#F5F5F8'}}
                                    left={<PaperTextInput.Icon icon='pencil-outline' size={30} color='gray'/>}
                                    value={message}
                                    multiline
                                    numberOfLines={4}
                                    onChangeText={v => setMessage(v)}
                                />
                            {states.errors.message !== '' && <Text style={{color:'red', marginTop:-6}}>{states.errors.message}</Text>}
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

                </View>
            )}

        </View>
    );
};
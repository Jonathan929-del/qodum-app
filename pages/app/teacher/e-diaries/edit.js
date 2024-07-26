// Imports
import axios from 'axios';
import {useState} from 'react';
import configs from '../../../../configs';
import Icon from 'react-native-vector-icons/Ionicons';
import {Text, TouchableOpacity, View} from 'react-native';
import {TextInput as PaperTextInput, ActivityIndicator, Button} from 'react-native-paper';





// Main functions
export default function App({navigation, route}) {

    // Notice
    const {notice} = route.params;


    // States
    const [states, setStates] = useState({
        errors:{
            title:'',
            message:''
        },
        loading:false,
        loadingData:false
    });


    // Message
    const [message, setMessage] = useState(notice.body);


    // Title
    const [title, setTitle] = useState(notice.title);


    // Submit handler
    const submitHandler = async () => {
        setStates({...states, loading:true});
        try {

            // Empty validations
            if(!title || !message){
                setStates({...states, errors:{
                    title:!title ? '*Please enter a title' : '',
                    message:!message ? '*Please enter a message' : '',
                }});
                return;
            };
            
            // Sending notification
            const params = {
                title,
                body:message,
                notice_id:Number(notice.notice_id)
            };
            const notificationLink = `${configs.EXPO_PUBLIC_API_URL}/notifications/edit-ediary`;
            const res = await axios.post(notificationLink, params);

            // Reseting
            setTitle('');
            setMessage('');
            setStates({...states, loading:false});
            navigation.navigate('teacher-ediaries', {isEdited:true});

        }catch(err){
            console.log(err);
        }
    };

    return (
        <View style={{height:'100%', alignItems:'center'}}>
            <View style={{width:'100%', display:'flex', flexDirection:'row', alignItems:'flex-end', justifyContent:'space-between', paddingHorizontal:10, paddingVertical:30, backgroundColor:'#0094DA', borderBottomRightRadius:40, borderBottomLeftRadius:40}}>
                <View style={{display:'flex', flexDirection:'row', alignItems:'center', gap:20}}>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('teacher-ediaries')}
                    >
                        <Icon name='arrow-back-outline' size={35} color='#fff'/>
                    </TouchableOpacity>
                    <Text style={{textAlign:'center', fontSize:18, color:'#fff', fontWeight:'900'}}>Edit</Text>
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

                        {/* Title */}
                        <View style={{gap:6}}>
                            <Text>Title</Text>
                            <View style={{position:'relative'}}>
                                <Icon name='pencil' size={30} color='gray' style={{position:'absolute', top:'25%', left:10, zIndex:2}}/>
                                <PaperTextInput
                                    placeholder='Enter Title'
                                    onBlur={v => setStates({states, errors:{...states.errors, title:v === ''  ? '*Please enter a title' : ''}})}
                                    placeholderTextColor='gray'
                                    style={{paddingLeft:35, backgroundColor:'#F5F5F8'}}
                                    value={title}
                                    onChangeText={v => setTitle(v)}
                                />
                            </View>
                            {states.errors.title !== '' && <Text style={{color:'red', marginTop:-6}}>{states.errors.title}</Text>}
                        </View>


                        {/* Message */}
                        <View style={{gap:6}}>
                            <Text>Message</Text>
                            <View style={{position:'relative'}}>
                                <Icon name='pencil' size={30} color='gray' style={{position:'absolute', top:10, left:10, zIndex:2}}/>
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
                            Edit
                        </Button>
                    )}

                </View>
            )}
        </View>
    );
};
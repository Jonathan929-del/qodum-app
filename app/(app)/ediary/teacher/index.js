// Imports
import axios from 'axios';
import {router} from 'expo-router';
import {AuthContext} from '../../../../context/Auth';
import {useContext, useEffect, useState} from 'react';
import {Image, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {TextInput as PaperTextInput, ActivityIndicator, Icon, Button, Snackbar, Checkbox, RadioButton} from 'react-native-paper';





// Main functions
export default function App() {

    // Snack bar actions
    const [visible, setVisible] = useState(false);
    const onDismissSnackBar = () => setVisible(false);


    // Opened dropdown
    const [openedField, setOpenedField] = useState('');


    // User
    const {user} = useContext(AuthContext);


    // States
    const [states, setStates] = useState({
        errors:{
            receptient:'',
            title:'',
            message:''
        },
        loading:false,
        loadingData:false
    });


    // Receptients
    const [receptients, setReceptients] = useState([]);
    const [selectedReceptient, setSelectedReceptient] = useState({});
    console.log(selectedReceptient);


    // Message
    const [message, setMessage] = useState('');


    // Title
    const [title, setTitle] = useState('');


    // Receptients dropdown
    const receptientsDropdown = (
        <ScrollView style={{position:'absolute', width:'100%', maxHeight:300, top:85, paddingVertical:6, zIndex:10, backgroundColor:'#fff', borderWidth:1, borderTopWidth:0, borderColor:'#ccc', borderBottomLeftRadius:4, borderBottomRightRadius:4}}>
            {receptients?.map(r => (
                <View style={{display:'flex', flexDirection:'row', alignItems:'center', gap:6, paddingVertical:4, borderBottomWidth:receptients.indexOf(r) === receptients.length - 1 ? 0 : 1, borderBottomColor:'#ccc'}}>
                    <RadioButton
                        status={selectedReceptient.adm_no === r.adm_no ? 'checked' : 'unchecked'}
                        onPress={() => setSelectedReceptient(r)}
                    />
                    {r?.image ? (
                        <Image
                            source={{uri:r?.image}}
                            style={{width:40, height:40, alignItems:'center', justifyContent:'center', borderWidth:1, borderColor:'#ccc', borderRadius:30}}
                        />
                    ) : (
                        <View style={{width:40, height:40, alignItems:'center', justifyContent:'center', borderWidth:1, borderColor:'#ccc', borderRadius:30}}>
                            <Text style={{fontSize:8, color:'gray'}}>No Photo</Text>
                        </View>
                    )}
                    <View style={{display:'flex', flexDirection:'column'}}>
                        <Text style={{fontWeight:'600'}}>{r.name}</Text>
                        <Text style={{fontSize:11, color:'gray'}}>{r.role}</Text>
                    </View>
                </View>
            ))}
        </ScrollView>
    );


    // Submit handler
    const submitHandler = async () => {
        setStates({...states, loading:true});
        try {

            // Empty validations
            if(!selectedReceptient?.name || !title || !message){
                setStates({...states, errors:{
                    receptient:!selectedReceptient?.name ? '*Please select a receptient' : '',
                    title:!title ? '*Please enter a title' : '',
                    message:!message ? '*Please enter a message' : '',
                }});
                return;
            };
            
            // Sending e diary
            const params = {
                title,
                body:message,
                topic:selectedReceptient.adm_no.replace(/\//g, '_'),
                type:'ediary',
                created_by:user.adm_no.replace(/\//g, '_'),
            };
            const notificationLink = `${process.env.EXPO_PUBLIC_API_URL}/notifications/send-ediary`;
            await axios.post(notificationLink, params);

            // Reseting
            setTitle('');
            setMessage('');
            setStates({...states, loading:false});
            setVisible(true);

        }catch(err){
            console.log(err);
        }
    };


    // Use effect
    useEffect(() => {
        setStates({...states, loadingData:true});
        const fetcher = async () => {

            // Students response
            const studentsLink = `${process.env.EXPO_PUBLIC_API_URL}/students/adm-nos`;
            const studentsRes = await axios.get(studentsLink);
            setReceptients(studentsRes.data);


            setStates({...states, loadingData:false});

        };
        fetcher()
    }, []);

    return (
        <View style={{height:'100%', alignItems:'center'}}>
            <View style={{width:'100%', height:120, display:'flex', flexDirection:'row', alignItems:'flex-end', justifyContent:'space-between', paddingHorizontal:10, paddingBottom:30, backgroundColor:'#0094DA', borderBottomRightRadius:40, borderBottomLeftRadius:40}}>
                <View style={{display:'flex', flexDirection:'row', alignItems:'center', gap:20}}>
                    <TouchableOpacity
                        onPress={() => router.push('/')}
                    >
                        <Icon source='chevron-left' size={40} color='#fff'/>
                    </TouchableOpacity>
                    <Text style={{textAlign:'center', fontSize:18, color:'#fff', fontWeight:'900'}}>E-diary</Text>
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

                        {/* Receptient */}
                        <View style={{gap:6, position:'relative'}}>
                            <Text>Receptient</Text>
                            <TouchableOpacity
                                onPress={() => {
                                    if(openedField === 'receptient'){
                                        setOpenedField('');
                                        selectedReceptient && setStates({...states, errors:{...states.errors, receptient:''}})
                                    }else{
                                        setOpenedField('receptient');
                                    }
                                }}
                                style={{display:'flex', flexDirection:'row', alignItems:'center', backgroundColor:'#F5F5F8', height:60, paddingHorizontal:20, borderTopLeftRadius:5, borderTopRightRadius:5, borderBottomWidth:1, borderBottomColor:openedField === 'receptients' ? '#0094DA' : 'gray'}}
                            >
                                {openedField === 'receptient' ? (
                                    <Icon source='chevron-up' size={30} color='gray'/>
                                ) : (
                                    <Icon source='chevron-down' size={30} color='gray'/>
                                )}
                                <Text style={{marginLeft:10}}>{!selectedReceptient?.name ? 'Select Receptient' : selectedReceptient?.name}</Text>
                            </TouchableOpacity>
                            {openedField === 'receptient' && receptientsDropdown}
                            {states.errors.receptient !== '' && <Text style={{color:'red'}}>{states.errors.receptient}</Text>}
                        </View>


                        {/* Title */}
                        <View style={{gap:6}}>
                            <Text>Title</Text>
                                <PaperTextInput
                                    placeholder='Enter Title'
                                    onBlur={v => setStates({states, errors:{...states.errors, title:v === ''  ? '*Please enter a title' : ''}})}
                                    placeholderTextColor='gray'
                                    style={{backgroundColor:'#F5F5F8'}}
                                    left={<PaperTextInput.Icon icon='pencil-outline' size={30} color='gray'/>}
                                    value={title}
                                    onChangeText={v => setTitle(v)}
                                />
                            {states.errors.title !== '' && <Text style={{color:'red', marginTop:-6}}>{states.errors.title}</Text>}
                        </View>


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

            {/* Snackbar */}
            <Snackbar
                style={{backgroundColor:'green'}}
                visible={visible}
                onDismiss={onDismissSnackBar}
                action={{
                    label: <Icon source='close' color='#fff' size={20}/>,
                    onPress:() => setVisible(false)
                }}
            >
                Notice Sent Successfully!
            </Snackbar>

        </View>
    );
};
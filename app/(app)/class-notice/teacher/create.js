// Imports
import axios from 'axios';
import {router} from 'expo-router';
import {AuthContext} from '../../../../context/Auth';
import {useContext, useEffect, useState} from 'react';
import {ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {TextInput as PaperTextInput, ActivityIndicator, Icon, Button, Checkbox} from 'react-native-paper';





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
            classes:'',
            title:'',
            message:'',
        },
        loading:false,
        loadingData:false
    });


    // Classes
    const [classes, setClasses] = useState([]);
    const [selectedClasses, setSelectedClasses] = useState([]);


    // Title
    const [title, setTitle] = useState('');


    // Message
    const [message, setMessage] = useState('');


    // Classes dropdown
    const classesDropdown = (
        <ScrollView style={{width:'100%', maxHeight:300, paddingVertical:6, borderWidth:1, borderColor:'#ccc', borderBottomLeftRadius:4, borderBottomRightRadius:4}}>
            <View style={{display:'flex', flexDirection:'row', alignItems:'center', marginBottom:6, borderBottomWidth:1, borderBottomColor:'#ccc'}}>
                <Checkbox
                    status={classes.length === selectedClasses.length ? 'checked' : 'unchecked'}
                    onPress={() => classes.length === selectedClasses.length ? setSelectedClasses([]) : setSelectedClasses(classes)}
                />
                <Text style={{fontWeight:'600'}}>Select All</Text>
            </View>


            {/* Students */}
            {classes.length == 0 ? (
                <Text>
                    No classes
                </Text>
            ) : (
                <>
                    {classes?.map(c => (
                        <View style={{display:'flex', flexDirection:'row', alignItems:'center', gap:6, paddingVertical:4, borderBottomWidth:classes.indexOf(c) === classes.length - 1 ? 0 : 1, borderBottomColor:'#ccc'}}>
                            <Checkbox
                                status={selectedClasses.includes(c) ? 'checked' : 'unchecked'}
                                onPress={() => selectedClasses.includes(c)
                                    ? setSelectedClasses(selectedClasses.filter(sc => sc.class_name !== c.class_name))
                                    : setSelectedClasses([...selectedClasses, c])}
                            />
                            <Text style={{fontWeight:'600'}}>{c.class_name}</Text>
                        </View>
                    ))}
                </>
            )}
        </ScrollView>
    );


    // Submit handler
    const submitHandler = async () => {
        setStates({...states, loading:true});
        try {

            // Empty validations
            if(selectedClasses.length == 0 || !title || !message){
                setStates({...states, errors:{
                    classes:selectedClasses.length == 0 ? '*Please select at least one class' : '',
                    title:!title ? '*Please enter a title' : '',
                    message:!message ? '*Please enter a message' : '',
                }});
                return;
            };
            
            // Sending notification
            const randomNumber = Math.floor(Math.random() * 1000000) + 1;
            selectedClasses.concat({class_name:user.adm_no.replace(/\//g, '_')}).map(async c => {
                const params = {
                    title,
                    body:message,
                    topic:c.class_name,
                    type:'class_notice',
                    created_by:user.adm_no.replace(/\//g, '_'),
                    class_notice_id:randomNumber
                };
                const notificationLink = `${process.env.EXPO_PUBLIC_API_URL}/notifications/send-class-notice`;
                await axios.post(notificationLink, params);
            })

            // Reseting
            setSelectedClasses([]);
            setMessage('');
            setStates({...states, loading:false});
            router.push({pathname:'/class-notice/teacher', params:{isSubmitted:true}})
        }catch(err){
            console.log(err);
        }
    };


    // Use effect
    useEffect(() => {
        setStates({...states, loadingData:true});
        const fetcher = async () => {

            // classes response
            const classesLink = `${process.env.EXPO_PUBLIC_API_URL}/classes/names`;
            const classesRes = await axios.get(classesLink);
            setClasses(classesRes.data);
            setStates({...states, loadingData:false});

        };
        fetcher()
    }, []);

    return (
        <View style={{height:'100%', alignItems:'center'}}>
            <View style={{width:'100%', height:120, display:'flex', flexDirection:'row', alignItems:'flex-end', justifyContent:'space-between', paddingHorizontal:10, paddingBottom:30, backgroundColor:'#0094DA', borderBottomRightRadius:40, borderBottomLeftRadius:40}}>
                <View style={{display:'flex', flexDirection:'row', alignItems:'center', gap:20}}>
                    <TouchableOpacity
                        onPress={() => router.push('/class-notice/teacher')}
                    >
                        <Icon source='chevron-left' size={40} color='#fff'/>
                    </TouchableOpacity>
                    <Text style={{textAlign:'center', fontSize:18, color:'#fff', fontWeight:'900'}}>Compose Message</Text>
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

                        {/* Classes */}
                        <View style={{gap:0}}>
                            <Text>Classes</Text>
                            <TouchableOpacity
                                onPress={() => openedField === 'classes' ? setOpenedField('') : setOpenedField('classes')}
                                style={{display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'space-between', marginTop:6, backgroundColor:'#F5F5F8', height:60, paddingHorizontal:10, borderTopLeftRadius:5, borderTopRightRadius:5, borderBottomWidth:1, borderBottomColor:openedField === 'classes' ? '#0094DA' : 'gray'}}
                            >
                                <Text style={{marginLeft:10}}>{selectedClasses.length == 0 ? 'Select Classes' : selectedClasses.length === 1 ? '1 Class Selected' : `${selectedClasses.length} Classes Selected`}</Text>
                                {openedField === 'classes' ? (
                                    <Icon source='chevron-up' size={30} color='gray'/>
                                ) : (
                                    <Icon source='chevron-down' size={30} color='gray'/>
                                )}
                            </TouchableOpacity>
                            {openedField === 'classes' && classesDropdown}
                            {states.errors.classes !== '' && <Text style={{color:'red'}}>{states.errors.classes}</Text>}
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

        </View>
    );
};
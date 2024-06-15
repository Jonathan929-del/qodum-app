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
            classes:'',
            receptient:'',
            title:'',
            message:''
        },
        loading:false,
        loadingData:false
    });


    // Receptients
    const [classes, setClasses] = useState([]);
    const [selectedClasses, setSelectedClasses] = useState([]);


    // Receptients
    const [receptients, setReceptients] = useState([]);
    const [selectedReceptients, setSelectedReceptients] = useState([]);


    // Message
    const [message, setMessage] = useState('');


    // Title
    const [title, setTitle] = useState('');


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


    // Receptients dropdown
    const receptientsDropdown = (
        <ScrollView style={{width:'100%', paddingVertical:6}}>
            <View style={{display:'flex', flexDirection:'row', alignItems:'center', marginBottom:6, borderBottomWidth:1, borderBottomColor:'#ccc'}}>
                <Checkbox
                    status={receptients.length === selectedReceptients.length ? 'checked' : 'unchecked'}
                    onPress={() => selectedReceptients.length === receptients.length ? setSelectedReceptients([]) : setSelectedReceptients(receptients)}
                />
                <Text style={{fontWeight:'600'}}>Select All</Text>
            </View>


            {/* Students */}
            {receptients?.length > 0 && (
                <>
                    <View style={{display:'flex', flexDirection:'row', alignItems:'center', marginBottom:6, borderBottomWidth:1, borderBottomColor:'#ccc'}}>
                        <Checkbox
                            status={receptients.length === selectedReceptients.length ? 'checked' : 'unchecked'}
                            onPress={() => receptients?.length === selectedReceptients?.length ? setSelectedReceptients(selectedReceptients) : setSelectedReceptients(receptients)}
                        />
                        <Text style={{fontWeight:'600'}}>Students</Text>
                    </View>
                    {receptients?.map(r => (
                        <View style={{display:'flex', flexDirection:'row', alignItems:'center', gap:6, marginLeft:20, paddingVertical:4, borderLeftColor:'#0094DA', borderLeftWidth:1, borderBottomWidth:receptients.indexOf(r) === receptients.length - 1 ? 0 : 1, borderBottomColor:'#ccc'}}>
                            <Checkbox
                                status={selectedReceptients.map(sr => sr.adm_no).includes(r.adm_no) ? 'checked' : 'unchecked'}
                                onPress={() => selectedReceptients.map(sr => sr.adm_no).includes(r.adm_no)
                                    ? setSelectedReceptients(selectedReceptients)
                                    : setSelectedReceptients([...selectedReceptients, r])}
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
                </>
            )}
        </ScrollView>
    );


    // Submit handler
    const submitHandler = async () => {
        setStates({...states, loading:true});
        try {

            // Empty validations
            if((selectedReceptients.length === 0 && selectedClasses.length === 0) || !title || !message){
                setStates({...states, errors:{
                    receptient:(selectedReceptients.length === 0 && selectedClasses.length === 0) ? '*Please select at least one recipient' : '',
                    classes:(selectedReceptients.length === 0 && selectedClasses.length === 0) ? '*Please select at least one class' : '',
                    title:!title ? '*Please enter a title' : '',
                    message:!message ? '*Please enter a message' : '',
                }});
                return;
            };


            // Sending e-diary to classes
            if(selectedClasses.length > 0){
                selectedClasses?.map(async c => {
                    const params = {
                        title,
                        body:message,
                        topic:c.class_name,
                        type:'ediary',
                        created_by:user.adm_no.replace(/\//g, '_'),
                    };
                    const notificationLink = `${process.env.EXPO_PUBLIC_API_URL}/notifications/send-ediary`;
                    await axios.post(notificationLink, params);
                });
            };


            // Sending e-diary to students with filtering the selected classes students
            if(selectedReceptients.filter(s => !selectedClasses.map(c => c.class_name).includes(s.class_name)).length > 0){
                selectedReceptients.filter(s => !selectedClasses.map(c => c.class_name).includes(s.class_name)).map(async s => {
                    const params = {
                        title,
                        body:message,
                        topic:s.adm_no.replace(/\//g, '_'),
                        type:'ediary',
                        created_by:user.adm_no.replace(/\//g, '_'),
                    };
                    const notificationLink = `${process.env.EXPO_PUBLIC_API_URL}/notifications/send-ediary`;
                    await axios.post(notificationLink, params);
                });
            };


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

            // Classes response
            const classesLink = `${process.env.EXPO_PUBLIC_API_URL}/classes/names`;
            const classesRes = await axios.get(classesLink);
            setClasses(classesRes.data);

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
                <View style={{width:'100%', display:'flex', flexDirection:'column', paddingVertical:50, paddingHorizontal:30, justifyContent:'space-between'}}>


                    <View style={{gap:10}}>

                        {/* Classes */}
                        <View>
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


                        {/* Receptient */}
                        <View style={{gap:6, position:'relative'}}>
                            <Text>Recipient</Text>
                            <TouchableOpacity
                                onPress={() => {
                                    if(openedField === 'receptient'){
                                        setOpenedField('');
                                        (selectedReceptients.length > 0 || selectedClasses.length > 0) && setStates({...states, errors:{...states.errors, receptient:''}})
                                    }else{
                                        setOpenedField('receptient');
                                    }
                                }}
                                style={{display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'space-between', backgroundColor:'#F5F5F8', height:60, paddingHorizontal:10, borderTopLeftRadius:5, borderTopRightRadius:5, borderBottomWidth:1, borderBottomColor:openedField === 'receptients' ? '#0094DA' : 'gray'}}
                            >
                                <Text style={{marginLeft:10}}>{selectedReceptients.length == 0 ? 'Select Recipients' : selectedReceptients.length === 1 ? '1 Recipient Selected' : `${selectedReceptients.length} Recipient Selected`}</Text>
                                {openedField === 'receptient' ? (
                                    <Icon source='chevron-up' size={30} color='gray'/>
                                ) : (
                                    <Icon source='chevron-down' size={30} color='gray'/>
                                )}
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
                Message Sent Successfully!
            </Snackbar>

        </View>
    );
};
// Imports
import axios from 'axios';
import configs from '../../../../configs';
import {AuthContext} from '../../../../context/Auth';
import {useContext, useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import Checkbox from '@react-native-community/checkbox';
import {Image, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {TextInput as PaperTextInput, ActivityIndicator, Button} from 'react-native-paper';





// Main functions
export default function App({navigation}) {

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
    const [filteredRecipiens, setFilteredRecipiens] = useState([]);
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
                    value={classes.length === selectedClasses.length}
                    onValueChange={() => {
                        if(classes.length === selectedClasses.length){
                            setSelectedClasses([]);
                        }else{
                            setSelectedClasses(classes);
                        };
                    }}
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
                                value={selectedClasses.includes(c)}
                                onValueChange={() => {
                                    if(selectedClasses.includes(c)){
                                        setSelectedClasses(selectedClasses.filter(sc => sc.class_name !== c.class_name));
                                    }else{
                                        setSelectedClasses([...selectedClasses, c]);
                                    };
                                }}
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
        <ScrollView style={{position:'absolute', width:'100%', maxHeight:300, top:80, paddingVertical:6, zIndex:3, backgroundColor:'#fff', borderColor:'#ccc', borderWidth:1, borderBottomRightRadius:4, borderBottomLeftRadius:4}}>

            {/* Students */}
            {filteredRecipiens?.length == 0 ? (
                <Text style={{fontWeight:'600', paddingLeft:10}}>No Recipients</Text>
            ) : (
                <>
                    <View style={{display:'flex', flexDirection:'row', alignItems:'center', marginBottom:6, borderBottomWidth:1, borderBottomColor:'#ccc'}}>
                        <Checkbox
                            value={filteredRecipiens.length === selectedReceptients.length}
                            onValueChange={() => selectedReceptients.length === filteredRecipiens.length ? setSelectedReceptients([]) : setSelectedReceptients(filteredRecipiens)}
                        />
                        <Text style={{fontWeight:'600'}}>Select All</Text>
                    </View>
                    {filteredRecipiens?.map(r => (
                        <View style={{display:'flex', flexDirection:'row', alignItems:'center', gap:6, marginLeft:20, paddingVertical:4, borderLeftColor:'#0094DA', borderLeftWidth:1, borderBottomWidth:filteredRecipiens.indexOf(r) === filteredRecipiens.length - 1 ? 0 : 1, borderBottomColor:'#ccc'}}>
                            <Checkbox
                                value={selectedReceptients.map(sr => sr.adm_no).includes(r.adm_no)}
                                onValueChange={() => selectedReceptients.map(sr => sr.adm_no).includes(r.adm_no)
                                    ? setSelectedReceptients(selectedReceptients.filter(sr => sr.adm_no !== r.adm_no))
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


            // Random number for notice id
            const randomNumber = Math.floor(Math.random() * 1000000) + 1;


            // Sending e-diary to classes
            if(selectedClasses.length > 0){
                selectedClasses?.concat({class_name:user.adm_no.replace(/\//g, '_')})?.map(async c => {
                    const params = {
                        title,
                        body:message,
                        topic:c.class_name,
                        type:'ediary',
                        created_by:user.adm_no.replace(/\//g, '_'),
                        notice_id:randomNumber
                    };
                    const notificationLink = `${configs.EXPO_PUBLIC_API_URL}/notifications/send-ediary`;
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
                        notice_id:randomNumber
                    };
                    const notificationLink = `${configs.EXPO_PUBLIC_API_URL}/notifications/send-ediary`;
                    await axios.post(notificationLink, params);
                });
            };


            // Reseting
            setTitle('');
            setMessage('');
            setStates({...states, loading:false});
            navigation.navigate('teacher-ediaries', {isSubmitted:true});

        }catch(err){
            console.log(err);
        }
    };


    // Use effects
    useEffect(() => {
        setStates({...states, loadingData:true});
        const fetcher = async () => {

            // Classes response
            const classesLink = `${configs.EXPO_PUBLIC_API_URL}/classes/names`;
            const classesRes = await axios.get(classesLink);
            setClasses(classesRes.data);

            // Students response
            const studentsLink = `${configs.EXPO_PUBLIC_API_URL}/students/adm-nos`;
            const studentsRes = await axios.get(studentsLink);
            setReceptients(studentsRes.data);
            setFilteredRecipiens(studentsRes.data);


            setStates({...states, loadingData:false});

        };
        fetcher()
    }, []);
    useEffect(() => {
        if(selectedClasses.length > 0){
            setFilteredRecipiens(receptients.filter(r => !selectedClasses.map(c => c.class_name).includes(r.class_name)));
        }else{
            setFilteredRecipiens(receptients);
        };
    }, [selectedClasses]);

    return (
        <View style={{height:'100%', alignItems:'center'}}>
            <View style={{width:'100%', display:'flex', flexDirection:'row', alignItems:'flex-end', justifyContent:'space-between', paddingHorizontal:10, paddingVertical:30, backgroundColor:'#0094DA', borderBottomRightRadius:40, borderBottomLeftRadius:40}}>
                <View style={{display:'flex', flexDirection:'row', alignItems:'center', gap:20}}>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('teacher-ediaries')}
                    >
                        <Icon name='arrow-back-outline' size={35} color='#fff'/>
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
                                    <Icon name='chevron-up' size={25} color='gray'/>
                                ) : (
                                    <Icon name='chevron-down' size={25} color='gray'/>
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
                                    if(openedField === 'receptients'){
                                        setOpenedField('');
                                        (selectedReceptients.length > 0 || selectedClasses.length > 0) && setStates({...states, errors:{...states.errors, receptient:''}})
                                    }else{
                                        setOpenedField('receptients');
                                    }
                                }}
                                style={{display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'space-between', backgroundColor:'#F5F5F8', height:60, paddingHorizontal:10, borderTopLeftRadius:5, borderTopRightRadius:5, borderBottomWidth:1, borderBottomColor:openedField === 'receptients' ? '#0094DA' : 'gray'}}
                            >
                                <Text style={{marginLeft:10}}>{selectedReceptients.length == 0 ? 'Select Recipients' : selectedReceptients.length === 1 ? '1 Recipient Selected' : `${selectedReceptients.length} Recipient Selected`}</Text>
                                {openedField === 'receptients' ? (
                                    <Icon name='chevron-up' size={25} color='gray'/>
                                ) : (
                                    <Icon name='chevron-down' size={25} color='gray'/>
                                )}
                            </TouchableOpacity>
                            {openedField === 'receptients' && receptientsDropdown}
                            {states.errors.receptient !== '' && <Text style={{color:'red'}}>{states.errors.receptient}</Text>}
                        </View>


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
                            style={{marginTop:20, backgroundColor:'#0094DA', borderRadius:4}}
                        >
                            Submit
                        </Button>
                    )}

                </View>
            )}
        </View>
    );
};
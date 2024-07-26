// Imports
import axios from 'axios';
import configs from '../../../../configs';
import {AuthContext} from '../../../../context/Auth';
import {useContext, useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import {Dropdown} from 'react-native-element-dropdown';
import CheckBox from '@react-native-community/checkbox';
import {Image, ScrollView, Text, TouchableOpacity, View, Modal} from 'react-native';
import {TextInput as PaperTextInput, ActivityIndicator, Button} from 'react-native-paper';





// Main functions
export default function App({navigation}) {

    // Is receptiens opened
    const [isReceptiensOpened, setIsReceptiensOpened] = useState('');


    // User
    const {user} = useContext(AuthContext);


    // States
    const [states, setStates] = useState({
        errors:{
            receptients:'',
            title:'',
            message:''
        },
        loading:false,
        loadingData:false
    });


    // Opened field
    const [openedField, setOpenedField] = useState('');


    // Receptients
    const [receptients, setReceptients] = useState([]);
    const [selectedReceptients, setSelectedReceptients] = useState([]);


    // SMS templates
    const [smsTemplates, setSmsTemplates] = useState([]);
    const [selectedSmsTemplate, setSelectedSmsTemplate] = useState({label:'', value:''});


    // Message
    const [message, setMessage] = useState('');


    // Title
    const [title, setTitle] = useState('');


    // Receptients dropdown
    const receptientsDropdown = (
        <ScrollView style={{width:'100%', paddingVertical:6}}>
            <View style={{display:'flex', flexDirection:'row', alignItems:'center', marginBottom:6, borderBottomWidth:1, borderBottomColor:'#ccc'}}>
                <CheckBox
                    value={receptients.length === selectedReceptients.length}
                    onValueChange={() => selectedReceptients.length === receptients.length ? setSelectedReceptients([]) : setSelectedReceptients(receptients)}
                />
                <Text style={{fontWeight:'600'}}>Select All</Text>
            </View>


            {/* Students */}
            {receptients?.filter(r => r.role === 'Student').length > 0 && (
                <>
                    <View style={{display:'flex', flexDirection:'row', alignItems:'center', marginBottom:6, borderBottomWidth:1, borderBottomColor:'#ccc'}}>
                        <CheckBox
                            value={receptients?.filter(r => r.role === 'Student').length === selectedReceptients?.filter(r => r.role === 'Student').length}
                            onValueChange={() => receptients?.filter(r => r.role === 'Student').length === selectedReceptients?.filter(r => r.role === 'Student').length ? setSelectedReceptients(selectedReceptients.filter(r => r.role !== 'Student')) : setSelectedReceptients(receptients.filter(r => r.role === 'Student'))}
                        />
                        <Text style={{fontWeight:'600'}}>Students</Text>
                    </View>
                    {receptients?.filter(r => r.role === 'Student')?.map(r => (
                        <View
                            key={r.adm_no}
                            style={{display:'flex', flexDirection:'row', alignItems:'center', gap:6, marginLeft:20, paddingVertical:4, borderLeftColor:'#0094DA', borderLeftWidth:1, borderBottomWidth:receptients.indexOf(r) === receptients.length - 1 ? 0 : 1, borderBottomColor:'#ccc'}}
                        >
                            <CheckBox
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


            {/* Teachers */}
            {receptients?.filter(r => r.role === 'Teacher').length > 0 && (
                <>
                    <View style={{display:'flex', flexDirection:'row', alignItems:'center', marginBottom:6, borderBottomWidth:1, borderBottomColor:'#ccc'}}>
                        <CheckBox
                            value={receptients?.filter(r => r.role === 'Teacher').length === selectedReceptients?.filter(r => r.role === 'Teacher').length}
                            onValueChange={() => receptients?.filter(r => r.role === 'Teacher').length === selectedReceptients?.filter(r => r.role === 'Teacher').length ? setSelectedReceptients(selectedReceptients.filter(r => r.role !== 'Teacher')) : setSelectedReceptients(receptients.filter(r => r.role === 'Teacher'))}
                        />
                        <Text style={{fontWeight:'600'}}>Teachers</Text>
                    </View>
                    {receptients?.filter(r => r.role === 'Teacher')?.map(r => (
                        <View
                            key={r.adm_no}
                            style={{display:'flex', flexDirection:'row', alignItems:'center', gap:6, marginLeft:20, paddingVertical:4, borderLeftColor:'#0094DA', borderLeftWidth:1, borderBottomWidth:receptients.indexOf(r) === receptients.length - 1 ? 0 : 1, borderBottomColor:'#ccc'}}
                        >
                            <CheckBox
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
            if(selectedReceptients.length === 0 || !title || !message){
                setStates({...states, errors:{
                    receptients:selectedReceptients.length === 0 ? '*Please select at least one receptient' : '',
                    title:!title ? '*Please enter a title' : '',
                    message:!message ? '*Please enter a message' : '',
                }});
                return;
            };
            
            // Sending notification
            const randomNumber = Math.floor(Math.random() * 1000000) + 1;
            selectedReceptients.concat({adm_no:user.adm_no.replace(/\//g, '_')})?.map(async sr => {
                const params = {
                    title:title,
                    body:message,
                    topic:sr.adm_no.replace(/\//g, '_'),
                    type:'notice',
                    created_by:user.adm_no.replace(/\//g, '_'),
                    notice_id:randomNumber
                };
                const notificationLink = `${configs.EXPO_PUBLIC_API_URL}/notifications/send-notice`;
                await axios.post(notificationLink, params);
            });

            // Reseting
            setSelectedReceptients([]);
            setTitle('');
            setMessage('');
            setStates({...states, loading:false});
            navigation.navigate('teacher-notices', {isSubmitted:true});

        }catch(err){
            console.log(err);
        }
    };


    // Use effect
    useEffect(() => {
        setStates({...states, loadingData:true});
        const fetcher = async () => {

            // Students response
            const studentsLink = `${configs.EXPO_PUBLIC_API_URL}/students/adm-nos`;
            const studentsRes = await axios.get(studentsLink);

            // Teachers response
            const teachersLink = `${configs.EXPO_PUBLIC_API_URL}/teachers/adm-nos`;
            const teachersRes = await axios.get(teachersLink);
            setReceptients([...studentsRes.data, ...teachersRes.data.filter(t => t.adm_no !== user.adm_no)]);


            // Sms templates response
            const smsTemplatesLink = `${configs.EXPO_PUBLIC_API_URL}/sms-templates/types`;
            const smsTemplateRes = await axios.get(smsTemplatesLink);
            const smsTemplatesDropdownDate = smsTemplateRes.data.map(s => {
                return{
                    label:s.sms_type,
                    value:s.sms_type.toLowerCase()
                };
            });
            setSmsTemplates(smsTemplatesDropdownDate);


            // Setting is loading to false
            setStates({...states, loadingData:false});

        };
        fetcher()
    }, []);

    return (
        <View style={{height:'100%', alignItems:'center'}}>
            <View style={{width:'100%', display:'flex', flexDirection:'row', alignItems:'flex-end', justifyContent:'space-between', paddingHorizontal:10, paddingVertical:30, backgroundColor:'#0094DA', borderBottomRightRadius:40, borderBottomLeftRadius:40}}>
                <View style={{display:'flex', flexDirection:'row', alignItems:'center', gap:20}}>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('teacher-notices')}
                    >
                        <Icon name='arrow-back-outline' size={35} color='#fff'/>
                    </TouchableOpacity>
                    <Text style={{textAlign:'center', fontSize:18, color:'#fff', fontWeight:'900'}}>Compose Message</Text>
                    <TouchableOpacity
                        onPress={() => setIsReceptiensOpened(true)}
                    >
                        <Text style={{textAlign:'center', fontSize:14, color:'#fff'}}>Recipients +</Text>
                    </TouchableOpacity>
                </View>
            </View>


            {/* Receptiens modal */}
            <Modal visible={isReceptiensOpened}>
                <View style={{flex:1, display:'flex', flexDirection:'column', alignItems:'center', marginBottom:10}}>
                    {receptientsDropdown}
                    <View style={{width:'80%', display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'center', gap:20}}>
                        <Button
                            onPress={() => setIsReceptiensOpened(false)}
                            textColor='#fff'
                            style={{flex:1, backgroundColor:'#0094DA', borderRadius:4}}
                        >
                            Cancel
                        </Button>
                        <Button
                            onPress={() => setIsReceptiensOpened(false)}
                            textColor='#fff'
                            style={{flex:1, backgroundColor:'#0094DA', borderRadius:4}}
                        >
                            Ok
                        </Button>
                    </View>
                </View>
            </Modal>


            {/* Send notice */}
            {states.loadingData ? (
                <View style={{paddingTop:50}}>
                    <ActivityIndicator />
                </View>
            ) : (
                <View style={{width:'80%', flex:1, display:'flex', flexDirection:'column', justifyContent:'space-between', paddingVertical:50}}>


                    <View style={{gap:10}}>

                        {/* SMS Template */}
                        <View style={{gap:6}}>
                            <Text>SMS Template</Text>
                            <Dropdown
                                placeholderStyle={{color:'gray', paddingLeft:10}}
                                selectedTextStyle={{paddingLeft:10}}
                                data={smsTemplates}
                                search
                                activeColor='#ccc'
                                labelField='label'
                                valueField='value'
                                placeholder='Select Template'
                                searchPlaceholder='Search...'
                                value={selectedSmsTemplate}
                                onFocus={() => setOpenedField('sms-templates')}
                                onBlur={() => setOpenedField('')}
                                onChange={item => setSelectedSmsTemplate(item)}
                                style={{backgroundColor:'#F5F5F8', height:60, paddingHorizontal:20, borderTopLeftRadius:5, borderTopRightRadius:5, borderBottomWidth:openedField === 'sms-templates' ? 2 : 1, borderBottomColor:openedField === 'sms-templates' ? '#0094DA' : 'gray'}}
                                renderLeftIcon={() => (
                                    <Icon name='book' color='gray' size={25}/>
                                )}
                            />
                            {states.errors.class_name !== '' && <Text style={{color:'red', marginTop:-6}}>{states.errors.class_name}</Text>}
                        </View>


                        {/* Title */}
                        <View style={{gap:6}}>
                            <Text>Title</Text>
                            <View style={{width:'100%', position:'relative'}}>
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
                            <View style={{width:'100%', position:'relative'}}>
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
                            style={{backgroundColor:'#0094DA', borderRadius:4, marginTop:10}}
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
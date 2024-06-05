// Imports
import axios from 'axios';
import {router} from 'expo-router';
import {useEffect, useState} from 'react';
import {Dropdown} from 'react-native-element-dropdown';
import {Text, TouchableOpacity, View} from 'react-native';
import {TextInput as PaperTextInput, ActivityIndicator, Icon, Button, Snackbar} from 'react-native-paper';





// Main functions
export default function App() {

    // Snack bar actions
    const [visible, setVisible] = useState(false);
    const onDismissSnackBar = () => setVisible(false);


    // Opened dropdown
    const [openedField, setOpenedField] = useState('');


    // States
    const [states, setStates] = useState({
        errors:{
            class_name:'',
            message:''
        },
        loading:false,
        loadingData:false
    });


    // Classes
    const [classes, setClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState({label:'', value:''});


    // Message
    const [message, setMessage] = useState('');


    // Submit handler
    const submitHandler = async () => {
        setStates({...states, loading:true});
        try {

            // Empty validations
            if(!selectedClass || !message){
                setStates({...states, errors:{
                    class_name:!selectedClass ? '*Please select a class' : '',
                    message:!message ? '*Please enter a message' : '',
                }});
                return;
            };
            
            // Sending notification
            const params = {
                title:'Class Notice!',
                body:message,
                topic:`student.assignments.${selectedClass.label}`,
                type:'notice'
            };
            const notificationLink = `${process.env.EXPO_PUBLIC_API_URL}/notifications/send-notice`;
            await axios.post(notificationLink, params);

            // Reseting
            setVisible(true);
            setSelectedClass({label:'', value:''});
            setMessage('');
            setStates({...states, loading:false});
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
            const classesDropdownData = classesRes.data.map(s => {
                return{
                    label:s.class_name,
                    value:s.class_name.toLowerCase()
                };
            });
            setClasses(classesDropdownData);
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
                    <Text style={{textAlign:'center', fontSize:18, color:'#fff', fontWeight:'900'}}>Notice</Text>
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
                        {/* Class */}
                        <View style={{gap:6}}>
                            <Text>Class</Text>
                            <Dropdown
                                placeholderStyle={{color:'gray', paddingLeft:10}}
                                selectedTextStyle={{paddingLeft:10}}
                                data={classes}
                                search
                                activeColor='#ccc'
                                labelField='label'
                                valueField='value'
                                placeholder='Select Class'
                                searchPlaceholder='Search...'
                                value={selectedClass}
                                onFocus={() => setOpenedField('classes')}
                                onBlur={() => setOpenedField('')}
                                onChange={item => {setSelectedClass(item);setStates({states, errors:{...states.errors, class_name:!item.label  ? '*Please select a class' : ''}})}}
                                style={{backgroundColor:'#F5F5F8', height:60, paddingHorizontal:20, borderTopLeftRadius:5, borderTopRightRadius:5, borderBottomWidth:openedField === 'classes' ? 2 : 1, borderBottomColor:openedField === 'classes' ? '#0094DA' : 'gray'}}
                                renderLeftIcon={() => (
                                    <Icon source='book-edit' color='gray' size={25}/>
                                )}
                                name='class'
                            />
                            {states.errors.class_name !== '' && <Text style={{color:'red', marginTop:-6}}>{states.errors.class_name}</Text>}
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
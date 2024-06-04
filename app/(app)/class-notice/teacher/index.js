// Imports
import axios from 'axios';
import {useEffect, useState} from 'react';
import {Dropdown} from 'react-native-element-dropdown';
import {ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {TextInput as PaperTextInput, ActivityIndicator, Icon, Button, Snackbar} from 'react-native-paper';





// Main functions
export default function App() {

    // Selected tab
    const [selectedTab, setSelectedTab] = useState('class-notice');


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
            const notificationLink = `${process.env.EXPO_PUBLIC_API_URL}/notifications/send-class-notice`;
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
        <View style={{flex:1}}>
            <ScrollView style={{paddingTop:50}} contentContainerStyle={{alignItems:'center', gap:30, paddingBottom:50}}>

                {/* Tabs */}
                <View style={{width:'80%', display:'flex', flexDirection:'row', borderRadius:100, backgroundColor:'#F5F5F8'}}>
                    <TouchableOpacity
                        onPress={() => setSelectedTab('class-notice')}
                        style={{flex:1}}
                    >
                        <Text style={{paddingVertical:10, fontWeight:'800', textAlign:'center', borderRadius:100, color:selectedTab === 'class-notice' ? '#fff' : 'gray', backgroundColor:selectedTab === 'class-notice' ? '#3C5EAB' : '#F5F5F8'}}>Class Notice</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setSelectedTab('notice')}
                        style={{flex:1}}
                    >
                        <Text style={{paddingVertical:10, fontWeight:'800', textAlign:'center', borderRadius:100, color:selectedTab === 'notice' ? '#fff' : 'gray', backgroundColor:selectedTab === 'notice' ? '#3C5EAB' : '#F5F5F8'}}>Notice</Text>
                    </TouchableOpacity>
                </View>

                {/* Send class notice */}
                {states.loadingData ? (
                    <ActivityIndicator />
                ) : (
                    <View style={{width:'80%', display:'flex', flexDirection:'column', gap:10}}>

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
                                    onChangeText={v => setMessage(v)}
                                />
                            {states.errors.message !== '' && <Text style={{color:'red', marginTop:-6}}>{states.errors.message}</Text>}
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


            </ScrollView>

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
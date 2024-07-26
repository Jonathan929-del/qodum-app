// Imports
import axios from 'axios';
import {useState} from 'react';
import configs from '../../../../configs';
import {useForm, Controller} from 'react-hook-form';
import Icon from 'react-native-vector-icons/Ionicons';
import {Text, TouchableOpacity, View, ScrollView, Button} from 'react-native';
import {TextInput as PaperTextInput, ActivityIndicator, Snackbar} from 'react-native-paper';





// Main function
const App = ({navigation, route}) => {

    // Snack bar actions
    const [visible, setVisible] = useState(false);
    const [message, setMessage] = useState('');
    const onDismissSnackBar = () => setVisible(false);


    // Link params
    const {assignment, answer} = route.params;


    // Opened dropdown
    const [openedField, setOpenedField] = useState('');


    // Grades
    const grades = [
        {
            grade:'A+',
            label:'90% - 100%'
        },
        {
            grade:'A',
            label:'80% - 90%'
        },
        {
            grade:'B+',
            label:'70% - 80%'
        },
        {
            grade:'B',
            label:'60% - 70%'
        },
        {
            grade:'C+',
            label:'50% - 60%'
        },
        {
            grade:'C',
            label:'0% - 50%'
        },
    ];


    // Selected grade
    const [selectedGrade, setSelectedGrade] = useState({grade:'', label:''});


    // States
    const [states, setStates] = useState({
        errors:{
            feedback:'',
            grade:''
        },
        loading:false,
        loadingData:false
    });


    // Controller
    const {control, handleSubmit, reset} = useForm();


    // Grades dropdown
    const gradesDropdown = (
        <ScrollView style={{width:'100%', maxHeight:300, paddingVertical:6, borderWidth:1, borderColor:'#ccc', borderBottomLeftRadius:4, borderBottomRightRadius:4}}>
            {grades?.map(g => (
                <TouchableOpacity
                    onPress={() => {setSelectedGrade(g);setOpenedField('')}}
                    style={{position:'relative', display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'space-between', paddingVertical:4,  marginHorizontal:20, borderBottomWidth:grades.indexOf(g) === grades.length - 1 ? 0 : 1, borderBottomColor:'#ccc'}}
                >
                    <View style={{position:'absolute', height:'150%', left:-10, backgroundColor:selectedGrade.grade === g.grade ? '#3C5EAB' : '#ccc', borderRadius:4}}>
                        <Text style={{color:selectedGrade.grade === g.grade ? '#3C5EAB' : '#ccc'}}>-</Text>
                    </View>
                    <Text style={{color:'#3C5EAB', fontWeight:'600'}}>{g.grade}</Text>
                    <Text style={{color:'gray', fontSize:12}}>{g.label}</Text>
                </TouchableOpacity>
            ))}


        </ScrollView>
    );


    // On submit
    const onSubmit = async data => {
        setStates({...states, loading:true});
        try {

            // Empty validations
            if(!data.feedback || selectedGrade.grade === ''){
                setStates({...states, errors:{
                    feedback:!data.feedback ? '*Please enter feedback' : '',
                    grade:!selectedGrade.grade ? '*Please select a grade' : '',
                }});
                return;
            };


            // Api call
            const link = `${configs.EXPO_PUBLIC_API_URL}/assignments/assignment/feedback`;
            const params = {
                assignment_id:assignment._id,
                submitted_report_id:answer._id,
                feedback:data.feedback,
                grade:selectedGrade.grade
            };
            const res = await axios.put(link, params);


            // Sending notification
            const notificationLink = `${configs.EXPO_PUBLIC_API_URL}/notifications/send-notification`;
            const notificationsParams = {
                title:'Feedback Added!',
                body:'Your teacher added a feedback to your answer!',
                topic:answer.student.adm_no.replace(/\//g, '_'),
                type:'feedback',
                assignment_id:assignment._id,
                answer_id:answer._id
            };
            await axios.post(notificationLink, notificationsParams);


            // Reseting
            if(res.data === 'Feedback sent'){
                reset({
                    feedback:''
                });
                setStates({...states, loading:false});
                navigation.navigate('teacher-assignment-view', {assignment, is_feedback_sent:true});

            }else{
                setMessage('Error sending feedback');
                setVisible(true);
            };

        }catch(err){
            console.log(err);
        }
    };

    return (
        <View style={{height:'100%', alignItems:'center'}}>
            <View style={{width:'100%', display:'flex', flexDirection:'row', alignItems:'flex-end', justifyContent:'space-between', paddingHorizontal:10, paddingVertical:30, backgroundColor:'#0094DA', borderBottomRightRadius:40, borderBottomLeftRadius:40}}>
                <View style={{display:'flex', flexDirection:'row', alignItems:'center', gap:20}}>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('teacher-assignment-answer-view', {assignment, answer})}
                    >
                        <Icon name='arrow-back-outline' size={35} color='#fff'/>
                    </TouchableOpacity>
                    <Text style={{textAlign:'center', fontSize:18, color:'#fff', fontWeight:'900'}}>Add Feedback</Text>
                </View>
            </View>


            {/* Form */}
            <ScrollView style={{width:'100%'}} contentContainerStyle={{alignItems:'center'}}>
                <View style={{width:'80%', gap:20, paddingVertical:50}}>
                    {states.loadingData ? (
                        <ActivityIndicator />
                    ) : (
                        <>


                            {/* Feedback */}
                            <View style={{gap:6}}>
                                <Text>Feedback</Text>
                                <Controller
                                    control={control}
                                    render={({field:{onChange, onBlur, value}}) => (
                                        <View style={{position:'relative'}}>
                                            <Icon name='pencil' size={30} color='gray' style={{position:'absolute', top:10, left:10, zIndex:2}}/>
                                            <PaperTextInput
                                                style={{paddingLeft:35, backgroundColor:'#F5F5F8'}}
                                                placeholder='Enter Feedback'
                                                onBlur={() =>setStates({...states, errors:{...states.errors, feedback:value === '' ? '*Please enter feedback' : ''}})}
                                                placeholderTextColor='gray'
                                                value={value}
                                                onChangeText={onChange}
                                                multiline
                                                numberOfLines={4}
                                            />
                                        </View>
                                    )}
                                    name='feedback'
                                />
                                {states.errors.feedback !== '' && <Text style={{color:'red', marginTop:-6}}>{states.errors.feedback}</Text>}
                            </View>


                            {/* Grade */}
                            <View style={{gap:0}}>
                                <Text>Grade</Text>
                                <TouchableOpacity
                                    onPress={() => openedField === 'grade' ? setOpenedField('') : setOpenedField('grade')}
                                    style={{display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'space-between', marginTop:6, backgroundColor:'#F5F5F8', height:60, paddingHorizontal:10, borderTopLeftRadius:5, borderTopRightRadius:5, borderBottomWidth:1, borderBottomColor:openedField === 'grade' ? '#0094DA' : 'gray'}}
                                >
                                    <Text style={{marginLeft:10}}>{selectedGrade.grade === '' ? 'Select Grade' : selectedGrade.grade}</Text>
                                    {openedField === 'grade' ? (
                                        <Icon name='chevron-up' size={25} color='gray'/>
                                    ) : (
                                        <Icon name='chevron-down' size={25} color='gray'/>
                                    )}
                                </TouchableOpacity>
                                {openedField === 'grade' && gradesDropdown}
                                {states.errors.grade !== '' && <Text style={{color:'red'}}>{states.errors.grade}</Text>}
                            </View>
            
            
                            {/* Button */}
                            {states.loading ? (
                                <ActivityIndicator />
                            ) : (
                                <Button
                                    onPress={handleSubmit(onSubmit)}
                                    title='Submit'
                                />
                            )}

                        </>
                    )}
                </View>
            </ScrollView>


            {/* Snackbar */}
            <Snackbar
                style={{backgroundColor:'red'}}
                visible={visible}
                onDismiss={onDismissSnackBar}
                action={{
                    label: <Icon source='close' color='#fff' size={20}/>,
                    onPress:() => setVisible(false)
                }}
            >
                {message}
            </Snackbar>

        </View>
    );
};





// Export
export default App;
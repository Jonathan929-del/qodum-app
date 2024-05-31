// Imports
import axios from 'axios';
import 'react-native-get-random-values';
import {useState, useContext} from 'react';
import {useForm, Controller} from 'react-hook-form';
import {AuthContext} from '../../../../context/Auth';
import {Dropdown} from 'react-native-element-dropdown';
import {router, useLocalSearchParams} from 'expo-router';
import {Text, TouchableOpacity, View, ScrollView, Button} from 'react-native';
import {TextInput as PaperTextInput, ActivityIndicator, Snackbar, Icon} from 'react-native-paper';





// Main function
const App = () => {

    // Snack bar actions
    const [visible, setVisible] = useState(false);
    const [message, setMessage] = useState('');
    const onDismissSnackBar = () => setVisible(false);


    // User
    const {user} = useContext(AuthContext);


    // Link params
    const {assignment, answer} = useLocalSearchParams();


    // Opened dropdown
    const [openedField, setOpenedField] = useState('');


    // Grades
    const grades = [
        {
            label:'A+',
            value:'A+'
        },
        {
            label:'A',
            value:'A'
        },
        {
            label:'B+',
            value:'B+'
        },
        {
            label:'B',
            value:'B'
        },
        {
            label:'C',
            value:'C'
        },
        {
            label:'D',
            value:'D'
        },
    ];


    // Selected grade
    const [selectedGrade, setSelectedGrade] = useState('');


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


    // On submit
    const onSubmit = async data => {
        setStates({...states, loading:true});
        try {

            // Empty validations
            if(!data.feedback || selectedGrade === ''){
                setStates({...states, errors:{
                    feedback:!data.feedback ? '*Please enter feedback' : '',
                    grade:!selectedGrade ? '*Please select a grade' : '',
                }});
                return;
            };


            // Api call
            const link = `${process.env.EXPO_PUBLIC_API_URL}/assignments/assignment/feedback`;
            const params = {
                assignment_id:JSON.parse(assignment)._id,
                submitted_report_id:JSON.parse(answer)._id,
                feedback:data.feedback,
                grade:selectedGrade.label
            };
            const res = await axios.put(link, params);


            // Sending notification
            const notificationLink = `${process.env.EXPO_PUBLIC_API_URL}/notifications/send-notification`;
            await axios.post(notificationLink, {title:'Feedback Added!', body:'Your teacher added a feedback to your answer', topic:`student_${JSON.parse(answer).student.adm_no.replace(/\//g, '_')}`});


            // Reseting
            if(res.data === 'Feedback sent'){
                reset({
                    feedback:''
                });
                setStates({...states, loading:false});
                router.push({pathname:'/assignments/teacher/view', params:{a:assignment, is_feedback_sent:true}});
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
            <View style={{width:'100%', height:120, display:'flex', flexDirection:'row', alignItems:'flex-end', justifyContent:'space-between', paddingHorizontal:10, paddingBottom:30, backgroundColor:'#0094DA', borderBottomRightRadius:40, borderBottomLeftRadius:40}}>
                <View style={{display:'flex', flexDirection:'row', alignItems:'center', gap:20}}>
                    <TouchableOpacity
                        onPress={() => router.push({pathname:'/assignments/teacher/view-answer', params:{a:assignment, answer:answer}})}
                    >
                        <Icon source='chevron-left' size={40} color='#fff'/>
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
                                        <PaperTextInput
                                            style={{backgroundColor:'#F5F5F8'}}
                                            placeholder='Enter Feedback'
                                            onBlur={() =>setStates({...states, errors:{...states.errors, feedback:value === '' ? '*Please enter feedback' : ''}})}
                                            placeholderTextColor='gray'
                                            left={<PaperTextInput.Icon icon='pencil' size={30} color='gray' />}
                                            value={value}
                                            onChangeText={onChange}
                                            multiline
                                            numberOfLines={4}
                                        />
                                    )}
                                    name='feedback'
                                />
                                {states.errors.feedback !== '' && <Text style={{color:'red', marginTop:-6}}>{states.errors.feedback}</Text>}
                            </View>


                            {/* Grade */}
                            <View style={{gap:6}}>
                                <Text>Grade</Text>
                                <Controller
                                    control={control}
                                    render={({field:{onChange, onBlur, value}}) => (
                                        <Dropdown
                                            placeholderStyle={{color:'gray', paddingLeft:10}}
                                            selectedTextStyle={{paddingLeft:10}}
                                            data={grades}
                                            search
                                            activeColor='#ccc'
                                            itemContainerStyle={{}}
                                            labelField='label'
                                            valueField='value'
                                            placeholder='Select Grade'
                                            searchPlaceholder='Search...'
                                            value={selectedGrade}
                                            onFocus={() => setOpenedField('grades')}
                                            onBlur={() => setOpenedField('')}
                                            onChange={item => {setSelectedGrade(item);setStates({states, errors:{...states.errors, grade:!item.label  ? '*Please select a grade' : ''}})}}
                                            style={{backgroundColor:'#F5F5F8', height:60, paddingHorizontal:20, borderTopLeftRadius:5, borderTopRightRadius:5, borderBottomWidth:openedField === 'grades' ? 2 : 1, borderBottomColor:openedField === 'grades' ? '#0094DA' : 'gray'}}
                                            renderLeftIcon={() => (
                                                <Icon source='book-edit' color='gray' size={25}/>
                                            )}
                                        />
                                    )}
                                    name='grade'
                                />
                                {states.errors.grade !== '' && <Text style={{color:'red', marginTop:-6}}>{states.errors.grade}</Text>}
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
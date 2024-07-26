// Imports
import axios from 'axios';
import moment from 'moment';
import configs from '../../../../configs';
import {AuthContext} from '../../../../context/Auth';
import {useState, useEffect, useContext} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';
import {ActivityIndicator, Card, Snackbar} from 'react-native-paper';
import {Text, TouchableOpacity, View, ScrollView, Image, Alert} from 'react-native';





// Main functions
const App = ({navigation, route}) => {

    // Snack bar actions
    const [visible, setVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const onDismissSnackBar = () => setVisible(false);


    // User
    const {user} = useContext(AuthContext);


    // Is loading
    const [isLoading, setIsLoading] = useState(false);


    // Loading delete
    const [loadingDelete, setLoadingDelete] = useState();


    // Classes
    const [classes, setClasses] = useState([]);


    // All assignments
    const [allAssignments, setAllAssignments] = useState([]);


    // Filtered assignments
    const [filteredAssignments, setFilteredAssignments] = useState([]);


    // Selected class
    const [selectedClass, setSelectedClass] = useState('');


    // Class students count
    const [classStudentsCount, setClassStudentsCount] = useState();


    // Selected date
    const [selectedDate, setSelectedDate] = useState(new Date());


    // Opened field
    const [openedField, setOpenedField] = useState('');


    // Show delete alert
    const showDeleteAlert = id =>
        Alert.alert(
            'Are you sure?',
            'Are you sure you want to delete this record?',
            [
                {
                    text: 'No',
                    style:'destructive',
                },
                {
                    text: 'Yes',
                    onPress: () => deleteAssignment(id),
                    style:'default',
                },
            ]
    );


    // Delete assignment
    const deleteAssignment = async id => {
        try {
            setLoadingDelete(id);
            const link = `${configs.EXPO_PUBLIC_API_URL}/assignments/delete/${id}`;
            await axios.delete(link);
            setSnackbarMessage('Assignment Deleted Successfully!');
            setVisible(true);
            fetchData();
        }catch(err){
            console.log(err);
        }
    };



    // Fetch data
    const fetchData = async () => {
        try {

            // Setting is loading to true
            setIsLoading(true);


            // Fetching classes
            const classesLink = `${configs.EXPO_PUBLIC_API_URL}/classes/names`;
            const classesRes = await axios.get(classesLink);
            setClasses(classesRes?.data);
            setSelectedClass(classesRes?.data[0]?.class_name);


            // Fetching class student count
            const classesStudentCountLink = `${configs.EXPO_PUBLIC_API_URL}/classes/class/student-count`;
            const classesStudentCountRes = await axios.post(classesStudentCountLink, {class_name:classesRes?.data[0]?.class_name});
            setClassStudentsCount(classesStudentCountRes.data);


            // Fetching assignments
            const assignmentsLink = `${configs.EXPO_PUBLIC_API_URL}/assignments/teacher`;
            const assignmentsRes = await axios.post(assignmentsLink, {teacher:user.name});
            setAllAssignments(assignmentsRes.data);
            setFilteredAssignments(assignmentsRes.data.filter(a => a.class_name === classesRes?.data[0]?.class_name));


            setIsLoading(false);
        }catch(err){
            console.log('Error fetching data: ', err);   
        }
    };


    // Use effects
    useEffect(() => {
        if(route?.params?.edited) {
            setSnackbarMessage('Assignment Edited Successfully!');
            setVisible(true);
        };
        fetchData();
    }, []);
    useEffect(() => {
        setFilteredAssignments(allAssignments.filter(a => moment(a.assignment_date).format('D-M-YYYY') === moment(selectedDate).format('D-M-YYYY')));
    }, [selectedDate]);
    useEffect(() => {
        if(route?.params?.edited) {
            setSnackbarMessage('Assignment Edited Successfully!');
            setVisible(true);
        };
    }, [route.params]);


  return (
      <View style={{height:'100%'}}>
        <View style={{width:'100%', display:'flex', flexDirection:'row', alignItems:'flex-end', justifyContent:'space-between', paddingHorizontal:10, paddingVertical:30, backgroundColor:'#0094DA', borderBottomRightRadius:40, borderBottomLeftRadius:40}}>
            <View style={{display:'flex', flexDirection:'row', alignItems:'center', gap:20}}>
                <TouchableOpacity
                    onPress={() => navigation.navigate('teacher-tabs', {screen:'Home'})}
                >
                    <Icon name='arrow-back-outline' size={35} color='#fff'/>
                </TouchableOpacity>
                <Text style={{textAlign:'center', fontSize:18, color:'#fff', fontWeight:'900'}}>Assignments</Text>
            </View>


            <TouchableOpacity
                onPress={() => navigation.navigate('teacher-assignment-create')}
                style={{paddingRight:10}}
            >
                <Icon name='add-circle' size={40} color='#fff'/>
            </TouchableOpacity>
        </View>

        {/* View assignments */}
        <View style={{flex:1, display:'flex', flexDirection:'column'}}>
            {isLoading ? (
                <View style={{height:'100%', width:'100%', alignItems:'center', justifyContent:'center'}}>
                    <ActivityIndicator size={30} color='#0094DA'/>
                </View>
            ) : (
                <>


                    {/* Classes */}
                    <View style={{height:50}}>
                        <ScrollView horizontal={true} style={{width:'100%', backgroundColor:'#F8F8F8'}}>
                            {classes?.map(c => (
                                <TouchableOpacity
                                    onPress={async () => {
                                        setSelectedClass(c?.class_name);
                                        setFilteredAssignments(allAssignments.filter(a => a.class_name === c.class_name));

                                        // Fetching class student count
                                        const classesStudentCountLink = `${configs.EXPO_PUBLIC_API_URL}/classes/class/student-count`;
                                        const classesStudentCountRes = await axios.post(classesStudentCountLink, {class_name:c.class_name});
                                        setClassStudentsCount(classesStudentCountRes.data);
                                    }}
                                    key={c?._id}
                                    style={{height:'100%',  width:70, display:'flex', alignItems:'center', justifyContent:'center', borderBottomColor:selectedClass === c?.class_name ? '#0094DA' : '#f8F8F8', borderBottomWidth:2}}
                                >
                                    <Text style={{fontSize:14, fontWeight:'500'}}>
                                        {c?.class_name}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>


                    {/* Assignments */}
                    <ScrollView contentContainerStyle={{display:'flex', flexDirection:'column', alignItems:'center', gap:20, paddingVertical:20, paddingTop:50}} style={{width:'100%'}}>
                        <View style={{width:'80%', gap:6}}>
                            <Text>Assignment Date</Text>
                            <TouchableOpacity
                                onPress={() => setOpenedField('selected_date')}
                                style={{display:'flex', flexDirection:'row', alignItems:'center', backgroundColor:'#F5F5F8', height:60, paddingHorizontal:20, borderTopLeftRadius:5, borderTopRightRadius:5, borderBottomWidth:openedField === 'selected_date' ? 2 : 1, borderBottomColor:openedField === 'selected_date' ? '#0094DA' : 'gray'}}
                            >
                                <Icon name='calendar' size={30} color='gray'/>
                                <Text style={{marginLeft:10}}>{moment(selectedDate).format('D-M-YYYY')}</Text>
                            </TouchableOpacity>
                            {openedField === 'selected_date' && (
                                <DateTimePicker
                                    mode='date'
                                    display='spinner'
                                    value={selectedDate}
                                    onChange={(v, date) => {
                                        setOpenedField('');
                                        setSelectedDate(date);
                                    }}
                                />
                            )}
                        </View>
                        {filteredAssignments.length > 0 ? filteredAssignments?.map(a => (
                            <Card style={{width:'80%', height:250, borderRadius:10, backgroundColor:'#fff'}} key={a._id}>
                                <View style={{height:'100%', display:'flex', flexDirection:'column', justifyContent:'space-between'}}>

                                    {/* Top */}
                                    <View style={{height:'30%', display:'flex', flexDirection:'row', justifyContent:'space-between', padding:10}}>
                                        <View style={{display:'flex', flexDirection:'row', gap:10}}>
                                            <Image
                                                source={{uri:a.creator_image}}
                                                style={{height:60, width:60, borderWidth:2, borderColor:'#3C5EAB', borderRadius:10}}
                                            />
                                            <View style={{display:'flex', flexDirection:'column', justifyContent:'space-between'}}>
                                                <Text style={{fontWeight:'900', fontSize:16}}>{a.title}</Text>
                                                <Text style={{color:'gray', fontSize:12}}>Updated on {moment(a.updatedAt).format('D-M-YYYY')}</Text>
                                                <Text style={{color:'#3C5EAB', fontSize:14}}>{a.subject}</Text>
                                            </View>
                                        </View>
                                        <View style={{display:'flex', flexDirection:'column', gap:8, alignItems:'flex-end'}}>
                                            <View style={{height:30, width:70, display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'center', gap:4, paddingHorizontal:5, backgroundColor:'#F5F5F5', borderRadius:50}}>
                                                <View style={{width:8, height:8, borderRadius:10, backgroundColor:a.is_active ? '#93C314' : 'red'}}/>
                                                <Text style={{fontSize:12, color:'gray'}}>{a.is_active ? 'Active' : 'Inactive'}</Text>
                                            </View>
                                            <View style={{display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center'}}>
                                                <Text style={{fontSize:11, color:'gray'}}>{`${a.submitted_assignments.filter((s => n => !s.has(n.student.name.toLowerCase()) && s.add(n.student.name.toLowerCase()))(new Set())).length} / ${classStudentsCount}`}</Text>
                                                <Text style={{fontSize:11, color:'gray'}}>Submitted</Text>
                                            </View>
                                        </View>
                                    </View>


                                    {/* Middle */}
                                    <View style={{height:'50%', display:'flex', flexDirection:'column', justifyContent:'center', gap:4, padding:10}}>
                                        <View style={{display:'flex', flexDirection:'row', alignItems:'center', gap:2}}>
                                            <Text style={{fontSize:13}}>ASSIGNED ON: </Text>
                                            <Text style={{fontSize:13, color:'gray'}}>{moment(a.assignment_date).format('D-M-YYYY')}</Text>
                                        </View>
                                        <View style={{display:'flex', flexDirection:'row', alignItems:'center', gap:2}}>
                                            <Text style={{fontSize:13}}>LAST DATE OF SUBMISSION: </Text>
                                            <Text style={{fontSize:13, color:'gray'}}>{moment(a.last_date_of_submission).format('D-M-YYYY')}</Text>
                                        </View>
                                        <View style={{display:'flex', flexDirection:'row', alignItems:'center', gap:2}}>
                                            <Text style={{fontSize:13}}>CREATOR: </Text>
                                            <Text style={{fontSize:13, color:'gray'}}>{a.creator}</Text>
                                        </View>
                                    </View>


                                    {/* Bottom */}
                                    <View style={{height:'17.5%', width:'100%', display:'flex', flexDirection:'row', backgroundColor:'#DAE0EF', borderBottomLeftRadius:10, borderBottomRightRadius:10}}>
                                        <TouchableOpacity
                                            onPress={() => navigation.navigate('teacher-assignment-view', {assignment:a, is_feedback_sent:false})}
                                            style={{flex:1, height:'100%', display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'center', gap:6, borderBottomLeftRadius:10, borderRightColor:'#fff', borderRightWidth:1.5}}
                                        >
                                            <Icon name='eye' color='#3C5EAB' size={20}/>
                                            <Text style={{color:'#3C5EAB'}}>View</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={() => navigation.navigate('teacher-assignment-edit', {assignment:a})}
                                            style={{flex:1, height:'100%', display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'center', gap:6, borderRightColor:'#fff', borderRightWidth:1.5}}
                                        >
                                            <Icon name='create' color='#3C5EAB' size={20}/>
                                            <Text style={{color:'#3C5EAB'}}>Edit</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={() => showDeleteAlert(a._id)}
                                            style={{flex:1, height:'100%', display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'center', gap:6, borderBottomRightRadius:10}}
                                        >
                                            {loadingDelete === a._id ? (
                                                <ActivityIndicator size={20}/>
                                            ) : (
                                                <>
                                                    <Icon name='trash' color='#3C5EAB' size={20}/>
                                                    <Text style={{color:'#3C5EAB'}}>Delete</Text>
                                                </>
                                            )}
                                        </TouchableOpacity>
                                    </View>

                                </View>
                            </Card>
                        )) : <Text style={{fontSize:16}}>No assignments</Text>}
                    </ScrollView>
                </>
            )}
        </View>


        {/* Snackbar */}
        <Snackbar
            style={{backgroundColor:'green'}}
            visible={visible}
            onDismiss={onDismissSnackBar}
            action={{
                label: <Icon name='close' color='#fff' size={20}/>,
                onPress:() => setVisible(false)
            }}
        >
            {snackbarMessage}
        </Snackbar>
        
    </View>
  );
};





// Export
export default App;
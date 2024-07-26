// Imports
import axios from 'axios';
import moment from 'moment';
import configs from '../../../../configs';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import {AuthContext} from '../../../../context/Auth';
import Icon from 'react-native-vector-icons/Ionicons';
import {useState, useEffect, useContext} from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import {ActivityIndicator, Card, Snackbar} from 'react-native-paper';
import {Text, TouchableOpacity, View, ScrollView, Image} from 'react-native';
import SubmissionConfirmed from '../../../../utils/student/SubmissionConfirmed';
import PassedAssignmentDate from '../../../../utils/student/PassedAssignmentDate';





// Main functions
const App = ({route, navigation}) => {

    // Snack bar actions
    const [visible, setVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const onDismissSnackBar = () => setVisible(false);


    // User
    const {user} = useContext(AuthContext);


    // Opened dropdown
    const [openedField, setOpenedField] = useState('');


    // Selected date
    const [selectedDate, setSelectedDate] = useState(new Date());


    // Media library permissions
    const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();


    // Is submission confirmed
    const [isSubmissionConfirmed, setIsSubmissionConfirmed] = useState(false);


    // Selected tab
    const [selectedTab, setSelectedTab] = useState('all');


    // Is loading
    const [isLoading, setIsLoading] = useState(false);


    // Is submit date passed
    const [isSubmitDatePassed, setIsSubmitDatePassed] = useState('');


    // Subjects
    const [subjects, setSubjects] = useState([]);


    // Selected subject
    const [selectedSubject, setSelectedSubject] = useState('');


    // Is download loading
    const [isDownloadLoading, setIsDownloadLoading] = useState('');


    // ALl assignments
    const [allAssignments, setAllAssignments] = useState([]);


    // Filtered assignments
    const [filteredAssignments, setFilteredAssignments] = useState([]);


    // Download handler
    const downloadHandler = async a => {
        if(permissionResponse.status !== 'granted'){
            await requestPermission();
        }
        setIsDownloadLoading(a.title);
        try {

            const fileUri = FileSystem.documentDirectory + a.attachment.split('/')[4];
            const fileInfo = await FileSystem.downloadAsync(a.attachment, fileUri);
            if(fileInfo.status === 200){
                await MediaLibrary.saveToLibraryAsync(fileInfo.uri);
                setVisible(true);
                setSnackbarMessage('Document Downloaded!');
                setIsDownloadLoading('');
            }else{
                setVisible(true);
                setSnackbarMessage('Error Downloading The Document');
                setIsDownloadLoading('');
            }

        } catch (error) {
            setVisible(true);
            setSnackbarMessage('Error Downloading Document');
            setIsDownloadLoading('');
        }
    };


    // Use effects
    useEffect(() => {
        setIsLoading(true);
        const fetcher = async () => {
            try {

                // Fetching subjects
                const subjectsLink = `${configs.EXPO_PUBLIC_API_URL}/subjects/names`;
                const subjectsRes = await axios.get(subjectsLink);
                setSubjects(subjectsRes.data);
                setSelectedSubject(subjectsRes.data[0].subject_name)

                // Fetching assignments
                const assignmentsLink = `${configs.EXPO_PUBLIC_API_URL}/assignments/class`;
                const assignmentsRes = await axios.post(assignmentsLink, {class_name:user.student.class_name});
                setAllAssignments(assignmentsRes.data);
                setFilteredAssignments(assignmentsRes.data);

                setIsLoading(false);
            }catch(err){
                console.log('Error fetching data: ', err);   
            }
        };
        fetcher();
    }, []);
    useEffect(() => {
        setIsLoading(true);
        setFilteredAssignments(allAssignments.filter(a => moment(a.assignment_date).format('D-M-YYYY') === moment(selectedDate).format('D-M-YYYY')));
        setIsLoading(false);
    }, [selectedDate]);
    useEffect(() => {
        if(route?.params?.submitted === true){
            setIsSubmissionConfirmed(true);
        };
    }, [route.params]);


  return (
      <View style={{height:'100%'}}>
        <View style={{width:'100%', display:'flex', flexDirection:'row', alignItems:'flex-end', justifyContent:'space-between', paddingHorizontal:10, paddingVertical:30, backgroundColor:'#0094DA', borderBottomRightRadius:40, borderBottomLeftRadius:40}}>
            <View style={{display:'flex', flexDirection:'row', alignItems:'center', gap:20}}>
                <TouchableOpacity
                    onPress={() => navigation.navigate('student-tabs', {screen:'Home'})}
                >
                    <Icon name='arrow-back-outline' size={35} color='#fff'/>
                </TouchableOpacity>
                <Text style={{textAlign:'center', fontSize:18, color:'#fff', fontWeight:'900'}}>Assignments</Text>
            </View>
        </View>

        {/* View assignments */}
        <View style={{flex:1, display:'flex', flexDirection:'column', alignItems:'center', paddingTop:30}}>
    
            {/* Tabs */}
            <View style={{width:'80%', display:'flex', flexDirection:'row', borderRadius:100, backgroundColor:'#F5F5F8'}}>
                <TouchableOpacity
                    onPress={() => {
                        setSelectedTab('all');
                        setFilteredAssignments(allAssignments);
                    }}
                    style={{flex:1}}
                >
                    <Text style={{paddingVertical:10, fontWeight:'800', textAlign:'center', borderRadius:100, color:selectedTab === 'all' ? '#fff' : 'gray', backgroundColor:selectedTab === 'all' ? '#3C5EAB' : '#F5F5F8'}}>All</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        setSelectedTab('subjects');
                        setFilteredAssignments(allAssignments.filter(a => a.subject === selectedSubject));
                    }}
                    style={{flex:1}}
                >
                    <Text style={{paddingVertical:10, fontWeight:'800', textAlign:'center', borderRadius:100, color:selectedTab === 'subjects' ? '#fff' : 'gray', backgroundColor:selectedTab === 'subjects' ? '#3C5EAB' : '#F5F5F8'}}>Subjects</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => setSelectedTab('date')}
                    style={{flex:1}}
                >
                    <Text style={{paddingVertical:10, fontWeight:'800', textAlign:'center', borderRadius:100, color:selectedTab === 'date' ? '#fff' : 'gray', backgroundColor:selectedTab === 'date' ? '#3C5EAB' : '#F5F5F8'}}>Date</Text>
                </TouchableOpacity>
            </View>


            {/* Subjects */}
            {selectedTab === 'subjects' && (
                <View style={{width:'100%', height:50, marginTop:20}}>
                    <ScrollView horizontal={true} style={{width:'100%', backgroundColor:'#F8F8F8'}}>
                        {subjects?.map(c => (
                            <TouchableOpacity
                                onPress={() => {
                                    setSelectedSubject(c?.subject_name);
                                    setFilteredAssignments(allAssignments.filter(a => a.subject === c?.subject_name));
                                }}
                                key={c?._id}
                                style={{height:'100%',  width:100, display:'flex', alignItems:'center', justifyContent:'center', borderBottomColor:selectedSubject === c?.subject_name ? '#0094DA' : '#f8F8F8', borderBottomWidth:2}}
                            >
                                <Text style={{fontSize:14, fontWeight:'500'}}>
                                    {c?.subject_name}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            )}


            {isLoading ? (
                <View style={{height:'100%', width:'100%', alignItems:'center', justifyContent:'center'}}>
                    <ActivityIndicator size={30} color='#0094DA'/>
                </View>
            ) : (
                <>



                    {/* Assignments */}
                    <ScrollView contentContainerStyle={{display:'flex', flexDirection:'column', alignItems:'center', gap:20, paddingVertical:20, paddingTop:50}} style={{width:'100%'}}>

                        {/* Date filter */}
                        {selectedTab === 'date' && (
                            <View style={{gap:6, width:'80%'}}>
                                <Text>Selected Date</Text>
                                <TouchableOpacity
                                    onPress={() => setOpenedField('selected_date')}
                                    style={{display:'flex', flexDirection:'row', alignItems:'center', backgroundColor:'#F5F5F8', height:60, paddingHorizontal:20, borderTopLeftRadius:5, borderTopRightRadius:5, borderBottomWidth:openedField === 'selected_date' ? 2 : 1, borderBottomColor:openedField === 'selected_date' ? '#0094DA' : 'gray'}}
                                >
                                    <Icon name='calendar-outline' size={25} color='gray'/>
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
                        )}


                        {filteredAssignments.length > 0 ? filteredAssignments?.map(a => (
                            <Card style={{width:'80%', height:250, borderRadius:10, backgroundColor:'#fff'}} key={a._id}>
                                <View style={{width:'100%', height:'100%', display:'flex', flexDirection:'column', justifyContent:'space-between'}}>

                                    {/* Top */}
                                    <View style={{width:'100%', height:'30%', display:'flex', flexDirection:'row', justifyContent:'space-between', padding:10}}>
                                        <View style={{width:'100%', display:'flex', flexDirection:'row', gap:10}}>
                                            <Image
                                                source={{uri:a.creator_image}}
                                                style={{height:60, width:60, borderWidth:2, borderColor:'#3C5EAB', borderRadius:10}}
                                            />
                                            <View style={{flex:1, display:'flex', flexDirection:'column', justifyContent:'space-between'}}>
                                                <View style={{display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
                                                    <Text style={{fontWeight:'900', fontSize:16}}>{a.title}</Text>
                                                    <View style={{height:30, width:70, display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'center', gap:4, paddingHorizontal:5, backgroundColor:'#F5F5F5', borderRadius:50}}>
                                                        <View style={{width:8, height:8, borderRadius:10, backgroundColor:a.is_active ? '#93C314' : 'red'}}/>
                                                        <Text style={{fontSize:12, color:'gray'}}>{a.is_active ? 'Active' : 'Inactive'}</Text>
                                                    </View>
                                                </View>
                                                <Text style={{color:'gray', fontSize:12}}>Updated on {moment(a.updatedAt).format('D-M-YYYY')}</Text>
                                                <View style={{width:'100%', display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
                                                    <Text style={{color:'#3C5EAB', fontSize:14}}>{a.subject}</Text>
                                                    {a?.submitted_assignments?.map(s => s.student.name).includes(user.student.name) && (
                                                        <TouchableOpacity
                                                            onPress={() => navigation.navigate('student-assignment-pdf-preview', {pdfUri:a.submitted_assignments.filter(s => s.student.name === user.student.name)[0].attachment, assignment:"{data:''}", page:'index'})}
                                                            style={{height:30, display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'center', gap:4, paddingHorizontal:5, backgroundColor:'#F5F5F5', borderRadius:50}}
                                                        >
                                                            <Icon name='search-outline' size={10}/>
                                                            <Text style={{fontSize:10, color:'gray'}}>View Submitted Report</Text>
                                                        </TouchableOpacity>
                                                    )}
                                                </View>
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
                                            <Text style={{fontSize:13}}>UPDATED BY: </Text>
                                            <Text style={{fontSize:13, color:'gray'}}>{a.creator}</Text>
                                        </View>
                                    </View>


                                    {/* Bottom */}
                                    <View style={{height:'17.5%', width:'100%', display:'flex', flexDirection:'row', backgroundColor:'#DAE0EF', borderBottomLeftRadius:10, borderBottomRightRadius:10}}>
                                        <TouchableOpacity
                                            disabled={!a.is_active}
                                            onPress={() => navigation.navigate('student-assignment-view', {assignment:a})}
                                            style={{flex:1, height:'100%', display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'center', gap:6, borderBottomLeftRadius:10, borderRightColor:'#fff', borderRightWidth:1.5, opacity:a.is_active ? 1 : 0.5}}
                                        >
                                            <Icon name='eye-outline' color='#3C5EAB' size={20}/>
                                            <Text style={{color:'#3C5EAB'}}>View</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            disabled={!a.is_active}
                                            onPress={() => downloadHandler(a)}
                                            style={{flex:1, height:'100%', display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'center', gap:4, borderRightColor:'#fff', borderRightWidth:1.5, opacity:a.is_active ? 1 : 0.5}}
                                        >
                                            {isDownloadLoading === a.title ? (
                                                <ActivityIndicator />
                                            ) : (
                                                <>
                                                    <Icon name='cloud-download-outline' color='#3C5EAB' size={20}/>
                                                    <Text style={{color:'#3C5EAB'}}>Download</Text>
                                                </>
                                            )}
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            disabled={(a?.submitted_assignments?.map(s => s.student.name).includes(user.student.name) && !a.is_allow_student_for_multiple_submission) || !a.is_active}
                                            onPress={() => {
                                                if(new Date() > new Date(a.last_date_of_submission)){
                                                    setIsSubmitDatePassed(a.last_date_of_submission);
                                                }else{
                                                    navigation.navigate('student-assignment-submission', {assignment:a});
                                                }    
                                            }}
                                            style={{flex:1, height:'100%', display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'center', gap:6, borderBottomRightRadius:10, opacity:(a?.submitted_assignments?.map(s => s.student.name).includes(user.student.name) && !a.is_allow_student_for_multiple_submission) || !a.is_active ? 0.5 : 1}}
                                        >
                                            {a?.submitted_assignments?.map(s => s.student.name).includes(user.student.name) && !a.is_allow_student_for_multiple_submission ? (
                                                <>
                                                    <Text style={{color:'#3C5EAB'}}>Submited</Text>                                                
                                                </>
                                            ) : (
                                                <>
                                                    <Icon name='log-in-outline' color='#3C5EAB' size={20}/>
                                                    <Text style={{color:'#3C5EAB'}}>Submit</Text>
                                                </>
                                            )}
                                        </TouchableOpacity>
                                    </View>

                                </View>
                            </Card>
                        )) : (
                                <View style={{display:'flex', flexDirection:'column', alignItems:'center', gap:10}}>
                                    <Image
                                        style={{height:200, width:200}}
                                        source={require('../../../../assets/Assignments/NoAssignments.png')}
                                    />
                                    <Text style={{fontSize:18, fontWeight:'700'}}>No assignments found</Text>
                                </View>
                            )}
                    </ScrollView>
                </>
            )}
        </View>


        {/* Passed submission date message */}
        {isSubmitDatePassed !== '' && (
            <PassedAssignmentDate
                isSubmitDatePassed={isSubmitDatePassed}
                setIsSubmitDatePassed={setIsSubmitDatePassed}
                pastDate={moment(new Date(isSubmitDatePassed)).format('DD MMM, YYYY')}
            />
        )}


        {/* Submission confirmation message */}
        {isSubmissionConfirmed && (
            <SubmissionConfirmed
                isSubmissionConfirmed={isSubmissionConfirmed}
                setIsSubmissionConfirmed={setIsSubmissionConfirmed}
            />
        )}


        {/* Snackbar */}
        <Snackbar
            style={{backgroundColor:snackbarMessage === 'Error Downloading The Document' ? 'red' : 'green'}}
            visible={visible}
            onDismiss={onDismissSnackBar}
            action={{
                label: <Icon name='close-outline' color='#fff' size={20}/>,
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
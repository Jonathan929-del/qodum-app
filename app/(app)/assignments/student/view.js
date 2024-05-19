// Imports
import axios from 'axios';
import moment from 'moment';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import {AuthContext} from '../../../../context/Auth';
import {useContext, useEffect, useState} from 'react';
import {router, useLocalSearchParams} from 'expo-router';
import {ActivityIndicator, Card, Icon, Snackbar} from 'react-native-paper';
import {Text, TouchableOpacity, View, ScrollView, Linking} from 'react-native';
import PassedAssignmentDate from '../../../../components/assignments/student/PassedAssignmentDate';





// Main functions
const App = () => {

    // Snack bar actions
    const [visible, setVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const onDismissSnackBar = () => setVisible(false);


    // Media library permissions
    const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();


    // Student
    const {user} = useContext(AuthContext);


    // Is submit date passed
    const [isSubmitDatePassed, setIsSubmitDatePassed] = useState('');


    // Assignment
    const [assignment, setAssignment] = useState({});


    // Assignment
    const a = useLocalSearchParams();


    // Is download loading
    const [isDownloadLoading, setIsDownloadLoading] = useState('');


    // Is loading
    const [isLoading, setIsLoading] = useState(false);


    // Download handler
    const downloadHandler = async (_id, attachment) => {

        if (permissionResponse.status !== 'granted') {
            await requestPermission();
        }
        setIsDownloadLoading(_id);
        try {

            const fileUri = FileSystem.documentDirectory + attachment?.split('/')[4];
            const fileInfo = await FileSystem.downloadAsync(attachment, fileUri);
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
            console.log(error.message);
            setSnackbarMessage('Error Downloading Document');
            setIsDownloadLoading('');
        }
    };


    // Use effect
    useEffect(() => {
        setIsLoading(true);
        const fetcher = async () => {

            // Fetching assignment
            const assignmentLink = `${process.env.EXPO_PUBLIC_API_URL}/assignments/assignment/${a._id}`;
            const assignmentRes = await axios.get(assignmentLink);
            setAssignment(assignmentRes.data);
            setIsLoading(false);

        };
        fetcher()
    }, []);

    return (
        <View style={{height:'100%'}}>
            <View style={{width:'100%', height:120, display:'flex', flexDirection:'row', alignItems:'flex-end', justifyContent:'space-between', paddingHorizontal:10, paddingBottom:30, backgroundColor:'#0094DA', borderBottomRightRadius:40, borderBottomLeftRadius:40}}>
                <View style={{display:'flex', flexDirection:'row', alignItems:'center', gap:20}}>
                    <TouchableOpacity
                        onPress={() => router.push('/assignments/student')}
                    >
                        <Icon source='chevron-left' size={40} color='#fff'/>
                    </TouchableOpacity>
                    <Text style={{textAlign:'center', fontSize:18, color:'#fff', fontWeight:'900'}}>{assignment.title}</Text>
                </View>
            </View>


            <ScrollView style={{width:'100%'}} contentContainerStyle={{height:'100%', alignItems:'center', paddingVertical:30, gap:50}}>

                {isLoading ? (
                    <View style={{paddingTop:50}}>
                        <ActivityIndicator />
                    </View>
                ) : (
                    <>
                        {/* Assignment */}
                        <Card style={{width:'80%', height:250, maxHeight:300, borderRadius:10, backgroundColor:'#fff'}}>
                            <View style={{height:'100%', display:'flex', flexDirection:'column', justifyContent:'space-between', gap:10}}>
        
                                {/* Top */}
                                <View style={{display:'flex', flexDirection:'row', justifyContent:'space-between', padding:10}}>
                                    <View style={{display:'flex', flexDirection:'column', gap:4}}>
                                        <Text style={{fontWeight:'900', fontSize:16}}>{assignment.title}</Text>
                                        <Text style={{color:'#3C5EAB', fontSize:14, fontWeight:'700'}}>{assignment.subject}</Text>
                                    </View>
                                    {assignment?.submitted_assignments?.map(s => s.student.name).includes(user.student.name) && (
                                        <TouchableOpacity
                                            onPress={() => Linking.openURL(a.submitted_assignments.filter(s => s.student.name === user.student.name)[0].attachment)}
                                            style={{height:30, display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'center', gap:4, paddingHorizontal:5, backgroundColor:'#F5F5F5', borderRadius:50}}
                                        >
                                            <Icon source='magnify' size={10}/>
                                            <Text style={{fontSize:10, color:'gray'}}>View Submitted Report</Text>
                                        </TouchableOpacity>
                                    )}
                                </View>
        
        
                                {/* Assignment */}
                                <Text style={{fontSize:13, color:'gray', paddingLeft:10}}>{assignment.assignment}</Text>
        
                                {/* Middle */}
                                <View style={{display:'flex', flexDirection:'column', justifyContent:'center', gap:4, padding:10}}>
                                    <View style={{display:'flex', flexDirection:'row', alignItems:'center', gap:2}}>
                                        <Text style={{fontSize:13}}>ASSIGNED ON: </Text>
                                        <Text style={{fontSize:13, color:'gray'}}>{moment(assignment.assignment_date).format('D-M-YYYY')}</Text>
                                    </View>
                                    <View style={{display:'flex', flexDirection:'row', alignItems:'center', gap:2}}>
                                        <Text style={{fontSize:13}}>TO BE SUBMITTED ON: </Text>
                                        <Text style={{fontSize:13, color:'gray'}}>{moment(assignment.to_be_submitted_on).format('D-M-YYYY')}</Text>
                                    </View>
                                </View>
        
        
                                {/* Bottom */}
                                <View style={{width:'100%', display:'flex', flexDirection:'row', backgroundColor:'#DAE0EF', borderBottomLeftRadius:10, borderBottomRightRadius:10}}>
                                    <TouchableOpacity
                                        onPress={() => Linking.openURL(assignment.attachment)}
                                        style={{flex:1, height:'100%', display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'center', gap:6, paddingVertical:10, borderBottomLeftRadius:10, borderRightColor:'#fff', borderRightWidth:1.5}}
                                    >
                                        <Icon source='eye' color='#3C5EAB' size={20}/>
                                        <Text style={{color:'#3C5EAB'}}>View</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => downloadHandler(assignment._id, assignment.attachment)}
                                        style={{flex:1, height:'100%', display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'center', gap:4, borderRightColor:'#fff', borderRightWidth:1.5}}
                                    >
                                        {isDownloadLoading === assignment._id ? (
                                            <ActivityIndicator />
                                        ) : (
                                            <>
                                                <Icon source='download' color='#3C5EAB' size={20}/>
                                                <Text style={{color:'#3C5EAB'}}>Download</Text>
                                            </>
                                        )}
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        disabled={assignment?.submitted_assignments?.map(s => s.student.name).includes(user.student.name) && !assignment.is_allow_student_for_multiple_submission}
                                        onPress={() => {
                                            if(new Date() > new Date(assignment.to_be_submitted_on)){
                                                setIsSubmitDatePassed(assignment.to_be_submitted_on);
                                            }else{
                                                router.push({pathname:'/assignments/student/submit', params:a})}
                                            }
                                        }
                                        style={{flex:1, height:'100%', display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'center', gap:6, borderBottomRightRadius:10, opacity:assignment?.submitted_assignments?.map(s => s.student.name).includes(user.student.name) && !assignment.is_allow_student_for_multiple_submission ? 0.5 : 1}}
                                    >
                                        {assignment?.submitted_assignments?.map(s => s.student.name).includes(user.student.name) && !assignment.is_allow_student_for_multiple_submission ? (
                                            <>
                                                <Text style={{color:'#3C5EAB'}}>Submited</Text>                                                
                                            </>
                                        ) : (
                                            <>
                                                <Icon source='file-upload' color='#3C5EAB' size={20}/>
                                                <Text style={{color:'#3C5EAB'}}>Submit</Text>
                                            </>
                                        )}
                                    </TouchableOpacity>
                                </View>
        
                            </View>
                        </Card>
        
        
                        {/* Submitted report */}
                        {assignment?.submitted_assignments?.map(s => s.student.name).includes(user.student.name) && (
                            <View style={{width:'80%', gap:10}}>
                                <Text style={{fontSize:20, fontWeight:'600'}}>Submitted</Text>
        
                                {/* Submitted answers */}
                                <View style={{gap:20}}>
                                    {assignment?.submitted_assignments?.filter(s => s.student.name === user.student.name).map(s => (
                                        <Card style={{width:'100%', height:120, borderRadius:10, backgroundColor:'#fff'}} key={s.created_at}>
                                            <View style={{height:'100%', display:'flex', flexDirection:'column', justifyContent:'space-between'}}>
        
                                                {/* Top */}
                                                <View style={{display:'flex', flex:1, flexDirection:'column', justifyContent:'center', gap:4, padding:10}}>
                                                    <View style={{display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
                                                        <View style={{display:'flex', flexDirection:'row', alignItems:'center', gap:2}}>
                                                            <Text style={{fontSize:13}}>SUBMITTED ON: </Text>
                                                            <Text style={{fontSize:13, color:'gray'}}>{moment(s.created_at).format('D-M-YYYY')}</Text>
                                                        </View>
                                                        <View style={{display:'flex', flexDirection:'row', alignItems:'center', gap:2}}>
                                                            <Text style={{fontSize:13}}>SR. No.: </Text>
                                                            <Text style={{fontSize:13, color:'gray'}}>{assignment?.submitted_assignments?.filter(s => s.student.name === user.student.name).indexOf(s) + 1}</Text>
                                                        </View>
                                                    </View>
                                                    <View style={{display:'flex', flexDirection:'row', alignItems:'center', gap:2}}>
                                                        <Text style={{fontSize:13}}>SUBMISSION TIME: </Text>
                                                        <Text style={{fontSize:13, color:'gray'}}>{moment(s.created_at).format('hh:mm A')}</Text>
                                                    </View>
                                                </View>
        
        
                                                {/* Bottom */}
                                                <View style={{width:'100%', display:'flex', flexDirection:'row', backgroundColor:'#DAE0EF', borderBottomLeftRadius:10, borderBottomRightRadius:10}}>
                                                    <TouchableOpacity
                                                        onPress={() => router.push({pathname:'/assignments/student/answer', params:{submitted_assignment:JSON.stringify(s), assignment:JSON.stringify(assignment)}})}
                                                        style={{flex:1, height:'100%', display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'center', gap:6, paddingVertical:10, borderBottomLeftRadius:10, borderRightColor:'#fff', borderRightWidth:1.5}}
                                                    >
                                                        <Icon source='eye' color='#3C5EAB' size={20}/>
                                                        <Text style={{color:'#3C5EAB'}}>View</Text>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity
                                                        onPress={() => downloadHandler(s._id,  s.attachment)}
                                                        style={{flex:1, height:'100%', display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'center', gap:4}}
                                                    >
                                                        {isDownloadLoading === s._id ? (
                                                            <ActivityIndicator />
                                                        ) : (
                                                            <>
                                                                <Icon source='download' color='#3C5EAB' size={20}/>
                                                                <Text style={{color:'#3C5EAB'}}>Download</Text>
                                                            </>
                                                        )}
                                                    </TouchableOpacity>
                                                </View>
        
                                            </View>
                                        </Card>
                                    ))}
                                </View>
        
        
        
                            </View>
                        )}
                    </>
                )}


            </ScrollView>


            {/* Passed submission date message */}
            {isSubmitDatePassed !== '' && (
                <PassedAssignmentDate
                    isSubmitDatePassed={isSubmitDatePassed}
                    setIsSubmitDatePassed={setIsSubmitDatePassed}
                    pastDate={moment(new Date(isSubmitDatePassed)).format('DD MMM, YYYY')}
                />
            )}


            {/* Snackbar */}
            <Snackbar
                style={{backgroundColor:snackbarMessage === 'Document Downloaded!' ? 'green' : 'red'}}
                visible={visible}
                onDismiss={onDismissSnackBar}
                action={{
                    label:<Icon source='close' color='#fff' size={20}/>,
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
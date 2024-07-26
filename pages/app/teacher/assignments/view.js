// Imports
import axios from 'axios';
import moment from 'moment';
import {useEffect, useState} from 'react';
import configs from '../../../../configs';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import Icon from 'react-native-vector-icons/Ionicons';
import MoreInfo from '../../../../utils/teacher/MoreInfo';
import {ActivityIndicator, Card, Snackbar} from 'react-native-paper';
import {Text, TouchableOpacity, View, ScrollView} from 'react-native';





// Main functions
const App = ({navigation, route}) => {

    // Snack bar actions
    const [visible, setVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const onDismissSnackBar = () => setVisible(false);


    // Media library permissions
    const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();


    // Is more information opened
    const [isInfoOpened, setIsInfoOpened] = useState(false);


    // Is loading
    const [isLoading, setIsLoading] = useState(false);


    // Assignment
    const {assignment, is_feedback_sent} = route.params;


    // Is download loading
    const [isDownloadLoading, setIsDownloadLoading] = useState(false);


    // Students
    const [students, setStudents] = useState([]);


    // Download handler
    const downloadHandler = async () => {

        if (permissionResponse.status !== 'granted') {
            await requestPermission();
        }
        setIsDownloadLoading(true);
        try {

            const fileUri = FileSystem.documentDirectory + assignment.attachment.split('/')[4];
            const fileInfo = await FileSystem.downloadAsync(assignment.attachment, fileUri);
            if(fileInfo.status === 200){
                await MediaLibrary.saveToLibraryAsync(fileInfo.uri);
                setVisible(true);
                setSnackbarMessage('Document Downloaded!');
                setIsDownloadLoading(false);
            }else{
                setVisible(true);
                setSnackbarMessage('Error Downloading The Document');
                setIsDownloadLoading(false);
            }

        } catch (error) {
            setVisible(true);
            setSnackbarMessage('Error Downloading Document');
            setIsDownloadLoading(false);
            console.log(error);
        }
    };


    // Selected tab
    const [selectedTab, setSelectedTab] = useState('submitted');


    // Use effect
    useEffect(() => {
        if(is_feedback_sent){
            setSnackbarMessage('Feedback Sent!');
            setVisible(true);
        };
        setIsLoading(true);
        const fetcher = async () => {

            // Class students
            const classStudnetsLink = `${configs.EXPO_PUBLIC_API_URL}/classes/class/students`;
            const classStudnetsRes = await axios.post(classStudnetsLink, {class_name:assignment.class_name});
            setStudents(classStudnetsRes.data);
            setIsLoading(false);

        };
        fetcher();
    }, []);
    useEffect(() => {
        if(is_feedback_sent){
            setSnackbarMessage('Feedback Sent!');
            setVisible(true);
        };
        setIsLoading(true);
        const fetcher = async () => {

            // Class students
            const classStudnetsLink = `${configs.EXPO_PUBLIC_API_URL}/classes/class/students`;
            const classStudnetsRes = await axios.post(classStudnetsLink, {class_name:assignment.class_name});
            setStudents(classStudnetsRes.data);
            setIsLoading(false);

        };
        fetcher();
    }, [route.params]);

    return (
        <View style={{height:'100%'}}>
            <View style={{width:'100%', display:'flex', flexDirection:'row', alignItems:'flex-end', justifyContent:'space-between', paddingHorizontal:10, paddingVertical:30, backgroundColor:'#0094DA', borderBottomRightRadius:40, borderBottomLeftRadius:40}}>
                <View style={{display:'flex', flexDirection:'row', alignItems:'center', gap:20}}>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('teacher-assignments')}
                    >
                        <Icon name='arrow-back-outline' size={40} color='#fff'/>
                    </TouchableOpacity>
                    <Text style={{textAlign:'center', fontSize:18, color:'#fff', fontWeight:'900'}}>Assignment</Text>
                </View>
            </View>


            {isLoading ? (
                <View style={{height:'100%', width:'100%', justifyContent:'center', alignItems:'center'}}>
                    <ActivityIndicator />
                </View>
            ) : (
                <>

                    <ScrollView style={{width:'100%'}} contentContainerStyle={{alignItems:'center', paddingVertical:30, gap:30}}>

                        {/* Tabs */}
                        <View style={{width:'80%', display:'flex', flexDirection:'row', borderRadius:100, backgroundColor:'#F5F5F8'}}>
                            <TouchableOpacity
                                onPress={() => setSelectedTab('submitted')}
                                style={{flex:1}}
                            >
                                <Text style={{paddingVertical:10, fontWeight:'800', textAlign:'center', borderRadius:100, color:selectedTab === 'submitted' ? '#fff' : 'gray', backgroundColor:selectedTab === 'submitted' ? '#3C5EAB' : '#F5F5F8'}}>Submitted</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => setSelectedTab('not-submitted')}
                                style={{flex:1}}
                            >
                                <Text style={{paddingVertical:10, fontWeight:'800', textAlign:'center', borderRadius:100, color:selectedTab === 'not-submitted' ? '#fff' : 'gray', backgroundColor:selectedTab === 'not-submitted' ? '#3C5EAB' : '#F5F5F8'}}>Not Submitted</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Assignment */}
                        <Card style={{width:'80%', borderRadius:10, backgroundColor:'#fff'}}>
                            <View style={{display:'flex', flexDirection:'column', justifyContent:'space-between', gap:10}}>

                                {/* Top */}
                                <View style={{display:'flex', flexDirection:'row', justifyContent:'space-between', padding:10}}>
                                    <Text style={{fontWeight:'900', fontSize:16}}>{assignment?.title}</Text>
                                    <Text style={{color:'#3C5EAB', fontSize:14, fontWeight:'700'}}>{assignment?.subject}</Text>
                                </View>


                                {/* Assignment */}
                                <Text style={{fontSize:13, color:'gray', paddingLeft:10}}>{assignment?.description}</Text>

                                {/* Middle */}
                                <View style={{display:'flex', flexDirection:'column', justifyContent:'center', gap:4, padding:10}}>
                                    <View style={{display:'flex', flexDirection:'row', alignItems:'center', gap:2}}>
                                        <Text style={{fontSize:13}}>ASSIGNED ON: </Text>
                                        <Text style={{fontSize:13, color:'gray'}}>{moment(assignment?.assignment_date).format('D-M-YYYY')}</Text>
                                    </View>
                                    <View style={{display:'flex', flexDirection:'row', alignItems:'center', gap:2}}>
                                        <Text style={{fontSize:13}}>LAST DATE OF SUBMISSION: </Text>
                                        <Text style={{fontSize:13, color:'gray'}}>{moment(assignment?.last_date_of_submission).format('D-M-YYYY')}</Text>
                                    </View>
                                </View>


                                {/* Bottom */}
                                <View style={{width:'100%', display:'flex', flexDirection:'row', backgroundColor:'#DAE0EF', borderBottomLeftRadius:10, borderBottomRightRadius:10}}>
                                    <TouchableOpacity
                                        onPress={() => navigation.navigate('teacher-assignment-pdf-preview', {pdfUri:assignment?.attachment, assignment})}
                                        style={{flex:1, height:'100%', display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'center', gap:6, paddingVertical:6, borderBottomLeftRadius:10, borderRightColor:'#fff', borderRightWidth:1.5}}
                                    >
                                        <Icon name='eye' color='#3C5EAB' size={20}/>
                                        <Text style={{color:'#3C5EAB'}}>View</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={downloadHandler}
                                        style={{flex:1, height:'100%', display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'center', gap:4, borderRightColor:'#fff', borderRightWidth:1.5}}
                                    >
                                        {isDownloadLoading ? (
                                            <ActivityIndicator />
                                        ) : (
                                            <>
                                                <Icon name='cloud-download' color='#3C5EAB' size={20}/>
                                                <Text style={{color:'#3C5EAB'}}>Download</Text>
                                            </>
                                        )}
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => setIsInfoOpened(true)}
                                        style={{flex:1, height:'100%', display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'center', gap:6, borderBottomRightRadius:10}}
                                    >
                                        <Icon name='information-circle' color='#3C5EAB' size={20}/>
                                        <Text style={{color:'#3C5EAB'}}>Info</Text>
                                    </TouchableOpacity>
                                </View>

                            </View>
                        </Card>


                        <View style={{width:'80%', gap:10, marginTop:30}}>
                            <View style={{display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
                                <Text style={{fontSize:20, fontWeight:'600'}}>{selectedTab === 'submitted' ? 'Submitted' : 'Not Submitted'}</Text>
                                <Text style={{color:'#0094DA'}}>{
                                    selectedTab === 'submitted'
                                        ? `${students.filter(s => assignment?.submitted_assignments?.map(sa => sa.student.name).includes(s.student.name)).length} / ${students.length}`
                                        : `${students.filter(s => !assignment?.submitted_assignments?.map(sa => sa.student.name).includes(s.student.name)).length} / ${students.length}`
                                    }</Text>
                            </View>

                            {/* Submitted / Unsubmitted answers */}
                            {selectedTab === 'submitted' ? (
                                <View style={{gap:20}}>
                                    {students.filter(s => assignment?.submitted_assignments?.map(sa => sa.student.name).includes(s.student.name)).map(s =>
                                        assignment.submitted_assignments.filter(sa => sa.student.name === s.student.name).map(sa => (
                                            <Card style={{width:'100%', height:120, borderRadius:10, backgroundColor:'#fff'}} key={sa._id}>
                                                <View style={{height:'100%', display:'flex', flexDirection:'column', justifyContent:'space-between'}}>
    
                                                    {/* Top */}
                                                    <View style={{display:'flex', flex:1, flexDirection:'column', justifyContent:'center', gap:4, padding:10}}>
                                                        <View style={{display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'space-between', gap:20}}>
                                                            <View style={{flexBasis:'60%', display:'flex', flexDirection:'row', alignItems:'center', gap:2}}>
                                                                <Text style={{fontSize:13}}>NAME: </Text>
                                                                <Text style={{fontSize:13, color:'gray'}}>{s.student.name}</Text>
                                                            </View>
                                                            <View style={{flexBasis:'40%', display:'flex', flexDirection:'row', alignItems:'center', gap:2}}>
                                                                <Text style={{fontSize:13}}>SR. NO.: </Text>
                                                                <Text style={{fontSize:13, color:'gray'}}>{students.filter(s => assignment?.submitted_assignments?.map(sa => sa.student.name).includes(s.student.name)).indexOf(s) + 1}</Text>
                                                            </View>
                                                        </View>
                                                        <View style={{display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'space-between', gap:20}}>
                                                            <View style={{flexBasis:'60%', display:'flex', flexDirection:'row', alignItems:'center', gap:2}}>
                                                                <Text style={{fontSize:13}}>ADMISSION NO.: </Text>
                                                                <Text style={{fontSize:13, color:'gray'}}>{s.adm_no}</Text>
                                                            </View>
                                                            <View style={{flexBasis:'40%', display:'flex', flexDirection:'row', alignItems:'center', gap:2}}>
                                                                <Text style={{fontSize:13}}>ROLL NO.: </Text>
                                                                <Text style={{fontSize:13, color:'gray'}}>{s.student.roll_no}</Text>
                                                            </View>
                                                        </View>
                                                    </View>
    
    
                                                    {/* Bottom */}
                                                    <View style={{width:'100%', display:'flex', flexDirection:'row', backgroundColor:'#DAE0EF', borderBottomLeftRadius:10, borderBottomRightRadius:10}}>
                                                        <TouchableOpacity
                                                            onPress={() => !sa?.feedback?.feedback && navigation.navigate('teacher-assignment-answer-view', {assignment, answer:sa})}
                                                            style={{flex:1, height:'100%', display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'center', gap:6, paddingVertical:10, borderBottomLeftRadius:10, opacity:sa?.feedback?.feedback ? 0.5 : 1}}
                                                        >
                                                            {sa?.feedback?.feedback ? (
                                                                <>
                                                                    <Text style={{color:'#3C5EAB'}}>Feedback Sent!</Text>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Icon name='eye' color='#3C5EAB' size={20}/>
                                                                    <Text style={{color:'#3C5EAB'}}>View</Text>
                                                                </>
                                                            )}
                                                        </TouchableOpacity>
                                                    </View>
    
                                                </View>
                                            </Card>
                                        )))}
                                </View>
                            ) : (
                                <View style={{gap:20}}>
                                    {students.filter(s => !assignment?.submitted_assignments?.map(sa => sa.student.name).includes(s.student.name)).map(s => (
                                        <Card style={{width:'100%', height:80, borderRadius:10, backgroundColor:'#fff'}} key={s._is}>
                                            <View style={{height:'100%', display:'flex', flexDirection:'column', justifyContent:'space-between'}}>

                                                {/* Top */}
                                                <View style={{display:'flex', flex:1, flexDirection:'column', justifyContent:'center', gap:4, padding:10}}>
                                                    <View style={{display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'space-between', gap:20}}>
                                                        <View style={{flexBasis:'60%', display:'flex', flexDirection:'row', alignItems:'center', gap:2}}>
                                                            <Text style={{fontSize:13}}>NAME: </Text>
                                                            <Text style={{fontSize:13, color:'gray'}}>{s.student.name}</Text>
                                                        </View>
                                                        <View style={{flexBasis:'40%', display:'flex', flexDirection:'row', alignItems:'center', gap:2}}>
                                                            <Text style={{fontSize:13}}>SR. NO.: </Text>
                                                            <Text style={{fontSize:13, color:'gray'}}>{students.filter(s => !assignment?.submitted_assignments?.map(sa => sa.student.name).includes(s.student.name)).indexOf(s) + 1}</Text>
                                                        </View>
                                                    </View>
                                                    <View style={{display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'space-between', gap:20}}>
                                                        <View style={{flexBasis:'60%',  display:'flex', flexDirection:'row', alignItems:'center', gap:2}}>
                                                            <Text style={{fontSize:13}}>ADMISSION NO.: </Text>
                                                            <Text style={{fontSize:13, color:'gray'}}>{s.adm_no}</Text>
                                                        </View>
                                                        <View style={{flexBasis:'40%', display:'flex', flexDirection:'row', alignItems:'center', gap:2}}>
                                                            <Text style={{fontSize:13}}>ROLL NO.: </Text>
                                                            <Text style={{fontSize:13, color:'gray'}}>{s.student.roll_no}</Text>
                                                        </View>
                                                    </View>
                                                </View>
                                            </View>
                                        </Card>
                                    ))}
                                </View>  
                            )}

                        </View>


                    </ScrollView>


                    {isInfoOpened && (
                        <MoreInfo
                            isInfoOpened={isInfoOpened}
                            setIsInfoOpened={setIsInfoOpened}
                        />
                    )}


                    {/* Snackbar */}
                    <Snackbar
                        style={{backgroundColor:snackbarMessage === 'Error Downloading Document' ? 'red' : 'green'}}
                        visible={visible}
                        onDismiss={onDismissSnackBar}
                        action={{
                            label:<Icon name='close' color='#fff' size={20}/>,
                            onPress:() => setVisible(false)
                        }}
                    >
                        {snackbarMessage}
                    </Snackbar>


                </>
            )}
        </View>
    );
};





// Export
export default App;
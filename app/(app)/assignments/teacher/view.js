// Imports
import moment from 'moment';
import {useState} from 'react';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import {router, useLocalSearchParams} from 'expo-router';
import {ActivityIndicator, Card, Icon, Snackbar} from 'react-native-paper';
import {Text, TouchableOpacity, View, ScrollView, Linking} from 'react-native';
import MoreInfo from '../../../../components/assignments/teacher/view/MoreInfo';





// Main functions
const App = () => {

    // Snack bar actions
    const [visible, setVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const onDismissSnackBar = () => setVisible(false);


    // Media library permissions
    const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();


    // Is more information opened
    const [isInfoOpened, setIsInfoOpened] = useState(false);


    // Assignment
    const a = useLocalSearchParams();


    // Is download loading
    const [isDownloadLoading, setIsDownloadLoading] = useState(false);


    // Download handler
    const downloadHandler = async () => {

        if (permissionResponse.status !== 'granted') {
            await requestPermission();
        }
        setIsDownloadLoading(true);
        try {

            const fileUri = FileSystem.documentDirectory + a.attachment.split('/')[4];
            const fileInfo = await FileSystem.downloadAsync(a.attachment, fileUri);
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
        }
    };


    // Selected tab
    const [selectedTab, setSelectedTab] = useState('submitted');

    return (
        <View style={{height:'100%'}}>
            <View style={{width:'100%', height:120, display:'flex', flexDirection:'row', alignItems:'flex-end', justifyContent:'space-between', paddingHorizontal:10, paddingBottom:30, backgroundColor:'#0094DA', borderBottomRightRadius:40, borderBottomLeftRadius:40}}>
                <View style={{display:'flex', flexDirection:'row', alignItems:'center', gap:20}}>
                    <TouchableOpacity
                        onPress={() => router.push('/assignments/teacher')}
                    >
                        <Icon source='chevron-left' size={40} color='#fff'/>
                    </TouchableOpacity>
                    <Text style={{textAlign:'center', fontSize:18, color:'#fff', fontWeight:'900'}}>Assignment</Text>
                </View>
            </View>


            <ScrollView style={{width:'100%'}} contentContainerStyle={{height:'100%', alignItems:'center', paddingVertical:30, gap:30}}>

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
                <Card style={{width:'80%', height:200, maxHeight:250, borderRadius:10, backgroundColor:'#fff'}}>
                    <View style={{height:'100%', display:'flex', flexDirection:'column', justifyContent:'space-between', gap:10}}>

                        {/* Top */}
                        <View style={{display:'flex', flexDirection:'row', justifyContent:'space-between', padding:10}}>
                            <Text style={{fontWeight:'900', fontSize:16}}>{a.title}</Text>
                            <Text style={{color:'#3C5EAB', fontSize:14, fontWeight:'700'}}>{a.subject}</Text>
                        </View>


                        {/* Assignmetn */}
                        <Text style={{fontSize:13, color:'gray', paddingLeft:10}}>{a.description}</Text>

                        {/* Middle */}
                        <View style={{display:'flex', flexDirection:'column', justifyContent:'center', gap:4, padding:10}}>
                            <View style={{display:'flex', flexDirection:'row', alignItems:'center', gap:2}}>
                                <Text style={{fontSize:13}}>ASSIGNED ON: </Text>
                                <Text style={{fontSize:13, color:'gray'}}>{moment(a.assignment_date).format('D-M-YYYY')}</Text>
                            </View>
                            <View style={{display:'flex', flexDirection:'row', alignItems:'center', gap:2}}>
                                <Text style={{fontSize:13}}>TO BE SUBMITTED ON: </Text>
                                <Text style={{fontSize:13, color:'gray'}}>{moment(a.to_be_submitted_on).format('D-M-YYYY')}</Text>
                            </View>
                        </View>


                        {/* Bottom */}
                        <View style={{width:'100%', display:'flex', flexDirection:'row', backgroundColor:'#DAE0EF', borderBottomLeftRadius:10, borderBottomRightRadius:10}}>
                            <TouchableOpacity
                                onPress={() => router.push({pathname:'/assignments/teacher/pdf-preview', params:{pdfUri:a.attachment, assignment:JSON.stringify(a)}})}
                                style={{flex:1, height:'100%', display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'center', gap:6, paddingVertical:10, borderBottomLeftRadius:10, borderRightColor:'#fff', borderRightWidth:1.5}}
                            >
                                <Icon source='eye' color='#3C5EAB' size={20}/>
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
                                        <Icon source='download' color='#3C5EAB' size={20}/>
                                        <Text style={{color:'#3C5EAB'}}>Download</Text>
                                    </>
                                )}
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => setIsInfoOpened(true)}
                                style={{flex:1, height:'100%', display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'center', gap:6, borderBottomRightRadius:10}}
                            >
                                <Icon source='information' color='#3C5EAB' size={20}/>
                                <Text style={{color:'#3C5EAB'}}>Info</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                </Card>

            </ScrollView>


            {isInfoOpened && (
                <MoreInfo
                    isInfoOpened={isInfoOpened}
                    setIsInfoOpened={setIsInfoOpened}
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
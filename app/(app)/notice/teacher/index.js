// Imports
import axios from 'axios';
import moment from 'moment';
import {LinearGradient} from 'expo-linear-gradient';
import {AuthContext} from '../../../../context/Auth';
import {useContext, useEffect, useState} from 'react';
import {router, useLocalSearchParams} from 'expo-router';
import {useNotification} from '../../../../context/NotificationProvider';
import {ActivityIndicator, Card, Icon, Menu, IconButton, Snackbar} from 'react-native-paper';
import {ScrollView, Text, TouchableOpacity, View, Animated, Dimensions, TouchableWithoutFeedback, Alert} from 'react-native';





// Main functions
export default function App() {

    // Snack bar actions
    const [visible, setVisible] = useState(false);
    const onDismissSnackBar = () => setVisible(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');


    // User
    const {user} = useContext(AuthContext);


    // Local params
    const {isEdited, isSubmitted} = useLocalSearchParams();


    // Fade animation
    const [fadeAnim] = useState(new Animated.Value(0));


    // Opened field
    const [openedField, setOpenedField] = useState('');


    // Notices count
    const {setNoticesCount} = useNotification();


    // Is loading
    const [isLoading, setIsLoading] = useState(false);


    // Is compose opened
    const [isComposeOpened, setIsComposeOpened] = useState(false);


    // Notices
    const [notices, setNotices] = useState({});


    // Fethcer
    const fetcher = async () => {

        // Fetching notices
        const fetchNoticesLink = `${process.env.EXPO_PUBLIC_API_URL}/notifications/user-notices`;
        const fetchNoticesRes = await axios.post(fetchNoticesLink, {topic:[user.adm_no.replace(/\//g, '_')]});
        setNotices(fetchNoticesRes.data);

        // Viewing notices
        const viewNoticesLink = `${process.env.EXPO_PUBLIC_API_URL}/notifications/view-notices`;
        await axios.post(viewNoticesLink, {notifications_ids:fetchNoticesRes.data.unviewed_notifications.map(d => d.id)});
        setNoticesCount(0);
        setIsLoading(false);

    };


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
                    onPress: () => deleteNotice(id),
                    style:'default',
                },
            ]
    );


    // Delete assignment
    const deleteNotice = async id => {
        try {
            setIsLoading(true);
            const link = `${process.env.EXPO_PUBLIC_API_URL}/notifications/delete-notice`;
            await axios.post(link, {notice_id:Number(id)});
            setSnackbarMessage('Message Deleted Successfully!');
            setVisible(true);
            fetcher();
        }catch(err){
            console.log(err);
        }
    };


    // Use effects
    useEffect(() => {
        setIsLoading(true);
        if(isSubmitted){
            setVisible(true);
            setSnackbarMessage('Message Sent Successfully!');
        };
        if(isEdited){
            setVisible(true);
            setSnackbarMessage('Message Edited Successfully!');
        };
        setTimeout(() => {
            fetcher();
        }, 1000);
    }, []);
    useEffect(() => {
        if (isComposeOpened) {
        Animated.timing(fadeAnim, {
            toValue:1,
            duration:200,
            useNativeDriver:true
        }).start();
        }else{
        Animated.timing(fadeAnim, {
            toValue:0,
            duration:200,
            useNativeDriver:true
        }).start();
        }
    }, [isComposeOpened]);

    return (
        <View style={{height:'100%'}}>
            <ScrollView contentContainerStyle={{alignItems:'center', gap:30, paddingBottom:50}}>
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

                {/* Notices */}
                <View style={{width:'90%', display:'flex', flexDirection:'column', alignItems:'center', gap:10, paddingBottom:10}}>
                    {isLoading ? (
                        <ActivityIndicator />
                    ) : (notices?.unviewed_notifications?.length + notices?.viewed_notifications?.length) < 1 ? (
                        <Text>No notices</Text>
                    ) : (
                        <View style={{width:'100%', gap:20}}>

                            {notices.unviewed_notifications?.map(n => (
                                <Card style={{width:'100%'}} key={n.id}>
                                    <View style={{display:'flex', flexDirection:'column', gap:4, paddingVertical:10, paddingHorizontal:20}}>
                                        <View style={{display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
                                            <View style={{display:'flex', flexDirection:'column'}}>
                                                <Text style={{fontSize:16, fontWeight:'600'}}>{n.title}</Text>
                                                <Text style={{fontSize:14}}>{n.body}</Text>
                                            </View>
                                            {n.created_by === user.adm_no && (
                                                <Menu
                                                    visible={openedField === n.id}
                                                    onDismiss={() => setOpenedField('')}
                                                    anchor={
                                                        <IconButton
                                                            size={20}
                                                            icon='dots-vertical'
                                                            onPress={() => setOpenedField(n.id)}
                                                        />
                                                    }
                                                >
                                                    <Menu.Item onPress={() => router.push({pathname:'/notice/teacher/edit-app-message', params:n})} title='Edit' />
                                                    <Menu.Item onPress={() => showDeleteAlert(n.notice_id)} title='Delete' />
                                                </Menu>
                                            )}
                                        </View>
                                        <View style={{display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
                                            <View style={{display:'flex', flexDirection:'row', alignItems:'center', marginTop:10}}>
                                                <Icon source='calendar' color='#0094DA' size={20}/>
                                                <Text style={{fontSize:14, color:'#0094DA', marginLeft:2}}>Date:</Text>
                                                <Text style={{fontSize:14, color:'gray'}}>{moment(new Date(n.created_at._seconds * 1000 + n.created_at._nanoseconds / 1000000)).format('DD-MM-YYYY')}</Text>
                                            </View>
                                            <View style={{display:'flex', flexDirection:'row', alignItems:'center', marginTop:10}}>
                                                <Icon source='clock' color='#0094DA' size={20}/>
                                                <Text style={{fontSize:14, color:'#0094DA', marginLeft:2}}>Time:</Text>
                                                <Text style={{fontSize:14, color:'gray'}}>{moment(new Date(n.created_at._seconds * 1000 + Math.floor(n.created_at._nanoseconds / 1000000))).format('HH:mm')}</Text>
                                            </View>
                                        </View>
                                    </View>
                                </Card>
                            ))}

                            {notices?.unviewed_notifications?.length > 0 && notices?.viewed_notifications?.length > 0 && (
                                <View style={{display:'flex', flexDirection:'row', gap:10, alignItems:'center'}}>
                                    <LinearGradient
                                        colors={['#fff', '#0094DA']}
                                        start={{x:0, y:0}}
                                        end={{x:1, y:0}}
                                        style={{flex:1, opacity:0.7, height:1}}
                                    />
                                    <Text style={{color:'#0094DA'}}>Last read</Text>
                                    <LinearGradient
                                        colors={['#0094DA', '#fff']}
                                        start={{x:0, y:0}}
                                        end={{x:1, y:0}}
                                        style={{flex:1, opacity:0.7, height:1}}
                                    />
                                </View>
                            )}

                            {notices.viewed_notifications?.map(n => (
                                <Card style={{width:'100%'}} key={n.id}>
                                    <View style={{display:'flex', flexDirection:'column', gap:4, paddingVertical:10, paddingHorizontal:20}}>
                                        <View style={{display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
                                            <View style={{display:'flex', flexDirection:'column'}}>
                                                <Text style={{fontSize:16, fontWeight:'600'}}>{n.title}</Text>
                                                <Text style={{fontSize:14}}>{n.body}</Text>
                                            </View>
                                            {n.created_by === user.adm_no && (
                                                <Menu
                                                    visible={openedField === n.id}
                                                    onDismiss={() => setOpenedField('')}
                                                    anchor={
                                                        <IconButton
                                                            size={20}
                                                            icon='dots-vertical'
                                                            onPress={() => setOpenedField(n.id)}
                                                        />
                                                    }
                                                >
                                                    <Menu.Item onPress={() => router.push({pathname:'/notice/teacher/edit-app-message', params:n})} title='Edit' />
                                                    <Menu.Item onPress={() => showDeleteAlert(n.notice_id)} title='Delete' />
                                                </Menu>
                                            )}
                                        </View>
                                        <View style={{display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
                                            <View style={{display:'flex', flexDirection:'row', alignItems:'center', marginTop:10}}>
                                                <Icon source='calendar' color='#0094DA' size={20}/>
                                                <Text style={{fontSize:14, color:'#0094DA', marginLeft:2}}>Date:</Text>
                                                <Text style={{fontSize:14, color:'gray'}}>{moment(new Date(n.created_at._seconds * 1000 + n.created_at._nanoseconds / 1000000)).format('DD-MM-YYYY')}</Text>
                                            </View>
                                            <View style={{display:'flex', flexDirection:'row', alignItems:'center', marginTop:10}}>
                                                <Icon source='clock' color='#0094DA' size={20}/>
                                                <Text style={{fontSize:14, color:'#0094DA', marginLeft:2}}>Time:</Text>
                                                <Text style={{fontSize:14, color:'gray'}}>{moment(new Date(n.created_at._seconds * 1000 + Math.floor(n.created_at._nanoseconds / 1000000))).format('HH:mm')}</Text>
                                            </View>
                                        </View>
                                    </View>
                                </Card>
                            ))}

                        </View>
                    )}
                </View>

            </ScrollView>

            {!isComposeOpened && (
                <TouchableOpacity
                    onPress={() => setIsComposeOpened(true)}
                    style={{position:'absolute', bottom:30, right:20, width:40, height:40, alignItems:'center', justifyContent:'center', borderRadius:40, backgroundColor:'#0094DA'}}
                >
                    <Icon source='square-edit-outline' size={25} color='#fff'/>
                </TouchableOpacity>
            )}

            {/* Compose page */}
            {isComposeOpened && (
                <Animated.View
                    style={{position:'absolute', width:'100%', height:Dimensions.get('screen').height, zIndex:10, backgroundColor:'rgba(0, 0, 0, 0.5)', opacity:fadeAnim}}
                >
                    <TouchableWithoutFeedback
                        onPress={() => setIsComposeOpened(false)}
                    >
                        <View style={{height:'100%', width:'100%', alignItems:'flex-end', justifyContent:'flex-end'}}>
                            <Text>-</Text>
                            <TouchableWithoutFeedback onPress={() => setIsComposeOpened(isComposeOpened)}>
                                <View
                                    style={{display:'flex', justifyContent:'flex-end', alignItems:'flex-end', width:300, height:200, borderRadius:10, marginBottom:50, paddingBottom:30, paddingRight:20}}
                                >

                                    <View style={{display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'center', marginBottom:10}}>
                                        <TouchableOpacity
                                            onPress={() => router.push('/notice/teacher/sms-and-app-message')}
                                            style={{marginRight:10, paddingVertical:2, paddingHorizontal:10, borderRadius:4, backgroundColor:'#fff'}}
                                        >
                                            <Text>SMS and App Message</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={() => router.push('/notice/teacher/sms-and-app-message')}
                                            style={{width:40, height:40, alignItems:'center', justifyContent:'center', borderRadius:40, backgroundColor:'#0094DA'}}
                                        >
                                            <Icon source='cellphone-sound' size={25} color='#fff'/>
                                        </TouchableOpacity>
                                    </View>

                                    <View style={{display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'center', marginBottom:10}}>
                                        <TouchableOpacity
                                            onPress={() => router.push('/notice/teacher/app-message')}
                                            style={{marginRight:10, paddingVertical:2, paddingHorizontal:10, borderRadius:4, backgroundColor:'#fff'}}
                                        >
                                            <Text>Only App Message</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={() => router.push('/notice/teacher/app-message')}
                                            style={{width:40, height:40, alignItems:'center', justifyContent:'center', borderRadius:40, backgroundColor:'#0094DA'}}
                                        >
                                            <Icon source='chat-processing' size={25} color='#fff'/>
                                        </TouchableOpacity>
                                    </View>

                                    <TouchableOpacity
                                        onPress={() => setIsComposeOpened(false)}
                                        style={{width:40, height:40, alignItems:'center', justifyContent:'center', borderRadius:40, backgroundColor:'#0094DA'}}
                                    >
                                        <Icon source='square-edit-outline' size={25} color='#fff'/>
                                    </TouchableOpacity>

                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    </TouchableWithoutFeedback>
                </Animated.View>
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
                {snackbarMessage}
            </Snackbar>

        </View>
    );
};
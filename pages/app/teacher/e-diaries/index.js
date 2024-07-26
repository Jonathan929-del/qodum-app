// Imports
import axios from 'axios';
import moment from 'moment';
import configs from '../../../../configs';
import {LinearGradient} from 'expo-linear-gradient';
import {AuthContext} from '../../../../context/Auth';
import Icon from 'react-native-vector-icons/Ionicons';
import {useContext, useEffect, useState} from 'react';
import {ActivityIndicator, Card, Menu, IconButton, Snackbar, Button} from 'react-native-paper';
import {ScrollView, Text, TouchableOpacity, View, Animated, Dimensions, TouchableWithoutFeedback, Alert, LayoutAnimation, UIManager, Platform} from 'react-native';





// Main functions
export default function App({navigation, route}) {

    // Snack bar actions
    const [visible, setVisible] = useState(false);
    const onDismissSnackBar = () => setVisible(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');


    // User
    const {user} = useContext(AuthContext);


    // Fade animation
    const [fadeAnim] = useState(new Animated.Value(0));


    // Opened field
    const [openedField, setOpenedField] = useState('');


    // Is loading
    const [isLoading, setIsLoading] = useState(false);


    // Is compose opened
    const [isComposeOpened, setIsComposeOpened] = useState(false);


    // ediaries
    const [ediaries, setEdiaries] = useState({});


    // Fethcer
    const fetcher = async () => {

        // Fetching e-diaries
        const fetchEdiariesLink = `${configs.EXPO_PUBLIC_API_URL}/notifications/user-ediaries`;
        const fetchEdiariesRes = await axios.post(fetchEdiariesLink, {topic:[user.adm_no.replace(/\//g, '_')]});
        setEdiaries(fetchEdiariesRes.data);

        // Viewing e-diaries
        const viewEdiariesLink = `${configs.EXPO_PUBLIC_API_URL}/notifications/view-ediaries`;
        await axios.post(viewEdiariesLink, {ediaries_ids:fetchEdiariesRes.data.unviewed_notifications.map(d => d.id)});
        // setNoticesCount(0);
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
                    onPress: () => deleteEdiary(id),
                    style:'default',
                },
            ]
    );


    // Delete assignment
    const deleteEdiary = async id => {
        try {
            setIsLoading(true);
            const link = `${configs.EXPO_PUBLIC_API_URL}/notifications/delete-ediary`;
            await axios.post(link, {notice_id:Number(id)});
            setSnackbarMessage('Message Deleted Successfully!');
            setVisible(true);
            fetcher();
        }catch(err){
            console.log(err);
        }
    };


    // Ediary body
    if(Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental){
        UIManager.setLayoutAnimationEnabledExperimental(true);
    };
    const [expandedCards, setExpandedCards] = useState({});
    const toggleExpanded = id => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setExpandedCards((prev) => ({ ...prev, [id]: !prev[id] }));
    };
    const renderContent = (content, id) => {
      if(expandedCards[id]) return content;
      return content.length > 100 ? content.substring(0, 100) + '...' : content;
    };


    // Use effects
    useEffect(() => {
        setIsLoading(true);
        if(route?.params?.isSubmitted){
            setVisible(true);
            setSnackbarMessage('Message Sent Successfully!');
        };
        if(route?.params?.isEdited){
            setVisible(true);
            setSnackbarMessage('Message Edited Successfully!');
        };
        setTimeout(() => {
            fetcher();
        }, 2000);
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
    useEffect(() => {
        setIsLoading(true);
        if(route?.params?.isSubmitted){
            setVisible(true);
            setSnackbarMessage('Message Sent Successfully!');
        };
        if(route?.params?.isEdited){
            setVisible(true);
            setSnackbarMessage('Message Edited Successfully!');
        };
        setTimeout(() => {
            fetcher();
        }, 2000);
    }, [route.params]);


    return (
        <View style={{height:'100%'}}>
            <ScrollView contentContainerStyle={{alignItems:'center', gap:30, paddingBottom:50}}>
                <View style={{width:'100%', display:'flex', flexDirection:'row', alignItems:'flex-end', justifyContent:'space-between', paddingHorizontal:10, paddingVertical:30, backgroundColor:'#0094DA', borderBottomRightRadius:40, borderBottomLeftRadius:40}}>
                    <View style={{display:'flex', flexDirection:'row', alignItems:'center', gap:20}}>
                        <TouchableOpacity
                            onPress={() => navigation.navigate('teacher-tabs', {screen:'Home'})}
                        >
                            <Icon name='arrow-back-outline' size={35} color='#fff'/>
                        </TouchableOpacity>
                        <Text style={{textAlign:'center', fontSize:18, color:'#fff', fontWeight:'900'}}>E-diary</Text>
                    </View>
                </View>

                {/* E-diaries */}
                <View style={{width:'90%', display:'flex', flexDirection:'column', alignItems:'center', gap:10, paddingBottom:10}}>
                    {isLoading ? (
                        <ActivityIndicator />
                    ) : (ediaries?.unviewed_notifications?.length + ediaries?.viewed_notifications?.length) < 1 ? (
                        <Text>No messages</Text>
                    ) : (
                        <View style={{width:'100%', gap:20}}>

                            {ediaries.unviewed_notifications?.map(n => (
                                <Card style={{width:'100%'}} key={n.id}>
                                    <View style={{display:'flex', flexDirection:'column', gap:4, paddingVertical:10, paddingHorizontal:20}}>
                                        <View style={{display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
                                            <View style={{display:'flex', flexDirection:'column'}}>
                                                <View style={{width:'100%', display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
                                                    <Text style={{fontSize:16, fontWeight:'600'}}>{n.title}</Text>
                                                    {n.created_by === user.adm_no && (
                                                        <Menu
                                                            visible={openedField === n.id}
                                                            onDismiss={() => setOpenedField('')}
                                                            anchor={
                                                                <Icon
                                                                    size={20}
                                                                    name='ellipsis-vertical'
                                                                    onPress={() => setOpenedField(n.id)}
                                                                />
                                                            }
                                                        >
                                                            <Menu.Item onPress={() => navigation.navigate('teacher-ediary-edit', {notice:n})} title='Edit' />
                                                            <Menu.Item onPress={() => showDeleteAlert(n.notice_id)} title='Delete' />
                                                        </Menu>
                                                    )}
                                                </View>
                                                <Text>{renderContent(n.body, n.id)}</Text>
                                                {n.body.length > 100 && (
                                                    <Button onPress={() => toggleExpanded(n.id)}>
                                                    {expandedCards[n.id] ? 'View less' : 'View more'}
                                                    </Button>
                                                )}
                                            </View>
                                        </View>
                                        <View style={{display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
                                            <View style={{display:'flex', flexDirection:'row', alignItems:'center', marginTop:10}}>
                                                <Icon name='calendar' color='#0094DA' size={20}/>
                                                <Text style={{fontSize:14, color:'#0094DA', marginLeft:2}}>Date:</Text>
                                                <Text style={{fontSize:14, color:'gray'}}>{moment(new Date(n.created_at._seconds * 1000 + n.created_at._nanoseconds / 1000000)).format('DD-MM-YYYY')}</Text>
                                            </View>
                                            <View style={{display:'flex', flexDirection:'row', alignItems:'center', marginTop:10}}>
                                                <Icon name='time' color='#0094DA' size={20}/>
                                                <Text style={{fontSize:14, color:'#0094DA', marginLeft:2}}>Time:</Text>
                                                <Text style={{fontSize:14, color:'gray'}}>{moment(new Date(n.created_at._seconds * 1000 + Math.floor(n.created_at._nanoseconds / 1000000))).format('HH:mm')}</Text>
                                            </View>
                                        </View>
                                    </View>
                                </Card>
                            ))}

                            {ediaries?.unviewed_notifications?.length > 0 && ediaries?.viewed_notifications?.length > 0 && (
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

                            {ediaries.viewed_notifications?.map(n => (
                                <Card style={{width:'100%'}} key={n.id}>
                                    <View style={{display:'flex', flexDirection:'column', gap:4, paddingVertical:10, paddingHorizontal:20}}>
                                        <View style={{display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
                                            <View style={{display:'flex', flexDirection:'column'}}>
                                                <View style={{width:'100%', display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
                                                    <Text style={{fontSize:16, fontWeight:'600'}}>{n.title}</Text>
                                                    {n.created_by === user.adm_no && (
                                                        <Menu
                                                            visible={openedField === n.id}
                                                            onDismiss={() => setOpenedField('')}
                                                            anchor={
                                                                <Icon
                                                                    size={20}
                                                                    name='ellipsis-vertical'
                                                                    onPress={() => setOpenedField(n.id)}
                                                                />
                                                            }
                                                        >
                                                            <Menu.Item onPress={() => navigation.navigate('teacher-ediary-edit', {notice:n})} title='Edit' />
                                                            <Menu.Item onPress={() => showDeleteAlert(n.notice_id)} title='Delete' />
                                                        </Menu>
                                                    )}
                                                </View>
                                                <Text>{renderContent(n.body, n.id)}</Text>
                                                {n.body.length > 100 && (
                                                    <Button onPress={() => toggleExpanded(n.id)}>
                                                    {expandedCards[n.id] ? 'View less' : 'View more'}
                                                    </Button>
                                                )}
                                            </View>
                                        </View>
                                        <View style={{display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
                                            <View style={{display:'flex', flexDirection:'row', alignItems:'center', marginTop:10}}>
                                                <Icon name='calendar' color='#0094DA' size={20}/>
                                                <Text style={{fontSize:14, color:'#0094DA', marginLeft:2}}>Date:</Text>
                                                <Text style={{fontSize:14, color:'gray'}}>{moment(new Date(n.created_at._seconds * 1000 + n.created_at._nanoseconds / 1000000)).format('DD-MM-YYYY')}</Text>
                                            </View>
                                            <View style={{display:'flex', flexDirection:'row', alignItems:'center', marginTop:10}}>
                                                <Icon name='time' color='#0094DA' size={20}/>
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
                    <Icon name='create' size={25} color='#fff'/>
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
                                            onPress={() => navigation.navigate('teacher-ediary-create')}
                                            style={{marginRight:10, paddingVertical:2, paddingHorizontal:10, borderRadius:4, backgroundColor:'#fff'}}
                                        >
                                            <Text>Send a message</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={() => navigation.navigate('teacher-ediary-create')}
                                            style={{width:40, height:40, alignItems:'center', justifyContent:'center', borderRadius:40, backgroundColor:'#0094DA'}}
                                        >
                                            <Icon name='chatbubble-ellipses' size={25} color='#fff'/>
                                        </TouchableOpacity>
                                    </View>

                                    <TouchableOpacity
                                        onPress={() => setIsComposeOpened(false)}
                                        style={{width:40, height:40, alignItems:'center', justifyContent:'center', borderRadius:40, backgroundColor:'#0094DA'}}
                                    >
                                        <Icon name='create' size={25} color='#fff'/>
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
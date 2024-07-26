// Imports
import axios from 'axios';
import moment from 'moment';
import configs from '../../../../configs';
import {LinearGradient} from 'expo-linear-gradient';
import {AuthContext} from '../../../../context/Auth';
import Icon from 'react-native-vector-icons/Ionicons';
import {useContext, useEffect, useState} from 'react';
import {ActivityIndicator, Card, Button} from 'react-native-paper';
import {useNotification} from '../../../../context/NotificationProvider';
import {ScrollView, Text, TouchableOpacity, View, LayoutAnimation, UIManager, Platform} from 'react-native';





// Main functions
export default function App({navigation}) {

    // User
    const {user} = useContext(AuthContext);


    // Ediaries count
    const {setEdiariesCount} = useNotification();


    // Is loading
    const [isLoading, setIsLoading] = useState(false);


    // Ediaries
    const [ediaries, setEdiaries] = useState({});


    // E-diary body
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


    // Use effect
    useEffect(() => {
        setIsLoading(true);
        const fetcher = async () => {

            // Fetching ediaries
            const fetchEdiariesLink = `${configs.EXPO_PUBLIC_API_URL}/notifications/user-ediaries`;
            const fetchEdiariesRes = await axios.post(fetchEdiariesLink, {topic:[user.adm_no.replace(/\//g, '_'), user?.student?.class_name]});
            setEdiaries(fetchEdiariesRes.data);


            // Viewing ediaries
            const viewEdiariesLink = `${configs.EXPO_PUBLIC_API_URL}/notifications/view-ediaries`;
            await axios.post(viewEdiariesLink, {ediaries_ids:fetchEdiariesRes.data.unviewed_notifications.map(d => d.id)});
            setEdiariesCount(0);
            setIsLoading(false);

        };
        fetcher()
    }, []);

    return (
        <View style={{height:'100%'}}>
            <ScrollView contentContainerStyle={{alignItems:'center', gap:30, paddingBottom:50}}>
                <View style={{width:'100%', display:'flex', flexDirection:'row', alignItems:'flex-end', justifyContent:'space-between', paddingHorizontal:10, paddingVertical:30, backgroundColor:'#0094DA', borderBottomRightRadius:40, borderBottomLeftRadius:40}}>
                    <View style={{display:'flex', flexDirection:'row', alignItems:'center', gap:20}}>
                        <TouchableOpacity
                            onPress={() => navigation.navigate('student-tabs', {screen:'Home'})}
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
                                        <Text style={{fontSize:16, fontWeight:'600'}}>{n.title}</Text>
                                        <Text>{renderContent(n.body, n.id)}</Text>
                                        {n.body.length > 100 && (
                                            <Button onPress={() => toggleExpanded(n.id)}>
                                            {expandedCards[n.id] ? 'View less' : 'View more'}
                                            </Button>
                                        )}
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
                                        <Text style={{fontSize:16, fontWeight:'600'}}>{n.title}</Text>
                                        <Text>{renderContent(n.body, n.id)}</Text>
                                        {n.body.length > 100 && (
                                            <Button onPress={() => toggleExpanded(n.id)}>
                                            {expandedCards[n.id] ? 'View less' : 'View more'}
                                            </Button>
                                        )}
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
        </View>
    );
};
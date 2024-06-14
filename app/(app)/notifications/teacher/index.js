// Imports
import axios from 'axios';
import moment from 'moment';
import {router} from 'expo-router';
import {LinearGradient} from 'expo-linear-gradient';
import {AuthContext} from '../../../../context/Auth';
import {useContext, useEffect, useState} from 'react';
import {ActivityIndicator, Card, Icon} from 'react-native-paper';
import {useNotification} from '../../../../context/NotificationProvider';
import {Image, ScrollView, Text, TouchableOpacity, View} from 'react-native';





// Main functions
export default function App() {

    // User
    const {user} = useContext(AuthContext);


    // Notifications count
    const {setNotificationsCount} = useNotification();


    // Is loading
    const [isLoading, setIsLoading] = useState(false);


    // Notifications
    const [notifications, setNotifications] = useState({});


    // Click handler
    const clickHandler = n => {
        if(n.type === 'submission'){
            router.push({pathname:'/assignments/teacher/view-answer', params:{
                a:JSON.stringify({
                    _id:n.assignment_id
                }),
                answer:JSON.stringify({
                    _id:n.answer_id
                })
            }});
        }
    };


    // Use effect
    useEffect(() => {
        setIsLoading(true);
        const fetcher = async () => {

            // Fetching notifications
            const fetchNotificationLink = `${process.env.EXPO_PUBLIC_API_URL}/notifications/user-notifications`;
            const fetchNotificationsRes = await axios.post(fetchNotificationLink, {topic:[user.adm_no.replace(/\//g, '_')]});
            setNotifications(fetchNotificationsRes.data);

            // Viewing notifications
            const viewNotificationLink = `${process.env.EXPO_PUBLIC_API_URL}/notifications/view-notifications`;
            await axios.post(viewNotificationLink, {notifications_ids:fetchNotificationsRes.data.unviewed_notifications.map(d => d.id)});
            setNotificationsCount(0);
            setIsLoading(false);

        };
        fetcher()
    }, []);

    return (
        <ScrollView contentContainerStyle={{alignItems:'center', gap:30, paddingBottom:50}}>
            <View style={{width:'100%', height:120, display:'flex', flexDirection:'row', alignItems:'flex-end', justifyContent:'space-between', paddingHorizontal:10, paddingBottom:30, backgroundColor:'#0094DA', borderBottomRightRadius:40, borderBottomLeftRadius:40}}>
                <View style={{display:'flex', flexDirection:'row', alignItems:'center', gap:20}}>
                    <TouchableOpacity
                        onPress={() => router.push('/')}
                    >
                        <Icon source='chevron-left' size={40} color='#fff'/>
                    </TouchableOpacity>
                    <Text style={{textAlign:'center', fontSize:18, color:'#fff', fontWeight:'900'}}>Activity</Text>
                </View>
            </View>

            {/* Notifications */}
            <View style={{width:'90%', display:'flex', flexDirection:'column', alignItems:'center', gap:10, paddingBottom:10}}>
                {isLoading ? (
                    <ActivityIndicator />
                ) : (notifications?.unviewed_notifications?.length + notifications?.viewed_notifications?.length) < 1 ? (
                    <Text>No notifications</Text>
                ) : (
                    <View style={{width:'100%', gap:20}}>

                        {notifications.unviewed_notifications?.map(n => (
                            <TouchableOpacity
                                key={n.id}
                                onPress={() => clickHandler(n)}
                            >
                                <Card style={{width:'100%'}} key={n.id}>
                                    <View style={{display:'flex', flexDirection:'column', gap:4, paddingVertical:10, paddingHorizontal:20}}>
                                        <View style={{display:'flex', flexDirection:'row', alignItems:'center', gap:8}}>
                                            <Image
                                                source={require('../../../../assets/Home/Results.png')}
                                                style={{height:30, width:30}}
                                            />
                                            <Text style={{fontSize:16, fontWeight:'600'}}>{n.title}</Text>
                                        </View>
                                        <Text style={{fontSize:14}}>{n.body}</Text>
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
                            </TouchableOpacity>
                        ))}

                        {notifications?.unviewed_notifications?.length > 0 && notifications?.viewed_notifications?.length > 0 && (
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

                        {notifications.viewed_notifications?.map(n => (
                            <TouchableOpacity
                                key={n.id}
                                onPress={() => clickHandler(n)}
                            >
                                <Card style={{width:'100%'}} key={n.id}>
                                    <View style={{display:'flex', flexDirection:'column', gap:4, paddingVertical:10, paddingHorizontal:20}}>
                                        <View style={{display:'flex', flexDirection:'row', alignItems:'center', gap:8}}>
                                            <Image
                                                source={require('../../../../assets/Home/Results.png')}
                                                style={{height:30, width:30}}
                                            />
                                            <Text style={{fontSize:16, fontWeight:'600'}}>{n.title}</Text>
                                        </View>
                                        <Text style={{fontSize:14}}>{n.body}</Text>
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
                            </TouchableOpacity>
                        ))}

                    </View>
                )}
            </View>

        </ScrollView>
    );
};
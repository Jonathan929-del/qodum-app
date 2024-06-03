// Imports
import axios from 'axios';
import moment from 'moment';
import { router } from 'expo-router';
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


    // Selected tab
    const [selectedTab, setSelectedTab] = useState('notice');


    // Is loading
    const [isLoading, setIsLoading] = useState(false);


    // Notifications
    const [notifications, setNotifications] = useState({});


    // Click handler
    const clickHandler = n => {
        if(n.type === 'assignment'){
            const a = {
                _id:n.assignment_id
            }
            router.push({pathname:'/assignments/student/view', params:a});
        }else{
            router.push({pathname:'/assignments/student/view-feedback', params:{
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
            const fetchNotificationsRes = await axios.post(fetchNotificationLink, {to:[user.adm_no, user?.student?.class_name]});
            setNotifications(fetchNotificationsRes.data);

            // Viewing notifications
            const viewNotificationLink = `${process.env.EXPO_PUBLIC_API_URL}/notifications/view-notifications`;
            await axios.post(viewNotificationLink, {notifications_ids:fetchNotificationsRes.data.unviewed_notifications.map(d => d.id)});
            // setNotificationsCount(0);
            setIsLoading(false);

        };
        fetcher()
    }, []);

    return (
        <ScrollView style={{paddingTop:50}} contentContainerStyle={{alignItems:'center', gap:30, paddingBottom:50}}>

            {/* Tabs */}
            <View style={{width:'80%', display:'flex', flexDirection:'row', borderRadius:100, backgroundColor:'#F5F5F8'}}>
                <TouchableOpacity
                    onPress={() => setSelectedTab('notice')}
                    style={{flex:1}}
                >
                    <Text style={{paddingVertical:10, fontWeight:'800', textAlign:'center', borderRadius:100, color:selectedTab === 'notice' ? '#fff' : 'gray', backgroundColor:selectedTab === 'notice' ? '#3C5EAB' : '#F5F5F8'}}>Notice</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        setSelectedTab('circular');
                    }}
                    style={{flex:1}}
                >
                    <Text style={{paddingVertical:10, fontWeight:'800', textAlign:'center', borderRadius:100, color:selectedTab === 'circular' ? '#fff' : 'gray', backgroundColor:selectedTab === 'circular' ? '#3C5EAB' : '#F5F5F8'}}>Circular</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => setSelectedTab('message')}
                    style={{flex:1}}
                >
                    <Text style={{paddingVertical:10, fontWeight:'800', textAlign:'center', borderRadius:100, color:selectedTab === 'message' ? '#fff' : 'gray', backgroundColor:selectedTab === 'message' ? '#3C5EAB' : '#F5F5F8'}}>Message</Text>
                </TouchableOpacity>
            </View>

            {/* Notifications */}
            <View style={{width:'80%', display:'flex', flexDirection:'column', alignItems:'center', gap:10, paddingBottom:10}}>
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
                                <Card style={{width:'100%'}}>
                                    <View style={{display:'flex', flexDirection:'column', gap:4, paddingVertical:10, paddingHorizontal:20}}>
                                        <View style={{display:'flex', flexDirection:'row', alignItems:'center', gap:8}}>
                                            <Image
                                                source={n.type === 'assignment'? require('../../../../assets/Home/Results.png') : require('../../../../assets/Notifications/AddedFeedback.png')}
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
                                <Card style={{width:'100%'}}>
                                    <View style={{display:'flex', flexDirection:'column', gap:4, paddingVertical:10, paddingHorizontal:20}}>
                                        <View style={{display:'flex', flexDirection:'row', alignItems:'center', gap:8}}>
                                            <Image
                                                source={n.type === 'assignment'? require('../../../../assets/Home/Results.png') : require('../../../../assets/Notifications/AddedFeedback.png')}
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
// Imports
import axios from 'axios';
import moment from 'moment';
import {router} from 'expo-router';
import {LinearGradient} from 'expo-linear-gradient';
import {AuthContext} from '../../../../context/Auth';
import {useContext, useEffect, useState} from 'react';
import {ActivityIndicator, Card, Icon} from 'react-native-paper';
import {ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {useNotification} from '../../../../context/NotificationProvider';





// Main functions
export default function App() {

    // User
    const {user} = useContext(AuthContext);


    // Notices count
    const {setNoticesCount} = useNotification();


    // Is loading
    const [isLoading, setIsLoading] = useState(false);


    // Notices
    const [notices, setNotices] = useState({});


    // Use effect
    useEffect(() => {
        setIsLoading(true);
        const fetcher = async () => {

            // Fetching notices
            const fetchNoticesLink = `${process.env.EXPO_PUBLIC_API_URL}/notifications/user-notices`;
            const fetchNoticesRes = await axios.post(fetchNoticesLink, {to:[user.adm_no, user?.student?.class_name]});
            setNotices(fetchNoticesRes.data);

            // Viewing notices
            const viewNoticesLink = `${process.env.EXPO_PUBLIC_API_URL}/notifications/view-notices`;
            await axios.post(viewNoticesLink, {notifications_ids:fetchNoticesRes.data.unviewed_notifications.map(d => d.id)});
            setNoticesCount(0);
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
                                    <View style={{display:'flex', flexDirection:'row', alignItems:'center', gap:8}}>
                                        {/* <Image
                                            source={n.type === 'assignment'? require('../../../../assets/Home/Results.png') : require('../../../../assets/Notifications/AddedFeedback.png')}
                                            style={{height:30, width:30}}
                                        /> */}
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
                                    <View style={{display:'flex', flexDirection:'row', alignItems:'center', gap:8}}>
                                        {/* <Image
                                            source={n.type === 'assignment'? require('../../../../assets/Home/Results.png') : require('../../../../assets/Notifications/AddedFeedback.png')}
                                            style={{height:30, width:30}}
                                        /> */}
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
                        ))}

                    </View>
                )}
            </View>

        </ScrollView>
    );
};
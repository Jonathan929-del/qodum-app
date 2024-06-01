// Imports
import axios from 'axios';
import moment from 'moment';
import {AuthContext} from '../../../../context/Auth';
import {useContext, useEffect, useState} from 'react';
import {ActivityIndicator, Card, Icon} from 'react-native-paper';
import {ScrollView, Text, TouchableOpacity, View} from 'react-native';





// Main functions
export default function App() {

    // User
    const {user} = useContext(AuthContext);


    // Selected tab
    const [selectedTab, setSelectedTab] = useState('notice');


    // Is loading
    const [isLoading, setIsLoading] = useState(false);


    // Notifications
    const [notifications, setNotifications] = useState([]);


    // Use effect
    useEffect(() => {
        setIsLoading(true);
        const fetcher = async () => {

            // Fetching notifications
            const fetchNotificationLink = `${process.env.EXPO_PUBLIC_API_URL}/notifications/user-notifications`;
            const fetchNotificationsRes = await axios.post(fetchNotificationLink, {to:[user.adm_no]});
            setNotifications(fetchNotificationsRes.data);

            // Viewing notifications
            const viewNotificationLink = `${process.env.EXPO_PUBLIC_API_URL}/notifications/view-notifications`;
            await axios.post(viewNotificationLink, {notifications_ids:fetchNotificationsRes.data.map(d => d.id)});
            setIsLoading(false);

        };
        fetcher()
    }, []);

    return (
        <ScrollView style={{flex:1, paddingTop:50}} contentContainerStyle={{alignItems:'center', gap:30, paddingBottom:10}}>

            {/* Tabs */}
            <View style={{width:'80%', display:'flex', flexDirection:'row', borderRadius:100, backgroundColor:'#F5F5F8'}}>
                <TouchableOpacity
                    onPress={() => {
                        setSelectedTab('notice');
                    }}
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
                    onPress={() => {
                        setSelectedTab('message');
                    }}
                    style={{flex:1}}
                >
                    <Text style={{paddingVertical:10, fontWeight:'800', textAlign:'center', borderRadius:100, color:selectedTab === 'message' ? '#fff' : 'gray', backgroundColor:selectedTab === 'message' ? '#3C5EAB' : '#F5F5F8'}}>Message</Text>
                </TouchableOpacity>
            </View>

            {/* Notifications */}
            <View style={{width:'80%', display:'flex', flexDirection:'column', alignItems:'center', gap:10, paddingBottom:10}}>
                {isLoading ? (
                    <ActivityIndicator />
                ) : notifications.map(n => (
                    <Card style={{width:'100%'}} key={n.id}>
                        <View style={{display:'flex', flexDirection:'column', gap:4, paddingVertical:10, paddingHorizontal:20}}>
                            <Text style={{fontSize:16, fontWeight:'600'}}>{n.title}</Text>
                            <Text style={{fontSize:14}}>{n.body}</Text>
                            <View style={{display:'flex', flexDirection:'row', alignItems:'center', marginTop:10}}>
                                <Icon source='calendar' color='#0094DA' size={20}/>
                                <Text style={{fontSize:14, color:'#0094DA', marginLeft:2}}>Date:</Text>
                                <Text style={{fontSize:14, color:'gray'}}>{moment(new Date(n.created_at._seconds * 1000 + n.created_at._nanoseconds / 1000000)).format('DD-MM-YYYY')}</Text>
                            </View>
                        </View>
                    </Card>
                ))}
            </View>

        </ScrollView>
    );
};
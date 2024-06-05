// Imports
import {useContext} from 'react';
import {router} from 'expo-router';
import {Icon} from 'react-native-paper';
import {usePathname} from 'expo-router';
import {AuthContext} from '../../context/Auth';
import {Text, TouchableOpacity, View} from 'react-native';
// import {useNotification} from '../../context/NotificationProvider';





// Main function
const Tabs = () => {


    // Pathname
    const pathname = usePathname();


    // Notifcation count
    // const {notificationsCount} = useNotification();


    // User
    const {user} = useContext(AuthContext);


    return (
        <View style={{height:'auto', width:'100%', display:'flex', flexDirection:'row', paddingHorizontal:20, paddingVertical:10, backgroundColor:'#fff'}}>

            {/* Notification */}
            <TouchableOpacity
                onPress={() => user.type === 'Teacher' ? router.push('/notifications/teacher') : router.push('/notifications/student')}
                style={{flex:1, display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', gap:2}}
            >
                <Icon
                    color={(pathname === '/notifications/teacher' || pathname === '/notifications/student') ? '#0094DA' : '#889CB7'}
                    source='bell'
                    size={30}
                />
                <Text style={{color:(pathname === '/notifications/teacher' || pathname === '/notifications/student') ? '#0094DA' : '#889CB7', fontSize:12}}>Activity</Text>
                {/* {notificationsCount !== 0 && (
                    <View style={{position:'absolute', top:0, right:10, width:20, height:20, display:'flex', alignItems:'center', justifyContent:'center', borderRadius:30, backgroundColor:'red'}}>
                        <Text style={{fontSize:11, color:'#fff'}}>{notificationsCount}</Text>
                    </View>
                )} */}
            </TouchableOpacity>


            {/* Profile */}
            <TouchableOpacity
                onPress={() => user.type === 'Teacher' ? router.push('/profile/teacher') : router.push('/profile/student')}
                style={{flex:1, display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', gap:2}}
            >
                <Icon
                    color={(pathname === '/profile/teacher' || pathname === '/profile/student') ? '#0094DA' : '#889CB7'}
                    source='account'
                    size={30}
                />
                <Text style={{color:(pathname === '/profile/teacher' || pathname === '/profile/student') ? '#0094DA' : '#889CB7', fontSize:12}}>Profile</Text>
            </TouchableOpacity>


            {/* Home */}
            <View style={{flex:1, justifyContent:'center', alignItems:'center', paddingBottom:10}}>
                <TouchableOpacity
                    onPress={() => router.push('/')}
                    style={{height:50, width:50, display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', gap:2, backgroundColor:'#0094DA', borderRadius:100}}
                >
                    <Icon
                        color='#fff'
                        source='home'
                        size={30}
                    />
                </TouchableOpacity>
            </View>


            {/* Messages */}
            <TouchableOpacity
                onPress={() => router.push('messages')}
                style={{flex:1, display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', gap:2}}
            >
                <Icon
                    color={pathname === '/messages' ? '#0094DA' : '#889CB7'}
                    source='chat-processing'
                    size={30}
                />
                <Text style={{color:pathname === '/messages' ? '#0094DA' : '#889CB7', fontSize:12}}>Messages</Text>
            </TouchableOpacity>


            {/* Settings */}
            <TouchableOpacity
                onPress={() => router.push('/settings')}
                style={{flex:1, display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', gap:2}}
            >
                <Icon
                    color={pathname === '/settings' ? '#0094DA' : '#889CB7'}
                    source='cog-outline'
                    size={30}
                />
                <Text style={{color:pathname === '/settings' ? '#0094DA' : '#889CB7', fontSize:12}}>Settings</Text>
            </TouchableOpacity>

        </View>
    );
};





// Export
export default Tabs;
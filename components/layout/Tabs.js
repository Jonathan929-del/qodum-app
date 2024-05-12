// Imports
import {router} from 'expo-router';
import {Icon} from 'react-native-paper';
import {usePathname} from 'expo-router';
import {Text, TouchableOpacity, View} from 'react-native';





// Main function
const Tabs = () => {


    // Pathname
    const pathname = usePathname();


    return (
        <View style={{height:'auto', width:'100%', display:'flex', flexDirection:'row', paddingHorizontal:20, paddingVertical:10, backgroundColor:'#fff'}}>

            {/* Profile */}
            <TouchableOpacity
                onPress={() => router.push('/profile')}
                style={{flex:1, display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', gap:2}}
            >
                <Icon
                    color={pathname === '/profile' ? '#0094DA' : '#889CB7'}
                    source='account'
                    size={30}
                />
                <Text style={{color:pathname === '/profile' ? '#0094DA' : '#889CB7', fontSize:12}}>Profile</Text>
            </TouchableOpacity>


            {/* Notification */}
            <TouchableOpacity
                onPress={() => router.push('/notification')}
                style={{flex:1, display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', gap:2}}
            >
                <Icon
                    color={pathname === '/notification' ? '#0094DA' : '#889CB7'}
                    source='bell'
                    size={30}
                />
                <Text style={{color:pathname === '/notification' ? '#0094DA' : '#889CB7', fontSize:12}}>Notification</Text>
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
// Imports
import {useContext} from 'react';
import {Icon} from 'react-native-paper';
import {AuthContext} from '../../../context/Auth';
import {Image, Text, TouchableOpacity, View} from 'react-native';





// Main function
const Topbar = () => {


    // User
    const {user} = useContext(AuthContext);


    // Day time
    const getTimeOfDay = () => {
        var hour = new Date().getHours();
        if(hour >= 5 && hour < 12){
            return 'Morning';
        }else if(hour >= 12 && hour < 18){
            return 'Afternoon';
        }else{
            return 'Evening';
        }
    };


    return (
        <View style={{width:'100%', display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'space-between', paddingHorizontal:20, paddingVertical:20, paddingTop:50, backgroundColor:'#0094DA', borderBottomStartRadius:30, borderBottomEndRadius:30}}>

            {/* Image area */}
            <View style={{display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'space-between', gap:10}}>
                {user?.student?.image ? (
                    <Image
                        width={50}
                        height={50}
                        source={{uri:user?.student?.image}}
                        style={{borderRadius:100}}
                    />
                ) : user?.image ? (
                    <Image
                        width={50}
                        height={50}
                        source={{uri:user?.image}}
                        style={{borderRadius:100}}
                    />
                ) : (
                    <View style={{width:50, height:50, display:'flex', alignItems:'center', justifyContent:'center', backgroundColor:'#fff', borderRadius:100}}>
                        <Text style={{fontSize:8}}>No Photo</Text>
                    </View>
                )}
                <View style={{display:'flex', flexDirection:'column', gap:6}}>
                    <Text style={{color:'#fff', fontSize:16, fontWeight:500}}>Good {getTimeOfDay()}!</Text>
                    <Text style={{color:'#fff', fontSize:14, fontWeight:500}}>{user.type === 'Teacher' ? user.name : user.student.name}</Text>
                    <Text style={{color:'#fff'}}>{user.type === 'Teacher' ? user.class_name : user.student.class_name}</Text>
                </View>
            </View>

            {/* Menu icon */}
            <TouchableOpacity>
                <Icon
                    source='menu'
                    color='#fff'
                    size={30}
                />
            </TouchableOpacity>

        </View>
    );
};





// Export
export default Topbar;
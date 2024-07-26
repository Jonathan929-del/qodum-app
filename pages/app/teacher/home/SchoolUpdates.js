// Imports
import {Card} from 'react-native-paper';
import {LinearGradient} from 'expo-linear-gradient';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {useNotification} from '../../../../context/NotificationProvider';





// Main function
const SchoolUpdates = ({navigation}) => {

    // Class notices count
    const {noticesCount} = useNotification();

    return (
        <View style={{width:'100%', display:'flex', flexDirection:'column', gap:10, paddingHorizontal:20}}>

            {/* Title */}
            <View style={{display:'flex', flexDirection:'row', alignItems:'center', gap:10}}>
                <Text style={{fontSize:14, fontWeight:'700', color:'gray'}}>SCHOOL UPDATES</Text>
                <LinearGradient
                    colors={['#000', '#fff']}
                    start={{x:0, y:0}}
                    end={{x:1, y:0}}
                    style={{flex:1, opacity:0.7, height:1}}
                />
            </View>


            {/* Boxes */}
            <View style={{width:'100%', display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:15}}>

                {/* Notice */}
                <View style={{width:'21%', height:100, alignItems:'center', gap:5}}>
                    <Card style={{width:'100%', height:80, borderRadius:20}}>
                        <TouchableOpacity
                            onPress={() => navigation.navigate('teacher-notices')}
                            style={{height:'100%', width:'100%', alignItems:'center', justifyContent:'center'}}
                        >
                            <Image
                                style={{width:'70%', height:'70%'}}
                                source={require('../../../../assets/Home/Notice.png')}
                            />
                        </TouchableOpacity>
                        {noticesCount !== 0 && (
                            <View style={{position:'absolute', top:0, right:0, width:22, height:22, display:'flex', alignItems:'center', justifyContent:'center', borderRadius:30, backgroundColor:'red'}}>
                                <Text style={{fontSize:12, color:'#fff'}}>{noticesCount}</Text>
                            </View>
                        )}
                    </Card>
                    <Text style={{color:'gray', fontSize:11}}>Notice</Text>
                </View>


                {/* Class Notice */}
                <View style={{width:'21%', height:100, alignItems:'center', gap:5}}>
                    <Card style={{width:'100%', height:80, borderRadius:20}}>
                        <TouchableOpacity
                            onPress={() => navigation.navigate('teacher-class-notice')}
                            style={{height:'100%', width:'100%', alignItems:'center', justifyContent:'center'}}
                        >
                            <Image
                                style={{width:'70%', height:'70%'}}
                                source={require('../../../../assets/Home/ClassNotice.png')}
                            />
                        </TouchableOpacity>
                    </Card>
                    <Text style={{color:'gray', fontSize:11}}>Class Notice</Text>
                </View>


                {/* Events */}
                <View style={{width:'21%', height:100, alignItems:'center', gap:5}}>
                    <Card style={{width:'100%', height:80, borderRadius:20}}>
                        <TouchableOpacity style={{height:'100%', width:'100%', alignItems:'center', justifyContent:'center'}}>
                            <Image
                                style={{width:'70%', height:'70%'}}
                                source={require('../../../../assets/Home/Events.png')}
                            />
                        </TouchableOpacity>
                    </Card>
                    <Text style={{color:'gray', fontSize:11}}>Events</Text>
                </View>


                {/* Academic Survey */}
                <View style={{width:'21%', height:100, alignItems:'center', gap:5}}>
                    <Card style={{width:'100%', height:80, borderRadius:20}}>
                        <TouchableOpacity style={{height:'100%', width:'100%', alignItems:'center', justifyContent:'center'}}>
                            <Image
                                style={{width:'70%', height:'70%'}}
                                source={require('../../../../assets/Home/AcademicSurvey.png')}
                            />
                        </TouchableOpacity>
                    </Card>
                    <Text style={{color:'gray', fontSize:11, textAlign:'center'}}>Academic Survey</Text>
                </View>

            </View>
        </View>
    );
};





// Export
export default SchoolUpdates;
// Imports
import {Card} from 'react-native-paper';
import {LinearGradient} from 'expo-linear-gradient';
import {Image, Text, TouchableOpacity, View} from 'react-native';





// Main function
const Transport = () => {
    return (
        <View style={{width:'100%', display:'flex', flexDirection:'column', gap:8, paddingHorizontal:20}}>

            {/* Title */}
            <View style={{display:'flex', flexDirection:'row', alignItems:'center', gap:10}}>
                <Text style={{fontSize:14, fontWeight:'700', color:'gray'}}>TRANSPORT</Text>
                <LinearGradient
                    colors={['#000', '#fff']}
                    start={{x:0, y:0}}
                    end={{x:1, y:0}}
                    style={{flex:1, opacity:0.7, height:1}}
                />
            </View>


            {/* Boxes */}
            <View style={{width:'100%', display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:15}}>

                {/* Vehicle Route */}
                <View style={{width:'21%', height:100, alignItems:'center', gap:5}}>
                    <Card style={{width:'100%', height:80, borderRadius:20}}>
                        <TouchableOpacity style={{height:'100%', width:'100%', alignItems:'center', justifyContent:'center'}}>
                            <Image
                                style={{width:'70%', height:'70%'}}
                                source={require('../../../../assets/Home/Route.png')}
                            />
                        </TouchableOpacity>
                    </Card>
                    <Text style={{color:'gray', fontSize:11, textAlign:'center'}}>Vehicle Route</Text>
                </View>


                {/* Track Vehicle */}
                <View style={{width:'21%', height:100, alignItems:'center', gap:5}}>
                    <Card style={{width:'100%', height:80, borderRadius:20}}>
                        <TouchableOpacity style={{height:'100%', width:'100%', alignItems:'center', justifyContent:'center'}}>
                            <Image
                                style={{width:'70%', height:'70%'}}
                                source={require('../../../../assets/Home/TrackVehicle.png')}
                            />
                        </TouchableOpacity>
                    </Card>
                    <Text style={{color:'gray', fontSize:11}}>Track Vehicle</Text>
                </View>


                {/* Stoppage Timing */}
                <View style={{width:'21%', height:100, alignItems:'center', gap:5}}>
                    <Card style={{width:'100%', height:80, borderRadius:20}}>
                        <TouchableOpacity style={{height:'100%', width:'100%', alignItems:'center', justifyContent:'center'}}>
                            <Image
                                style={{width:'70%', height:'70%'}}
                                source={require('../../../../assets/Home/ContactNo.png')}
                            />
                        </TouchableOpacity>
                    </Card>
                    <Text style={{color:'gray', fontSize:11, textAlign:'center'}}>Stoppage Timing</Text>
                </View>


                {/* Emergency Contact */}
                <View style={{width:'21%', height:100, alignItems:'center', gap:5}}>
                    <Card style={{width:'100%', height:80, borderRadius:20}}>
                        <TouchableOpacity style={{height:'100%', width:'100%', alignItems:'center', justifyContent:'center'}}>
                            <Image
                                style={{width:'70%', height:'70%'}}
                                source={require('../../../../assets/Home/EmergencyContact.png')}
                            />
                        </TouchableOpacity>
                    </Card>
                    <Text style={{color:'gray', fontSize:11, textAlign:'center'}}>Emergency Contact</Text>
                </View>

            </View>
        </View>
    );
};





// Export
export default Transport;
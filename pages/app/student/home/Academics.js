// Imports
// import {router} from 'expo-router';
import {Card} from 'react-native-paper';
import {LinearGradient} from 'expo-linear-gradient';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {useNotification} from '../../../../context/NotificationProvider';





// Main function
const Academics = ({navigation}) => {

    // Class notices count
    const {ediariesCount} = useNotification();

    return (
        <View style={{width:'100%', display:'flex', flexDirection:'column', gap:10, paddingHorizontal:20}}>

            {/* Title */}
            <View style={{display:'flex', flexDirection:'row', alignItems:'center', gap:10}}>
                <Text style={{fontSize:14, fontWeight:'700', color:'gray', fontSize:12}}>ACADEMICS</Text>
                <LinearGradient
                    colors={['#000', '#fff']}
                    start={{x:0, y:0}}
                    end={{x:1, y:0}}
                    style={{flex:1, opacity:0.7, height:1}}
                />
            </View>


            {/* Boxes */}
            <View style={{width:'100%', display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:15}}>

                {/* Assignments */}
                <View style={{width:'21%', alignItems:'center', gap:5}}>
                    <Card style={{width:'100%', height:80, borderRadius:20}}>
                        <TouchableOpacity
                            onPress={() => navigation.navigate('student-assignments')}
                            style={{height:'100%', width:'100%', alignItems:'center', justifyContent:'center'}}
                        >
                            <Image
                                style={{width:'70%', height:'70%'}}
                                source={require('../../../../assets/Home/Assignments.png')}
                            />
                        </TouchableOpacity>
                    </Card>
                    <Text style={{color:'gray', fontSize:11}}>Assignments</Text>
                </View>


                {/* Syllabus */}
                <View style={{width:'21%', alignItems:'center', gap:5}}>
                    <Card style={{width:'100%', height:80, borderRadius:20}}>
                        <TouchableOpacity style={{height:'100%', width:'100%', alignItems:'center', justifyContent:'center'}}>
                            <Image
                                style={{width:'70%', height:'70%'}}
                                source={require('../../../../assets/Home/Syllabus.png')}
                            />
                        </TouchableOpacity>
                    </Card>
                    <Text style={{color:'gray', fontSize:11}}>Syllabus</Text>
                </View>


                {/* Lesson Plan */}
                <View style={{width:'21%', alignItems:'center', gap:5}}>
                    <Card style={{width:'100%', height:80, borderRadius:20}}>
                        <TouchableOpacity style={{height:'100%', width:'100%', alignItems:'center', justifyContent:'center'}}>
                            <Image
                                style={{width:'70%', height:'70%'}}
                                source={require('../../../../assets/Home/LessonPlan.png')}
                            />
                        </TouchableOpacity>
                    </Card>
                    <Text style={{color:'gray', fontSize:11}}>Lesson Plan</Text>
                </View>


                {/* e-diary */}
                <View style={{width:'21%', alignItems:'center', gap:5}}>
                    <Card style={{width:'100%', height:80, borderRadius:20}}>
                        <TouchableOpacity
                            onPress={() => navigation.navigate('student-ediaries')}
                            style={{height:'100%', width:'100%', alignItems:'center', justifyContent:'center'}}
                        >
                            <Image
                                style={{width:'70%', height:'70%'}}
                                source={require('../../../../assets/Home/ediary.png')}
                            />
                        </TouchableOpacity>
                        {ediariesCount !== 0 && (
                            <View style={{position:'absolute', top:0, right:0, width:22, height:22, display:'flex', alignItems:'center', justifyContent:'center', borderRadius:30, backgroundColor:'red'}}>
                                <Text style={{fontSize:12, color:'#fff'}}>{ediariesCount}</Text>
                            </View>
                        )}
                    </Card>
                    <Text style={{color:'gray', fontSize:11}}>e-diary</Text>
                </View>


                {/* Time Table */}
                <View style={{width:'21%', alignItems:'center', gap:5}}>
                    <Card style={{width:'100%', height:80, borderRadius:20}}>
                        <TouchableOpacity style={{height:'100%', width:'100%', alignItems:'center', justifyContent:'center'}}>
                            <Image
                                style={{width:'70%', height:'70%'}}
                                source={require('../../../../assets/Home/TimeTable.png')}
                            />
                        </TouchableOpacity>
                    </Card>
                    <Text style={{color:'gray', fontSize:11}}>Time Table</Text>
                </View>


                {/* Attendance */}
                <View style={{width:'21%', alignItems:'center', gap:5}}>
                    <Card style={{width:'100%', height:80, borderRadius:20}}>
                        <TouchableOpacity style={{height:'100%', width:'100%', alignItems:'center', justifyContent:'center'}}>
                            <Image
                                style={{width:'70%', height:'70%'}}
                                source={require('../../../../assets/Home/Attendance.png')}
                            />
                        </TouchableOpacity>
                    </Card>
                    <Text style={{color:'gray', fontSize:11}}>Attendance</Text>
                </View>


                {/* Results */}
                <View style={{width:'21%', alignItems:'center', gap:5}}>
                    <Card style={{width:'100%', height:80, borderRadius:20}}>
                        <TouchableOpacity style={{height:'100%', width:'100%', alignItems:'center', justifyContent:'center'}}>
                            <Image
                                style={{width:'70%', height:'70%'}}
                                source={require('../../../../assets/Home/Results.png')}
                            />
                        </TouchableOpacity>
                    </Card>
                    <Text style={{color:'gray', fontSize:11}}>Results</Text>
                </View>

                {/* Online Class */}
                <View style={{width:'21%', height:100, alignItems:'center', gap:5}}>
                    <Card style={{width:'100%', height:80, borderRadius:20}}>
                        <TouchableOpacity style={{height:'100%', width:'100%', alignItems:'center', justifyContent:'center'}}>
                            <Image
                                style={{width:'70%', height:'70%'}}
                                source={require('../../../../assets/Home/OnlineClasses.png')}
                            />
                        </TouchableOpacity>
                    </Card>
                    <Text style={{color:'gray', fontSize:11, textAlign:'center'}}>Online Class</Text>
                </View>

            </View>
        </View>
    );
};





// Export
export default Academics;
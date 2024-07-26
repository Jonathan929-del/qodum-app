// Imports
import React from 'react';
import {Card} from 'react-native-paper';
import {LinearGradient} from 'expo-linear-gradient';
import {Image, Text, TouchableOpacity, View} from 'react-native';





// Main function
const Communication = () => {
    return (
        <View style={{width:'100%', display:'flex', flexDirection:'column', gap:8, paddingHorizontal:20}}>

            {/* Title */}
            <View style={{display:'flex', flexDirection:'row', alignItems:'center', gap:10}}>
                <Text style={{fontSize:14, fontWeight:'700', color:'gray'}}>COMMUNICATION</Text>
                <LinearGradient
                    colors={['#000', '#fff']}
                    start={{x:0, y:0}}
                    end={{x:1, y:0}}
                    style={{flex:1, opacity:0.7, height:1}}
                />
            </View>


            {/* Boxes */}
            <View style={{width:'100%', display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:15}}>

                {/* Messages */}
                <View style={{width:'21%', height:120, alignItems:'center', gap:5}}>
                    <Card style={{width:'100%', height:80, borderRadius:20}}>
                        <TouchableOpacity style={{height:'100%', width:'100%', alignItems:'center', justifyContent:'center'}}>
                            <Image
                                style={{width:'70%', height:'70%'}}
                                source={require('../../../../assets/Home/Messages.png')}
                            />
                        </TouchableOpacity>
                    </Card>
                    <Text style={{color:'gray', fontSize:11}}>Message</Text>
                </View>


                {/* Point Of Contact */}
                <View style={{width:'21%', height:120, alignItems:'center', gap:5}}>
                    <Card style={{width:'100%', height:80, borderRadius:20}}>
                        <TouchableOpacity style={{height:'100%', width:'100%', alignItems:'center', justifyContent:'center'}}>
                            <Image
                                style={{width:'70%', height:'70%'}}
                                source={require('../../../../assets/Home/PointOfContact.png')}
                            />
                        </TouchableOpacity>
                    </Card>
                    <Text style={{color:'gray', fontSize:11, textAlign:'center'}}>Point of Contact</Text>
                </View>


                {/* Feedback And Complaints */}
                <View style={{width:'21%', height:120, alignItems:'center', gap:5}}>
                    <Card style={{width:'100%', height:80, borderRadius:20}}>
                        <TouchableOpacity style={{height:'100%', width:'100%', alignItems:'center', justifyContent:'center'}}>
                            <Image
                                style={{width:'70%', height:'70%'}}
                                source={require('../../../../assets/Home/FeedbackAndComplaints.png')}
                            />
                        </TouchableOpacity>
                    </Card>
                    <Text style={{color:'gray', fontSize:11, textAlign:'center'}}>Feedback & Complaints</Text>
                </View>


                {/* Meet the Management */}
                <View style={{width:'21%', height:120, alignItems:'center', gap:5}}>
                    <Card style={{width:'100%', height:80, borderRadius:20}}>
                        <TouchableOpacity style={{height:'100%', width:'100%', alignItems:'center', justifyContent:'center'}}>
                            <Image
                                style={{width:'70%', height:'70%'}}
                                source={require('../../../../assets/Home/MeetTheManagement.png')}
                            />
                        </TouchableOpacity>
                    </Card>
                    <Text style={{color:'gray', fontSize:11, textAlign:'center'}}>Meet the Management</Text>
                </View>

            </View>
        </View>
    );
};





// Export
export default Communication;
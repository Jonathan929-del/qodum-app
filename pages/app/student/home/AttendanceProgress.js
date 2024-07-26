// Imports
import React from 'react';
import {Card, ProgressBar} from 'react-native-paper';
import {Image, Text, TouchableOpacity, View} from 'react-native';





// Main function
const AttendanceProgress = ({navigation}) => {
    return (
        <View style={{width:'90%', display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'center', gap:10}}>


            <View style={{flex:1, position:'relative', display:'flex', flexDirection:'column', gap:10, paddingHorizontal:20, paddingVertical:20, borderRadius:10, backgroundColor:'#DFEEF6'}}>
                {/* Attendance */}
                <View style={{display:'flex', flexDirection:'column', gap:8}}>
                    <View style={{display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
                        <Text style={{fontWeight:'600', fontSize:14}}>Attendance</Text>
                        <Text style={{color:'gray'}}>88</Text>
                    </View>
                    <ProgressBar
                        progress={0.89}
                        color='#0094DA'
                        style={{height:7, borderRadius:10, backgroundColor:'#fff'}}
                    />
                </View>


                {/* Fee */}
                <View style={{display:'flex', flexDirection:'column', gap:8}}>
                    <View style={{display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
                        <Text style={{fontWeight:'600', fontSize:14}}>Fee</Text>
                        <Text style={{color:'gray'}}>70</Text>
                    </View>
                    <ProgressBar
                        progress={0.7}
                        color='#0094DA'
                        style={{height:7, borderRadius:10, backgroundColor:'#fff'}}
                    />
                </View>
            </View>

            {/* Fees */}
            <View style={{width:100, height:100, alignItems:'center', gap:5}}>
                <Card style={{width:'100%', borderRadius:20}}>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('student-fee')}
                        style={{height:'100%', width:'100%', alignItems:'center', justifyContent:'center'}}
                    >
                        <Image
                            style={{width:'70%', height:'70%'}}
                            source={require('../../../../assets/Home/Fee.png')}
                        />
                    </TouchableOpacity>
                </Card>
                <Text style={{color:'gray', fontSize:14}}>Fee</Text>
            </View>
        </View>
    );
};





// Export
export default AttendanceProgress;
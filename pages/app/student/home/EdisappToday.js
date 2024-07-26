// Imports
import {Card} from 'react-native-paper';
import {LinearGradient} from 'expo-linear-gradient';
import {Image, Text, TouchableOpacity, View} from 'react-native';





// Main function
const EdisappToday = () => {
    return (
        <View style={{width:'100%', display:'flex', flexDirection:'column', gap:8, paddingHorizontal:20}}>

            {/* Title */}
            <View style={{display:'flex', flexDirection:'row', alignItems:'center', gap:10}}>
                <Text style={{fontSize:14, fontWeight:'700', color:'gray'}}>EDISAPP TODAY</Text>
                <LinearGradient
                    colors={['#000', '#fff']}
                    start={{x:0, y:0}}
                    end={{x:1, y:0}}
                    style={{flex:1, opacity:0.7, height:1}}
                />
            </View>


            {/* Boxes */}
            <View style={{width:'100%', display:'flex', flexDirection:'row', alignItems:'center', flexWrap:'wrap', gap:15}}>

                {/* Education News */}
                <View style={{width:'21%', height:120, alignItems:'center', gap:5}}>
                    <Card style={{width:'100%', height:80, borderRadius:20}}>
                        <TouchableOpacity style={{height:'100%', width:'100%', alignItems:'center', justifyContent:'center'}}>
                            <Image
                                style={{width:'70%', height:'70%'}}
                                source={require('../../../../assets/Home/EducationNews.png')}
                            />
                        </TouchableOpacity>
                    </Card>
                    <Text style={{color:'gray', fontSize:11, textAlign:'center'}}>Education News</Text>
                </View>


                {/* Quote */}
                <View style={{width:'21%', height:120, alignItems:'center', gap:5}}>
                    <Card style={{width:'100%', height:80, borderRadius:20}}>
                        <TouchableOpacity style={{height:'100%', width:'100%', alignItems:'center', justifyContent:'center'}}>
                            <Image
                                style={{width:'70%', height:'70%'}}
                                source={require('../../../../assets/Home/Quote.png')}
                            />
                        </TouchableOpacity>
                    </Card>
                    <Text style={{color:'gray', fontSize:11}}>Quote</Text>
                </View>


                {/* Thought */}
                <View style={{width:'21%', height:120, alignItems:'center', gap:5}}>
                    <Card style={{width:'100%', height:80, borderRadius:20}}>
                        <TouchableOpacity style={{height:'100%', width:'100%', alignItems:'center', justifyContent:'center'}}>
                            <Image
                                style={{width:'70%', height:'70%'}}
                                source={require('../../../../assets/Home/Thought.png')}
                            />
                        </TouchableOpacity>
                    </Card>
                    <Text style={{color:'gray', fontSize:11}}>Thought</Text>
                </View>


                {/* City */}
                <View style={{width:'21%', height:120, alignItems:'center', gap:5}}>
                    <Card style={{width:'100%', height:80, borderRadius:20}}>
                        <TouchableOpacity style={{height:'100%', width:'100%', alignItems:'center', justifyContent:'center'}}>
                            <Image
                                style={{width:'70%', height:'70%'}}
                                source={require('../../../../assets/Home/City.png')}
                            />
                        </TouchableOpacity>
                    </Card>
                    <Text style={{color:'gray', fontSize:11}}>City</Text>
                </View>


                {/* Word */}
                <View style={{width:'21%', height:120, alignItems:'center', gap:5}}>
                    <Card style={{width:'100%', height:80, borderRadius:20}}>
                        <TouchableOpacity style={{height:'100%', width:'100%', alignItems:'center', justifyContent:'center'}}>
                            <Image
                                style={{width:'70%', height:'70%'}}
                                source={require('../../../../assets/Home/Word.png')}
                            />
                        </TouchableOpacity>
                    </Card>
                    <Text style={{color:'gray', fontSize:11}}>Word</Text>
                </View>

            </View>
        </View>
    );
};





// Export
export default EdisappToday;
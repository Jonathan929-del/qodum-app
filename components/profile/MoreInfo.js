// Imports
import {Icon} from 'react-native-paper';
import {AuthContext} from '../../context/Auth';
import {useContext, useState, useEffect} from 'react';
import {Text, TouchableOpacity, View, Animated, TouchableWithoutFeedback, Dimensions} from 'react-native';





// Main function
const MoreInfo = ({isInfoOpened, setIsInfoOpened}) => {


    // Context
    const context = useContext(AuthContext);


    // Fade animation
    const [fadeAnim] = useState(new Animated.Value(0));


    // Use effect
    useEffect(() => {
        if (isInfoOpened) {
        Animated.timing(fadeAnim, {
            toValue:1,
            duration:200,
            useNativeDriver:true
        }).start();
        }else{
        Animated.timing(fadeAnim, {
            toValue:0,
            duration:200,
            useNativeDriver:true
        }).start();
        }
    }, [isInfoOpened]);


    return (
        <Animated.View
            style={{position:'absolute', width:'100%', height:Dimensions.get('screen').height, zIndex:10, backgroundColor:'rgba(0, 0, 0, 0.5)', opacity:fadeAnim}}
        >
            <TouchableWithoutFeedback
            onPress={() => setIsInfoOpened(false)}
            >
            <View style={{height:'100%', width:'100%', alignItems:'center', justifyContent:'center'}}>
                <Text>-</Text>
                <TouchableWithoutFeedback onPress={() => setIsInfoOpened(true)}>
                <View
                    style={{width:'80%', height:200, borderRadius:10, backgroundColor:'#fff'}}
                >

                    {/* Header */}
                    <View style={{display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'space-between', paddingVertical:15, paddingHorizontal:20, backgroundColor:'#0094DA', borderTopLeftRadius:10, borderTopRightRadius:10}}>
                    <Text style={{color:'#fff', fontSize:16}}>More Information</Text>
                    <TouchableOpacity onPress={() => setIsInfoOpened(false)}>
                        <Icon source='close' color='#fff' size={20}/>
                    </TouchableOpacity>
                    </View>

                    {/* Buttons */}
                    <View style={{flex:1}}>

                    {/* Switch Account */}
                    <TouchableOpacity style={{flex:1, display:'flex', flexDirection:'row', alignItems:'center', gap:10, paddingHorizontal:10, backgroundColor:'#fff', borderBottomWidth:0.75, borderBottomColor:'#ccc'}}>
                        <Icon source='account-convert-outline' color='#8A8A8A' size={20}/>
                        <Text style={{color:'#8A8A8A'}}>Switch Account</Text>
                    </TouchableOpacity>


                    {/* Add Another Account */}
                    <TouchableOpacity style={{flex:1, display:'flex', flexDirection:'row', alignItems:'center', gap:10, paddingHorizontal:10, backgroundColor:'#fff', borderBottomWidth:0.75, borderBottomColor:'#ccc'}}>
                        <Icon source='plus-circle' color='#8A8A8A' size={20}/>
                        <Text style={{color:'#8A8A8A'}}>Add Another Account</Text>
                    </TouchableOpacity>


                    {/* Logout */}
                    <TouchableOpacity
                        onPress={context.logout}
                        style={{flex:1, display:'flex', flexDirection:'row', alignItems:'center', gap:10, paddingHorizontal:10, backgroundColor:'#fff', borderBottomLeftRadius:10, borderBottomRightRadius:10}}
                    >
                        <Icon source='logout' color='#8A8A8A' size={20}/>
                        <Text style={{color:'#8A8A8A'}}>Logout</Text>
                    </TouchableOpacity>

                    </View>

                </View>
                </TouchableWithoutFeedback>
            </View>
            </TouchableWithoutFeedback>
        </Animated.View>
    );
};





// Export
export default MoreInfo;
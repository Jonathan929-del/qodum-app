// Imports
import {useState, useEffect} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import {Text, TouchableOpacity, View, Animated, TouchableWithoutFeedback, Dimensions} from 'react-native';





// Main function
const MoreInfo = ({isInfoOpened, setIsInfoOpened}) => {


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
                    style={{width:'80%', height:150, borderRadius:10, backgroundColor:'#fff'}}
                >

                    {/* Header */}
                    <View style={{display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'space-between', paddingVertical:15, paddingHorizontal:20, backgroundColor:'#0094DA', borderTopLeftRadius:10, borderTopRightRadius:10}}>
                        <Text style={{color:'#fff', fontSize:16}}>More Information</Text>
                        <TouchableOpacity onPress={() => setIsInfoOpened(false)}>
                            <Icon name='close' color='#fff' size={20}/>
                        </TouchableOpacity>
                    </View>

                    <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
                        <Text style={{fontWeight:'700'}}>Submitted (0/24) : Offline(22) - Online(2)</Text>
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
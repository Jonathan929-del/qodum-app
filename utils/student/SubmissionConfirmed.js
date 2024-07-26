// Imports
import {useState, useEffect} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import {Text, TouchableOpacity, View, Animated, TouchableWithoutFeedback, Dimensions, Image} from 'react-native';





// Main function
const SubmissionConfirmed = ({isSubmissionConfirmed, setIsSubmissionConfirmed}) => {


    // Fade animation
    const [fadeAnim] = useState(new Animated.Value(0));


    // Use effect
    useEffect(() => {
        if (isSubmissionConfirmed) {
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
    }, [isSubmissionConfirmed]);


    return (
        <Animated.View
            style={{position:'absolute', width:'100%', height:Dimensions.get('screen').height, zIndex:10, backgroundColor:'rgba(0, 0, 0, 0.5)', opacity:fadeAnim}}
        >
            <TouchableWithoutFeedback
                onPress={() => setIsSubmissionConfirmed(false)}
            >
            <View style={{height:'100%', width:'100%', alignItems:'center', justifyContent:'center'}}>
                <Text>-</Text>
                <TouchableWithoutFeedback onPress={() => setIsSubmissionConfirmed(true)}>
                    <View
                        style={{width:'80%', height:370, borderRadius:10, backgroundColor:'#fff'}}
                    >

                        {/* Header */}
                        <View style={{display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'space-between', paddingVertical:15, paddingHorizontal:20, backgroundColor:'#0094DA', borderTopLeftRadius:10, borderTopRightRadius:10}}>
                            <Text style={{color:'#fff', fontSize:16}}>Assignment Submitted!</Text>
                            <TouchableOpacity onPress={() => setIsSubmissionConfirmed(false)}>
                                <Icon name='close-outline' color='#fff' size={20}/>
                            </TouchableOpacity>
                        </View>

                        <View style={{flex:1, alignItems:'center', justifyContent:'center', gap:20}}>
                            <Image
                                style={{width:170, height:150}}
                                source={require('../../assets/Assignments/SubmissionConfirmed.png')}
                            />
                            <Text style={{fontWeight:'700', textAlign:'center', paddingHorizontal:10}}>Your assignment has been received! Await feedback from your instructor, and be sure to address any comments or suggestions provided.</Text>
                        </View>

                    

                    </View>
                </TouchableWithoutFeedback>
            </View>
            </TouchableWithoutFeedback>
        </Animated.View>
    );
};





// Export
export default SubmissionConfirmed;
// Imports
import {useState, useEffect} from 'react';
import {Button} from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import {Text, TouchableOpacity, View, Animated, TouchableWithoutFeedback, Dimensions, Image} from 'react-native';





// Main function
const SubmissionConfirmation = ({isSubmissionConfirmation, setIsSubmissionConfirmation, setIsSubmissionConfirmed}) => {


    // Fade animation
    const [fadeAnim] = useState(new Animated.Value(0));


    // Use effect
    useEffect(() => {
        if (isSubmissionConfirmation) {
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
    }, [isSubmissionConfirmation]);


    return (
        <Animated.View
            style={{position:'absolute', width:'100%', height:Dimensions.get('screen').height, zIndex:10, backgroundColor:'rgba(0, 0, 0, 0.5)', opacity:fadeAnim}}
        >
            <TouchableWithoutFeedback
                onPress={() => setIsSubmissionConfirmation(false)}
            >
            <View style={{height:'100%', width:'100%', alignItems:'center', justifyContent:'center'}}>
                <Text>-</Text>
                <TouchableWithoutFeedback onPress={() => setIsSubmissionConfirmation(true)}>
                    <View
                        style={{width:'80%', height:370, borderRadius:10, backgroundColor:'#fff'}}
                    >

                        {/* Header */}
                        <View style={{display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'space-between', paddingVertical:15, paddingHorizontal:20, backgroundColor:'#0094DA', borderTopLeftRadius:10, borderTopRightRadius:10}}>
                            <Text style={{color:'#fff', fontSize:16}}>Warning!</Text>
                            <TouchableOpacity onPress={() => setIsSubmissionConfirmation(false)}>
                                <Icon name='close-outline' color='#fff' size={20}/>
                            </TouchableOpacity>
                        </View>

                        <View style={{flex:1, alignItems:'center', justifyContent:'center', gap:20}}>
                            <Image
                                style={{width:170, height:150}}
                                source={require('../../assets/Assignments/SubmissionConfirmation.png')}
                            />
                            <Text style={{fontWeight:'700', textAlign:'center', paddingHorizontal:10}}>Are you sure you want to submit this assignment?</Text>
                            <View style={{width:'90%', display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'center', gap:20}}>
                                <Button
                                    mode='outlined'
                                    textColor='gray'
                                    style={{flex:1, borderColor:'gray', borderRadius:4}}
                                    onPress={() => {setIsSubmissionConfirmation(false);setIsSubmissionConfirmed(false)}}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    mode='outlined'
                                    style={{flex:1, borderColor:'#0094DA', borderRadius:4}}
                                    onPress={() => {setIsSubmissionConfirmation(false);setIsSubmissionConfirmed(true)}}
                                >
                                    Submit
                                </Button>
                            </View>
                        </View>

                    

                    </View>
                </TouchableWithoutFeedback>
            </View>
            </TouchableWithoutFeedback>
        </Animated.View>
    );
};





// Export
export default SubmissionConfirmation;
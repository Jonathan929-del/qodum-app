// Imports
import {Icon} from 'react-native-paper';
import {useState, useEffect} from 'react';
import {Text, TouchableOpacity, View, Animated, TouchableWithoutFeedback, Dimensions, Image} from 'react-native';





// Main function
const PassedAssignmentDate = ({isSubmitDatePassed, setIsSubmitDatePassed, pastDate}) => {


    // Fade animation
    const [fadeAnim] = useState(new Animated.Value(0));


    // Use effect
    useEffect(() => {
        if (isSubmitDatePassed) {
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
    }, [isSubmitDatePassed]);


    return (
        <Animated.View
            style={{position:'absolute', width:'100%', height:Dimensions.get('screen').height, zIndex:10, backgroundColor:'rgba(0, 0, 0, 0.5)', opacity:fadeAnim}}
        >
            <TouchableWithoutFeedback
                onPress={() => setIsSubmitDatePassed('')}
            >
            <View style={{height:'100%', width:'100%', alignItems:'center', justifyContent:'center'}}>
                <Text>-</Text>
                <TouchableWithoutFeedback onPress={() => setIsSubmitDatePassed(isSubmitDatePassed)}>
                <View
                    style={{width:'80%', height:300, borderRadius:10, backgroundColor:'#fff'}}
                >

                    {/* Header */}
                    <View style={{display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'space-between', paddingVertical:15, paddingHorizontal:20, backgroundColor:'#0094DA', borderTopLeftRadius:10, borderTopRightRadius:10}}>
                        <Text style={{color:'#fff', fontSize:16}}>Sorry</Text>
                        <TouchableOpacity onPress={() => setIsSubmitDatePassed('')}>
                            <Icon source='close' color='#fff' size={20}/>
                        </TouchableOpacity>
                    </View>

                    <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
                        <Image
                            style={{width:170, height:150}}
                            source={require('../../assets/Assignments/SubmissionDate.png')}
                        />
                        <Text style={{fontWeight:'700', textAlign:'center', paddingHorizontal:30}}>Sorry, last date for submission was {pastDate}</Text>
                    </View>

                

                </View>
                </TouchableWithoutFeedback>
            </View>
            </TouchableWithoutFeedback>
        </Animated.View>
    );
};





// Export
export default PassedAssignmentDate;
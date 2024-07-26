// Imports
import Icon from 'react-native-vector-icons/Ionicons';
import {Text, TouchableOpacity, View} from 'react-native';





// Main function
const CreateAssignment = ({navigation, route}) => {

    // Link params
    const {assignment, answer} = route.params;

    return (
        <View style={{height:'100%', alignItems:'center'}}>
            <View style={{width:'100%', display:'flex', flexDirection:'row', alignItems:'flex-end', justifyContent:'space-between', paddingHorizontal:10, paddingVertical:30, backgroundColor:'#0094DA', borderBottomRightRadius:40, borderBottomLeftRadius:40}}>
                <View style={{display:'flex', flexDirection:'row', alignItems:'center', gap:20}}>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('student-assignment-view', {assignment})}
                    >
                        <Icon name='arrow-back-outline' size={35} color='#fff'/>
                    </TouchableOpacity>
                    <Text style={{textAlign:'center', fontSize:18, color:'#fff', fontWeight:'900'}}>Feedback</Text>
                </View>
            </View>


            {/* View attachment */}
            <View style={{width:'90%', flex:1, display:'flex', flexDirection:'column', alignItems:'center', paddingTop:30, gap:30}}>
                <View style={{width:'90%', display:'flex', flexDirection:'column', gap:8}}>
                    <Text style={{fontSize:18, fontWeight:'700'}}>Grade:</Text>
                    <Text style={{fontSize:16, color:'gray'}}>{answer?.feedback?.grade}</Text>
                </View>
                <View style={{width:'90%', display:'flex', flexDirection:'column', gap:4}}>
                    <Text style={{fontSize:18, fontWeight:'700'}}>Feedback:</Text>
                    <Text style={{minHeight:150, fontSize:16, color:'gray'}}>{answer?.feedback?.feedback}</Text>
                </View>
            </View>

        </View>
    );
};





// Export
export default CreateAssignment;
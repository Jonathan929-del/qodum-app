// Imports
import {Icon, Button} from 'react-native-paper';
import {router, useLocalSearchParams} from 'expo-router';
import {Linking, Text, TouchableOpacity, View} from 'react-native';





// Main functions
const App = () => {

    // Assignment and submitted answer
    const {submitted_assignment, assignment} = useLocalSearchParams();

    return (
        <View style={{height:'100%'}}>
            <View style={{width:'100%', height:120, display:'flex', flexDirection:'row', alignItems:'flex-end', justifyContent:'space-between', paddingHorizontal:10, paddingBottom:30, backgroundColor:'#0094DA', borderBottomRightRadius:40, borderBottomLeftRadius:40}}>
                <View style={{display:'flex', flexDirection:'row', alignItems:'center', gap:20}}>
                    <TouchableOpacity
                        onPress={() => router.push({pathname:'/assignments/student/view', params:JSON.parse(assignment)})}
                    >
                        <Icon source='chevron-left' size={40} color='#fff'/>
                    </TouchableOpacity>
                    <Text style={{textAlign:'center', fontSize:18, color:'#fff', fontWeight:'900'}}>Attachment</Text>
                </View>
            </View>

            {/* View attachment */}
            <View style={{flex:1, display:'flex', flexDirection:'column', alignItems:'center', paddingTop:30, gap:30}}>
                <View style={{width:'90%', display:'flex', flexDirection:'column', gap:4}}>
                    <Text style={{fontSize:18, fontWeight:'700'}}>Your Answer:</Text>
                    <Text style={{fontSize:16}}>{JSON.parse(submitted_assignment).answer}</Text>
                </View>

                <Button
                    mode='contained'
                    onPress={() => Linking.openURL(JSON.parse(submitted_assignment).attachment)}
                    style={{borderRadius:4, width:'90%'}}
                >
                    View Attachment
                </Button>
            </View>

        </View>
    );
};





// Export
export default App;
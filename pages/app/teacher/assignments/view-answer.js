// Imports
import {Button} from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import {Image, Text, TouchableOpacity, View} from 'react-native';





// Main function
const CreateAssignment = ({navigation, route}) => {

    // Link params
    const {assignment, answer} = route.params;

    return (
        <View style={{height:'100%', alignItems:'center'}}>
            <View style={{width:'100%', display:'flex', flexDirection:'row', alignItems:'flex-end', justifyContent:'space-between', paddingHorizontal:10, paddingVertical:30, backgroundColor:'#0094DA', borderBottomRightRadius:40, borderBottomLeftRadius:40}}>
                <View style={{display:'flex', flexDirection:'row', alignItems:'center', gap:20}}>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('teacher-assignment-view', {assignment})}
                    >
                        <Icon name='arrow-back-outline' size={35} color='#fff'/>
                    </TouchableOpacity>
                    <Text style={{textAlign:'center', fontSize:18, color:'#fff', fontWeight:'900'}}>{answer?.student?.name}'s Report</Text>
                </View>
            </View>


            {/* View attachment */}
            <View style={{width:'90%', flex:1, display:'flex', flexDirection:'column', alignItems:'center', paddingTop:30, gap:30}}>
                <View style={{width:'90%', display:'flex', flexDirection:'column', gap:8}}>
                    <Text style={{fontSize:18, fontWeight:'700'}}>Answer:</Text>
                    <Text style={{fontSize:16, color:'gray'}}>{answer?.answer}</Text>
                </View>
                <View style={{width:'90%', display:'flex', flexDirection:'column', gap:4}}>
                    <Text style={{fontSize:18, fontWeight:'700'}}>Attachment:</Text>

                    <TouchableOpacity
                        style={{}}
                        onPress={() => navigation.navigate('teacher-assignment-pdf-preview', {pdfUri:answer?.attachment, assignment, answer})}
                    >
                        <Image
                            style={{width:50, height:50}}
                            source={require('../../../../assets/Assignments/PdfIcon.png')}
                        />
                        <Text style={{fontSize:16, color:'#0094DA'}}>{answer?.attachment?.split('/')[4]}</Text>
                    </TouchableOpacity>
                </View>

                <Button
                    mode='contained'
                    onPress={() => navigation.navigate('teacher-assignment-feedback-add', {assignment, answer})}
                    style={{borderRadius:4, width:'90%'}}
                >
                    <View style={{display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'center', gap:8}}>
                        <Text style={{color:'#fff'}}>Add Feedback</Text>
                        <Icon name='arrow-forward-outline' size={20} color='#fff'/>
                    </View>
                </Button>
            </View>

        </View>
    );
};





// Export
export default CreateAssignment;
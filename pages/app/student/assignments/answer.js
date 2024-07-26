// Imports
import Icon from 'react-native-vector-icons/Ionicons';
import {Image, Text, TouchableOpacity, View} from 'react-native';





// Main functions
const App = ({navigation, route}) => {

    // Assignment and submitted answer
    const {submitted_assignment, assignment} = route.params;

    return (
        <View style={{height:'100%'}}>
            <View style={{width:'100%', display:'flex', flexDirection:'row', alignItems:'flex-end', justifyContent:'space-between', paddingHorizontal:10, paddingVertical:30, backgroundColor:'#0094DA', borderBottomRightRadius:40, borderBottomLeftRadius:40}}>
                <View style={{display:'flex', flexDirection:'row', alignItems:'center', gap:20}}>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('student-assignment-view', {assignment})}
                    >
                        <Icon name='arrow-back-outline' size={35} color='#fff'/>
                    </TouchableOpacity>
                    <Text style={{textAlign:'center', fontSize:18, color:'#fff', fontWeight:'900'}}>Attachment</Text>
                </View>
            </View>

            {/* View attachment */}
            <View style={{flex:1, display:'flex', flexDirection:'column', alignItems:'center', paddingTop:30, gap:30}}>

                <View style={{width:'90%', display:'flex', flexDirection:'column', gap:4}}>
                    <Text style={{fontSize:18, fontWeight:'700'}}>Your Answer:</Text>
                    <Text style={{fontSize:16}}>{submitted_assignment.answer}</Text>
                </View>


                <View style={{width:'90%', display:'flex', flexDirection:'column', gap:4}}>
                    <Text style={{fontSize:18, fontWeight:'700'}}>Attachment:</Text>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('student-assignment-pdf-preview', {pdfUri:submitted_assignment.attachment, assignment, submitted_assignment, page:'answer'})}
                    >
                        <Image
                            source={require('../../../../assets/Assignments/PdfIcon.png')}
                            style={{width:50, height:50}}
                        />
                        <Text style={{color:'#0094DA'}}>{submitted_assignment.attachment.split('/')[4]}</Text>
                    </TouchableOpacity>
                </View>
        
            </View>

        </View>
    );
};





// Export
export default App;
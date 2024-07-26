// Imports
import {WebView} from 'react-native-webview';
import {ActivityIndicator} from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import {View, TouchableOpacity, Text} from 'react-native';





// Main function
const PdfPreview = ({navigation, route}) => {

    // Pdf uri
    const {pdfUri, assignment, answer} = route.params;

    return (
        <View style={{height:'100%'}}>
            <View style={{width:'100%', display:'flex', flexDirection:'row', alignItems:'flex-end', justifyContent:'space-between', paddingHorizontal:10, paddingVertical:30, backgroundColor:'#0094DA', borderBottomRightRadius:40, borderBottomLeftRadius:40}}>
                <View style={{display:'flex', flexDirection:'row', alignItems:'center', gap:20}}>
                    <TouchableOpacity
                        onPress={() => answer
                                ? navigation.navigate('teacher-assignment-answer-view', {assignment, answer})
                                : navigation.navigate('teacher-assignment-view', {assignment})
                            }
                    >
                        <Icon name='arrow-back-outline' size={35} color='#fff'/>
                    </TouchableOpacity>
                    <Text style={{textAlign:'center', fontSize:18, color:'#fff', fontWeight:'900'}}>Attachment</Text>
                </View>
            </View>
            <View style={{flex:1, alignItems:'center', paddingVertical:30}}>
                <View style={{flex:1, width:'90%'}}>
                    <WebView
                        style={{width:'100%'}}
                        originWhitelist={['*']}
                        renderLoading={() => <View style={{height:'100%', width:'100%', alignItems:'center', justifyContent:'center'}}><ActivityIndicator size={30}/></View>}
                        startInLoadingState={true}
                        source={{uri:`https://docs.google.com/gview?embedded=true&url=${pdfUri}`}}
                    />
                </View>
            </View>
        </View>
    );
};





// Export
export default PdfPreview;
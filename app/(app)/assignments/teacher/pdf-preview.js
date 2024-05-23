// Imports
import {router} from 'expo-router';
import {WebView} from 'react-native-webview';
import {useLocalSearchParams} from 'expo-router';
import {View, TouchableOpacity, Text} from 'react-native';
import {ActivityIndicator, Icon} from 'react-native-paper';





// Main function
const PdfPreview = () => {


    // Pdf uri
    const {pdfUri, assignment} = useLocalSearchParams();


    return (
        <View style={{height:'100%'}}>
            <View style={{width:'100%', height:120, display:'flex', flexDirection:'row', alignItems:'flex-end', justifyContent:'space-between', paddingHorizontal:10, paddingBottom:30, backgroundColor:'#0094DA', borderBottomRightRadius:40, borderBottomLeftRadius:40}}>
                <View style={{display:'flex', flexDirection:'row', alignItems:'center', gap:20}}>
                    <TouchableOpacity
                        onPress={() => router.push({pathname:'/assignments/teacher/view', params:JSON.parse(assignment)})}
                    >
                        <Icon source='chevron-left' size={40} color='#fff'/>
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
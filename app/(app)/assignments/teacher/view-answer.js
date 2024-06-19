// Imports
import axios from 'axios';
import {useEffect, useState} from 'react';
import {router, useLocalSearchParams} from 'expo-router';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {Icon, Button, ActivityIndicator} from 'react-native-paper';





// Main function
const CreateAssignment = () => {

    // Link params
    const {a, answer} = useLocalSearchParams();


    // Is loading
    const [isLoading, setIsLoading] = useState(false);


    // Assignment
    const [assignment, setAssignment] = useState();


    // Amswer
    const [theAnswer, setAnswer] = useState();


    // Use effect
    useEffect(() => {
        setIsLoading(true);
        const fetcher = async () => {
            const link = `${process.env.EXPO_PUBLIC_API_URL}/assignments/assignment/${JSON.parse(a)._id}`;
            const res = await axios.get(link);
            setAssignment(res.data);
            setAnswer(res.data.submitted_assignments.filter(sa => sa._id === JSON.parse(answer)._id)[0]);
            setIsLoading(false);
        };
        fetcher();
    }, [])

    return (
        <View style={{height:'100%', alignItems:'center'}}>
            <View style={{width:'100%', height:120, display:'flex', flexDirection:'row', alignItems:'flex-end', justifyContent:'space-between', paddingHorizontal:10, paddingBottom:30, backgroundColor:'#0094DA', borderBottomRightRadius:40, borderBottomLeftRadius:40}}>
                <View style={{display:'flex', flexDirection:'row', alignItems:'center', gap:20}}>
                    <TouchableOpacity
                        onPress={() => router.push({pathname:'/assignments/teacher/view', params:{a:JSON.stringify(assignment)}})}
                    >
                        <Icon source='chevron-left' size={40} color='#fff'/>
                    </TouchableOpacity>
                    <Text style={{textAlign:'center', fontSize:18, color:'#fff', fontWeight:'900'}}>{!isLoading && `${theAnswer?.student?.name}'s Report`}</Text>
                </View>
            </View>


            {/* View attachment */}
            {isLoading ? (
                <View style={{paddingTop:30}}>
                    <ActivityIndicator />
                </View>
            ) : (
                <View style={{width:'90%', flex:1, display:'flex', flexDirection:'column', alignItems:'center', paddingTop:30, gap:30}}>
                    <View style={{width:'90%', display:'flex', flexDirection:'column', gap:8}}>
                        <Text style={{fontSize:18, fontWeight:'700'}}>Answer:</Text>
                        <Text style={{fontSize:16, color:'gray'}}>{theAnswer?.answer}</Text>
                    </View>
                    <View style={{width:'90%', display:'flex', flexDirection:'column', gap:4}}>
                        <Text style={{fontSize:18, fontWeight:'700'}}>Attachment:</Text>

                        <TouchableOpacity
                            style={{}}
                            onPress={() => router.push({pathname:'/assignments/teacher/pdf-preview', params:{pdfUri:theAnswer?.attachment, assignment:JSON.stringify(assignment), answer:JSON.stringify(theAnswer)}})}
                        >
                            <Image
                                style={{width:50, height:50}}
                                source={require('../../../../assets/Assignments/PdfIcon.png')}
                            />
                            <Text style={{fontSize:16, color:'#0094DA'}}>{theAnswer?.attachment?.split('/')[4]}</Text>
                        </TouchableOpacity>
                    </View>

                    <Button
                        mode='contained'
                        onPress={() => router.push({pathname:'/assignments/teacher/add-feedback', params:{assignment:JSON.stringify(assignment), answer:JSON.stringify(theAnswer)}})}
                        style={{borderRadius:4, width:'90%'}}
                    >
                        <View style={{display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'center', gap:8}}>
                            <Text style={{color:'#fff'}}>Add Feedback</Text>
                            <Icon source='arrow-right' size={20} color='#fff'/>
                        </View>
                    </Button>
                </View>
            )}

        </View>
    );
};





// Export
export default CreateAssignment;
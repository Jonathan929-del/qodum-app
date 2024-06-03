// Imports
import axios from 'axios';
import {ActivityIndicator, Icon} from 'react-native-paper';
import {useEffect, useState} from 'react';
import {router, useLocalSearchParams} from 'expo-router';
import {Text, TouchableOpacity, View} from 'react-native';





// Main function
const CreateAssignment = () => {

    // Link params
    const {a, answer} = useLocalSearchParams();


    // Is loading
    const [isLoading, setIsLoading] = useState(false);


    // Assignment
    const [assignment, setAssignment] = useState();


    // Answer
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
    }, []);

    return (
        <View style={{height:'100%', alignItems:'center'}}>
            <View style={{width:'100%', height:120, display:'flex', flexDirection:'row', alignItems:'flex-end', justifyContent:'space-between', paddingHorizontal:10, paddingBottom:30, backgroundColor:'#0094DA', borderBottomRightRadius:40, borderBottomLeftRadius:40}}>
                <View style={{display:'flex', flexDirection:'row', alignItems:'center', gap:20}}>
                    <TouchableOpacity
                        onPress={() => router.push({pathname:'/assignments/student/view', params:assignment})}
                    >
                        <Icon source='chevron-left' size={40} color='#fff'/>
                    </TouchableOpacity>
                    <Text style={{textAlign:'center', fontSize:18, color:'#fff', fontWeight:'900'}}>Feedback</Text>
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
                        <Text style={{fontSize:18, fontWeight:'700'}}>Grade:</Text>
                        <Text style={{fontSize:16, color:'gray'}}>{theAnswer?.feedback?.grade}</Text>
                    </View>
                    <View style={{width:'90%', display:'flex', flexDirection:'column', gap:4}}>
                        <Text style={{fontSize:18, fontWeight:'700'}}>Feedback:</Text>
                        <Text style={{minHeight:150, fontSize:16, color:'gray'}}>{theAnswer?.feedback?.feedback}</Text>
                    </View>
                </View>
            )}

        </View>
    );
};





// Export
export default CreateAssignment;
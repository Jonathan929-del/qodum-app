// Imports
import {Button} from 'react-native-paper';
import {AuthContext} from '../../context/Auth';
import {useContext, useEffect, useState} from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';





// Main function
const welcome = ({navigation}) => {

    // School
    const {school, user} = useContext(AuthContext);


    // Type
    const [type, setType] = useState('');


    // Is error
    const [isError, setIsError] = useState(false);


    // Use effect
    useEffect(() => {
        if(!school) navigation.navigate('school-code');
        if(user) user.type === 'Teacher' ? navigation.navigate('teacher-tabs', {screen:'Home'}) : navigation.navigate('student-tabs', {screen:'Home'});
    }, []);

    return (
        <View style={{height:'100%', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'space-evenly', paddingHorizontal:40}}>

            <View style={{height:'40%', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:30}}>

                <Text style={{fontSize:16}}>Welcome to</Text>

                <View style={{gap:5, alignItems:'center'}}>
                    {school?.logo && (
                        <Image
                            style={{height:100, width:100}}
                            source={{uri:school?.logo}}
                        />
                    )}
                    <Text style={{fontSize:20, fontWeight:'900'}}>
                        {school?.school_name}
                    </Text>
                </View>

                <Text style={{fontSize:18, fontWeight:'500', textAlign:'center'}}>
                    For an improved learning and teaching experience
                </Text>
            </View>


            <View style={{display:'flex', width:'100%', flexDirection:'column', alignItems:'center', gap:10}}>
                <Text style={{fontSize:16, fontWeight:'700'}}>I am a:</Text>
                <View style={{width:'100%', display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'center', gap:20}}>
                    <TouchableOpacity
                        onPress={() => {setType('student');setIsError(false)}}
                        style={{width:'50%', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:5}}
                    >
                        <Image
                            style={{width:'100%', height:150, borderRadius:10, borderWidth:2, borderColor:isError ? 'red' : type === 'student' ? '#0094DA' : 'gray'}}
                            source={require('../../assets/Auth/Student.png')}
                        />
                        <Text>Student</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {setType('teacher');setIsError(false)}}
                        style={{width:'50%', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:5}}
                    >
                        <Image
                            style={{width:'100%', height:150, borderRadius:10, borderWidth:2, borderColor:isError ? 'red' : type === 'teacher' ? '#0094DA' : 'gray'}}
                            source={require('../../assets/Auth/Teacher.png')}
                        />
                        <Text>Teacher</Text>
                    </TouchableOpacity>
                </View>
            </View>


            <View style={{height:'10%', width:'100%', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:30}}>
                <Button
                    mode='contained'
                    style={{width:'100%', borderRadius:4, backgroundColor:'#0094DA'}}
                    onPress={() => {
                        if(type === ''){
                            setIsError(true);
                        }else{
                            navigation.navigate('send-otp', {type});
                        }
                    }}
                >
                    Sign Up
                </Button>

                <View style={{display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'center', gap:4}}>
                    <Text>Already have an account?</Text>
                    <TouchableOpacity
                        onPress={() => {
                            if(type === ''){
                                setIsError(true)
                            }else{
                                navigation.navigate('login', {type});
                            }
                        }}
                    >
                        <Text style={{color:'#0094DA'}}>
                            Login
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};





// Export
export default welcome;
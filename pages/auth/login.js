// // Imports
import '../../firebase';
import messaging from '@react-native-firebase/messaging';

import axios from 'axios';
import configs from '../../configs';
import {useContext, useState} from 'react';
import {AuthContext} from '../../context/Auth';
import {useForm, Controller} from 'react-hook-form';
import Icon from 'react-native-vector-icons/Ionicons';
import {Image, Text, View, Button, TouchableOpacity} from 'react-native';
import {TextInput as PaperTextInput, ActivityIndicator, Snackbar} from 'react-native-paper';





// Main component
const login = ({route, navigation}) => {


    // Context
    const {school, login} = useContext(AuthContext);


    // User type
    const {type} = route.params;


    // Snack bar actions
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [visible, setVisible] = useState(false);
    const onDismissSnackBar = () => setVisible(false);


    // Controller
    const {control, handleSubmit, formState:{errors}} = useForm();


    // Error
    const [isError, setIsError] = useState(false);


    // Is loading
    const [isLoading, setIsLoading] = useState(false);


    // Handle submit
    const onSubmit = async data => {
        setIsLoading(true);
        try {

            // User login API call
            const link = type === 'student' ? `${configs.EXPO_PUBLIC_API_URL}/students/student/login` : `${configs.EXPO_PUBLIC_API_URL}/teachers/teacher/login`;
            const res = await axios.post(link, {adm_no:data.adm_no, password:data.password});
            

            // Validations
            if(res.data.adm_no === 'Wrong credentials.'){
                setIsError(true);
                setVisible(true);
                setIsLoading(false);
                return;
            };


            // Subscribing to topic
            try {
                if(type === 'student'){
                    await messaging().subscribeToTopic(res.data.student.class_name);
                    await messaging().subscribeToTopic(res.data.adm_no.replace(/\//g, '_'));
                }else{
                    await messaging().subscribeToTopic(res.data.adm_no.replace(/\//g, '_'));
                };
            }catch(err){
                setSnackbarMessage('Error Registring!');
                setVisible(true);
                setIsLoading(false);
                return;
            };


            // User login
            login(res.data);
            setVisible(true);
            setIsLoading(false);
            type === 'teacher' ? navigation.navigate('teacher-tabs', {screen:'Home'}) : navigation.navigate('student-tabs', {screen:'Home'});

        }catch(err){
            console.log(err);
        }
    };


    return (
        <View style={{height:'100%', display:'flex', justifyContent:'flex-end', backgroundColor:'#0094DA'}}>
            <View style={{height:'90%', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'space-evenly', paddingHorizontal:30, paddingTop:30, backgroundColor:'#fff', borderTopRightRadius:40, borderTopLeftRadius:40}}>

                <View style={{alignItems:'center', gap:30}}>
                    <Image
                        style={{height:100, width:100}}
                        source={{uri:school.logo}}
                    />
                    <Text style={{fontSize:25, fontWeight:'900'}}>Sign In</Text>
                    <Text style={{color:'gray'}}>
                        Welcome back!
                    </Text>
                </View>


                <View style={{width:'100%', gap:10}}>


                    {/* Amission number */}
                    <View>
                        <Controller
                            control={control}
                            render={({field:{onChange, onBlur, value}}) => (
                              <View style={{position:'relative', display:'flex', flexDirection:'row'}}>
                                <Icon name='person-outline' size={30} color='gray' style={{position:'absolute', top:'25%', left:10, zIndex:2}}/>
                                <PaperTextInput
                                  label={type === 'teacher' ? 'Employee ID' : 'Admission Number'}
                                  onBlur={onBlur}
                                  style={{width:'100%', paddingLeft:35, backgroundColor:'#F5F5F8'}}
                                  value={value}
                                  onChangeText={onChange}
                                />
                              </View>
                            )}
                            name='adm_no'
                            rules={{required:true}}
                        />
                        {errors.adm_no && <Text style={{color:'red'}}>Admission number is required.</Text>}
                    </View>

                    {/* Password */}
                    <View style={{position:'relative', display:'flex', flexDirection:'row'}}>
                        <Controller
                            control={control}
                            render={({field:{onChange, onBlur, value}}) => (
                              <View style={{width:'100%'}}>
                                <Icon name='lock-closed-outline' size={30} color='gray' style={{position:'absolute', top:'25%', left:10, zIndex:2}}/>
                                <PaperTextInput
                                  label='Password'
                                  onBlur={onBlur}
                                  textContentType='password'
                                  secureTextEntry
                                  style={{width:'100%', paddingLeft:35, backgroundColor:'#F5F5F8'}}
                                  value={value}
                                  onChangeText={onChange}
                                />
                              </View>
                            )}
                            name='password'
                            rules={{required:true}}
                        />
                        {errors.password && <Text style={{color:'red'}}>Please enter a password.</Text>}
                    </View>


                    {isLoading ? (
                        <ActivityIndicator />
                    ) : (
                        <Button
                            onPress={handleSubmit(onSubmit)}
                            title='Submit'
                        />
                    )}

                    <View style={{display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'center', gap:4, marginTop:30}}>
                        <Text>Don't have an account?</Text>
                        <TouchableOpacity
                            onPress={() => navigation.navigate('send-otp', {type})}
                        >
                            <Text style={{color:'#0094DA'}}>
                                Sign Up
                            </Text>
                        </TouchableOpacity>
                    </View>

                </View>


                <Snackbar
                    visible={visible}
                    style={{backgroundColor:isError ? 'red' : 'green'}}
                    onDismiss={onDismissSnackBar}
                    action={{
                        label: <Icon source='close' color='#fff' size={20}/>,
                        onPress:() => setVisible(false)
                    }}
                >
                    {isError ? 'Wrong credentials.' : 'Registered successfully!'}
                </Snackbar>

            </View>
        </View>
    );
};





// Export
export default login;
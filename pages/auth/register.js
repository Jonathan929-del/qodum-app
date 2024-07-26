// Imports
import '../../firebase';
import messaging from '@react-native-firebase/messaging';

import axios from 'axios';
import configs from '../../configs';
import {AuthContext} from '../../context/Auth';
import {useForm, Controller} from 'react-hook-form';
import Icon from 'react-native-vector-icons/Ionicons';
import {useContext, useEffect, useState} from 'react';
import {Image, Text, View, Button} from 'react-native';
import {TextInput as PaperTextInput, ActivityIndicator, Snackbar} from 'react-native-paper';





// Main component
const register = ({navigation, route}) => {


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
    const [resErrors, setResErrors] = useState({});


    // Is loading
    const [isLoading, setIsLoading] = useState(false);


    // Handle submit
    const onSubmit = async data => {
        setIsLoading(true);
        try {

            // User register API
            const link = type === 'student' ? `${configs.EXPO_PUBLIC_API_URL}/students/student/register` : `${configs.EXPO_PUBLIC_API_URL}/teachers/teacher/register`;
            const res = await axios.post(link, {password:data.password, confirm_password:data.confirmPassword});
            

            // Validations
            if((!res.data.adm_no && res.data.password) || res.data.confirm_password){
                setResErrors(res.data);
                setIsLoading(false);
                return;
            };


            // Subscribing to topic
            try {
                if(type === 'student'){
                    await messaging().subscribeToTopic(res.data?.student?.class_name);
                    await messaging().subscribeToTopic(res.data?.adm_no?.replace(/\//g, '_'));
                }else{
                    await messaging().subscribeToTopic(res.data?.adm_no?.replace(/\//g, '_'));
                };
            }catch(err){
                setSnackbarMessage('Error Registring!');
                setVisible(true);
                setIsLoading(false);
                return;
            };


            // User Login
            login(res.data);
            setVisible(true);
            setSnackbarMessage('Registered successfully!');
            setIsLoading(false);
            type === 'teacher' ? navigation.navigate('teacher-tabs', {screen:'Home'}) : navigation.navigate('student-tabs', {screen:'Home'});

        }catch(err){
            console.log(err);
        }
    };


    // Use effect
    useEffect(() => {
        errors.password && setResErrors({...resErrors, password:''});
        errors.confirmPassword && setResErrors({...resErrors, confirmPassword:''});
    }, [errors.password, errors.confirmPassword]);

    return (
        <View style={{height:'100%', display:'flex', justifyContent:'flex-end', backgroundColor:'#0094DA'}}>
            <View style={{height:'90%', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'space-evenly', paddingHorizontal:30, paddingTop:30, backgroundColor:'#fff', borderTopRightRadius:40, borderTopLeftRadius:40}}>

                <View style={{alignItems:'center', gap:30}}>
                    <Image
                        style={{height:100, width:100}}
                        source={{uri:school.logo}}
                    />
                    <Text style={{fontSize:25, fontWeight:'900'}}>Create your password</Text>
                    <Text style={{color:'gray'}}>
                        Almost there!
                    </Text>
                </View>


                <View style={{width:'100%', gap:10}}>

                    {/* Password */}
                    <View>
                        <Controller
                            control={control}
                            render={({field:{onChange, onBlur, value}}) => (
                                <View style={{position:'relative', display:'flex', flexDirection:'row'}}>
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
                        {!errors.password && resErrors.password && <Text style={{color:'red'}}>{resErrors.password}</Text>}
                    </View>


                    {/* Confirm password */}
                    <View>
                        <Controller
                            control={control}
                            render={({field:{onChange, onBlur, value}}) => (
                                <View style={{position:'relative', display:'flex', flexDirection:'row'}}>
                                    <Icon name='lock-closed-outline' size={30} color='gray' style={{position:'absolute', top:'25%', left:10, zIndex:2}}/>
                                    <PaperTextInput
                                        label='Confirm password'
                                        onBlur={onBlur}
                                        textContentType='password'
                                        secureTextEntry
                                        style={{width:'100%', paddingLeft:35, backgroundColor:'#F5F5F8'}}
                                        value={value}
                                        onChangeText={onChange}
                                    />
                                </View>
                            )}
                            name='confirmPassword'
                            rules={{required:true}}
                        />
                        {errors.confirmPassword && <Text style={{color:'red'}}>Please confirm password.</Text>}
                        {!errors.confirmPassword && resErrors.confirm_password && <Text style={{color:'red'}}>{resErrors.confirm_password}</Text>}
                    </View>

                    {isLoading ? (
                        <ActivityIndicator />
                    ) : (
                        <Button
                            onPress={handleSubmit(onSubmit)}
                            title='Submit'
                        />
                    )}
                </View>


                <Snackbar
                    visible={visible}
                    style={{backgroundColor:snackbarMessage === 'Registered successfully!' ? 'green' : 'red'}}
                    onDismiss={onDismissSnackBar}
                    action={{
                        label: <Icon source='close' color='#fff' size={20}/>,
                        onPress:() => setVisible(false)
                    }}
                >
                    {snackbarMessage}
                </Snackbar>

            </View>
        </View>
    );
};





// Export
export default register;
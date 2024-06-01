// Imports
import '../../firebase';
import {app} from '../../firebase';
import messaging from '@react-native-firebase/messaging';
import {getFirestore, collection, addDoc} from 'firebase/firestore'; 
import {getAuth, createUserWithEmailAndPassword} from 'firebase/auth';

import axios from 'axios';
import {AuthContext} from '../../context/Auth';
import {useForm, Controller} from 'react-hook-form';
import {useContext, useEffect, useState} from 'react';
import {Image, Text, View, Button} from 'react-native';
import {router, useLocalSearchParams} from 'expo-router';
import {TextInput as PaperTextInput, ActivityIndicator, Snackbar, Icon} from 'react-native-paper';





// Main component
const register = () => {


    // Context
    const {school, login} = useContext(AuthContext);


    // Type
    const {type} = useLocalSearchParams();


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
            const link = type === 'student' ? `${process.env.EXPO_PUBLIC_API_URL}/students/student/register` : `${process.env.EXPO_PUBLIC_API_URL}/teachers/teacher/register`;
            const res = await axios.post(link, {password:data.password, confirm_password:data.confirmPassword});
            

            // Validations
            if((!res.data.adm_no && res.data.password) || res.data.confirm_password){
                setResErrors(res.data);
                setIsLoading(false);
                return;
            };


            // Firebase registration (Working only in deployment build)
            try {
                const auth = getAuth();
                await createUserWithEmailAndPassword(auth, type === 'student' ? res.data.student.email : res.data.email, data.password);
                const currentUser = auth.currentUser;
                const db = getFirestore(app);
                let fcmToken = await messaging().getToken();
                await addDoc(collection(db, 'users'), {
                    fcmToken:fcmToken,
                    id:currentUser.uid,
                    email:currentUser.email,
                    adm_no:res.data.adm_no,
                    role:type
                });

                // Subscribing to topic
                if(type === 'student'){
                    await messaging().subscribeToTopic(`student.assignments.${res.data.student.class_name}`);
                    await messaging().subscribeToTopic(`student.${res.data.adm_no.replace(/\//g, '_')}`);
                }else{
                    await messaging().subscribeToTopic(`teacher.${res.data.adm_no.replace(/\//g, '_')}`);
                };
            }catch(err){
                setSnackbarMessage('Error Registring!');
                setVisible(true);
                setIsLoading(false);
                return;
            }


            // User registration
            setSnackbarMessage('Registered successfully!');
            setVisible(true);
            setIsLoading(false);
            login(res.data);
            router.push('/');

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
                                <PaperTextInput
                                    label='Password'
                                    onBlur={onBlur}
                                    textContentType='password'
                                    secureTextEntry
                                    style={{backgroundColor:'#F5F5F8', underlineColor:'red'}}
                                    left={<PaperTextInput.Icon icon='lock' size={30} color='gray'/>}
                                    value={value}
                                    onChangeText={onChange}
                                />
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
                                <PaperTextInput
                                    label='Confirm password'
                                    onBlur={onBlur}
                                    textContentType='password'
                                    secureTextEntry
                                    style={{backgroundColor:'#F5F5F8', underlineColor:'red'}}
                                    left={<PaperTextInput.Icon icon='lock' size={30} color='gray'/>}
                                    value={value}
                                    onChangeText={onChange}
                                />
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
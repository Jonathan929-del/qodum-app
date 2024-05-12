// Imports
import axios from 'axios';
import {router, useLocalSearchParams} from 'expo-router';
import {useContext, useState} from 'react';
import {AuthContext} from '../../context/Auth';
import {useForm, Controller} from 'react-hook-form';
import {Image, Text, View, Button, TouchableOpacity} from 'react-native';
import {TextInput as PaperTextInput, ActivityIndicator, Snackbar, Icon} from 'react-native-paper';





// Main component
const login = () => {


    // Context
    const {school, login} = useContext(AuthContext);


    // User type
    const {type} = useLocalSearchParams();


    // Snack bar actions
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

            // Api call
            const link = type === 'student' ? `${process.env.EXPO_PUBLIC_API_URL}/students/student/login` : `${process.env.EXPO_PUBLIC_API_URL}/teachers/teacher/login`;
            const res = await axios.post(link, {adm_no:data.adm_no, password:data.password});
            

            // Validations
            if(res.data.adm_no === 'Wrong credentials.'){
                setIsError(true);
                setVisible(true);
                setIsLoading(false);
                return;
            };


            // User login
            setVisible(true);
            setIsLoading(false);
            login(res.data);
            router.push('/');

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
                            <PaperTextInput
                                label='Admission Number'
                                onBlur={onBlur}
                                style={{backgroundColor:'#F5F5F8', underlineColor:'red'}}
                                left={<PaperTextInput.Icon icon='account' size={30} color='gray'/>}
                                value={value}
                                onChangeText={onChange}
                            />
                            )}
                            name='adm_no'
                            rules={{required:true}}
                        />
                        {errors.adm_no && <Text style={{color:'red'}}>Admission number is required.</Text>}
                    </View>

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
                            onPress={() => router.push('/send-otp')}
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
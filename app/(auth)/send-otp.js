// Imports
import axios from 'axios';
import {AuthContext} from '../../context/Auth';
import {useForm, Controller} from 'react-hook-form';
import {useContext, useEffect, useState} from 'react';
import {router, useLocalSearchParams} from 'expo-router';
import {Image, Text, View, Button, TouchableOpacity} from 'react-native';
import {TextInput as PaperTextInput, ActivityIndicator, Snackbar, Icon} from 'react-native-paper';





// Main component
const register = () => {


    // Context
    const {school, preLoginUserLogin} = useContext(AuthContext);


    // Type
    const {type} = useLocalSearchParams();


    // Snack bar actions
    const [visible, setVisible] = useState(false);
    const onDismissSnackBar = () => setVisible(false);


    // Controller
    const {control, handleSubmit, formState:{errors}} = useForm();


    // Error
    const [error, setError] = useState('');


    // Is loading
    const [isLoading, setIsLoading] = useState(false);


    // Handle submit
    const onSubmit = async data => {
        setIsLoading(true);
        try {
            const link = type === 'student' ? `${process.env.EXPO_PUBLIC_API_URL}/students/student/send-otp` : `${process.env.EXPO_PUBLIC_API_URL}/teachers/teacher/send-otp`;
            const res = await axios.post(link, {adm_no:data.adm_no});

        
            // Validations
            if(res.data === 'No students found with this admission number'){
                setError('No students found with this admission number.');
                setIsLoading(false);
                return;
            };
            if(res.data === 'No teachers found with this admission number'){
                setError('No teachers found with this admission number.');
                setIsLoading(false);
                return;
            };
            if(res.data.student === 'Student already registered'){
                setError('Student is already registered');
                setIsLoading(false);
                return;
            };
            if(res.data.adm_no === 'Teacher already registered'){
                setError('Teacher is already registered');
                setIsLoading(false);
                return;
            };


            // Sending OTP
            setVisible(true);
            setIsLoading(false);
            preLoginUserLogin(res.data);
            router.push({pathname:'/check-otp', params:{type}});


        }catch(err){
            console.log(err);
        }
    };


    // Use effect
    useEffect(() => {
        errors.adm_no && setError('');
    }, [errors.adm_no]);


    return (
        <View style={{height:'100%', display:'flex', justifyContent:'flex-end', backgroundColor:'#0094DA'}}>
            <View style={{height:'90%', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'space-evenly', paddingHorizontal:30, paddingTop:30, backgroundColor:'#fff', borderTopRightRadius:40, borderTopLeftRadius:40}}>

                <View style={{alignItems:'center', gap:30}}>
                    <Image
                        style={{height:100, width:100}}
                        source={{uri:school.logo}}
                    />
                    <Text style={{fontSize:25, fontWeight:'900'}}>Sign Up</Text>
                    <Text style={{color:'gray'}}>
                        Welcome to {school.school_name}
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
                        {!errors.adm_no && error && <Text style={{color:'red'}}>{error}</Text>}
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
                        <Text>Already have an account?</Text>
                        <TouchableOpacity
                            onPress={() => router.push('/login')}
                        >
                            <Text style={{color:'#0094DA'}}>
                                Sign In
                            </Text>
                        </TouchableOpacity>
                    </View>

                </View>

            </View>

            <Snackbar
                visible={visible}
                style={{backgroundColor:'green'}}
                onDismiss={onDismissSnackBar}
                action={{
                    label: <Icon source='close' color='#fff' size={20}/>,
                    onPress:() => setVisible(false)
                }}
            >
                OTP sent
            </Snackbar>
        </View>
    );
};





// Export
export default register;
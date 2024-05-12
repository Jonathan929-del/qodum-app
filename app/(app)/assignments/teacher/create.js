// Imports
import axios from 'axios';
import moment from 'moment';
import {router} from 'expo-router';
import {useState, useEffect} from 'react';
import {useForm, Controller} from 'react-hook-form';
import {Text, TouchableOpacity, View, ScrollView, Image, Button} from 'react-native';
import {TextInput as PaperTextInput, ActivityIndicator, Snackbar, Icon} from 'react-native-paper';





// Main function
const CreateAssignment = () => {

    // Snack bar actions
    const [visible, setVisible] = useState(false);
    const onDismissSnackBar = () => setVisible(false);


    // Error
    const [isError, setIsError] = useState(false);


    // Is loading
    const [isLoading, setIsLoading] = useState(false);


    // Controller
    const {control, handleSubmit, formState:{errors}} = useForm();


    // On submit
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
        <View style={{height:'100%', alignItems:'center', gap:50}}>
            <View style={{width:'100%', height:120, display:'flex', flexDirection:'row', alignItems:'flex-end', justifyContent:'space-between', paddingHorizontal:10, paddingBottom:30, backgroundColor:'#0094DA', borderBottomRightRadius:40, borderBottomLeftRadius:40}}>
                <View style={{display:'flex', flexDirection:'row', alignItems:'center', gap:20}}>
                    <TouchableOpacity
                        onPress={() => router.push('/assignments/teacher')}
                    >
                        <Icon source='chevron-left' size={40} color='#fff'/>
                    </TouchableOpacity>
                    <Text style={{textAlign:'center', fontSize:18, color:'#fff', fontWeight:'900'}}>Assignments</Text>
                </View>
            </View>


            {/* Form */}
            <ScrollView style={{width:'80%'}} contentContainerStyle={{gap:20}}>

                {/* Title */}
                <View>
                    <Controller
                        control={control}
                        render={({field:{onChange, onBlur, value}}) => (
                            <PaperTextInput
                                label='Title'
                                onBlur={onBlur}
                                style={{backgroundColor:'#F5F5F8', underlineColor:'red'}}
                                left={<PaperTextInput.Icon icon='account' size={30} color='gray'/>}
                                value={value}
                                onChangeText={onChange}
                            />
                        )}
                        name='title'
                        rules={{required:true}}
                    />
                    {errors.title && <Text style={{color:'red'}}>Title is required.</Text>}
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

            </ScrollView>

        </View>
    );
};





// Export
export default CreateAssignment;
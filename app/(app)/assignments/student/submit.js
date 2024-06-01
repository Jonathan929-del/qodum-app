// Imports
import axios from 'axios';
import {Buffer} from 'buffer'
import 'react-native-get-random-values';
import {useState, useContext} from 'react';
import * as FileSystem from 'expo-file-system';
import {useForm, Controller} from 'react-hook-form';
import {AuthContext} from '../../../../context/Auth';
import * as DocumentPicker from'expo-document-picker';
import {router, useLocalSearchParams} from 'expo-router';
import {S3Client, PutObjectCommand} from '@aws-sdk/client-s3';
import {Text, TouchableOpacity, View, ScrollView, Button} from 'react-native';
import {TextInput as PaperTextInput, ActivityIndicator, Snackbar, Icon} from 'react-native-paper';





// Main function
const CreateAssignment = () => {

    // Snack bar actions
    const [visible, setVisible] = useState(false);
    const [message, setMessage] = useState('');
    const onDismissSnackBar = () => setVisible(false);


    // User
    const {user} = useContext(AuthContext);


    // Asignment
    const assignment = useLocalSearchParams();


    // States
    const [states, setStates] = useState({
        errors:{
            attachment:'',
            answer:''
        },
        loading:false,
        loadingData:false
    });


    // Controller
    const {control, handleSubmit, reset} = useForm();


    // Values
    const [selectedFile, setSelectedFile] = useState();


    // Pick document
    const pickDocument = async () => {
        let result = await DocumentPicker.getDocumentAsync({type:'*/*'});
        if (result?.assets[0]?.mimeType === 'application/pdf' && result?.assets[0]?.size <= 5000000){
            setSelectedFile(result);
            setStates({...states, errors:{...states.errors, attachment:''}});
        }else{
            if((result?.assets[0]?.mimeType !== 'application/pdf' && result?.assets[0]?.size > 5000000) || result?.assets[0]?.mimeType !== 'application/pdf'){
                setStates({...states, errors:{
                    ...states.errors,
                    attachment:'*Please select a pdf file',
                }});
            }else{
                setStates({...states, errors:{
                    ...states.errors,
                    attachment:'*Please select a file with max size of 5MB',
                }});
            };
        }
    };


    // Upload file
    const uploadFileToS3 = async () => {
        try {

            // Create an S3 client
            const s3Client = new S3Client({
                region:process.env.EXPO_PUBLIC_AWS_REGION,
                credentials: {
                accessKeyId:process.env.EXPO_PUBLIC_AWS_ACCESS_KEY,
                secretAccessKey:process.env.EXPO_PUBLIC_AWS_SECRET_ACCESS_KEY
                }
            });
      
            // Prepare the file for upload
            const formData = new FormData();
            formData.append('file', {
                uri:selectedFile?.assets[0].uri,
                name:'test.pdf',
                type:'application/pdf'
            });

            // Read the file into a buffer
            const fileBuffer = await FileSystem.readAsStringAsync(selectedFile?.assets[0].uri, {encoding:FileSystem.EncodingType.Base64});

            // Upload the file to S3 bucket
            const uploadParams = {
                Bucket:process.env.EXPO_PUBLIC_AWS_BUCKET_NAME,
                Key:`assignments/${selectedFile?.assets[0].name}`,
                Body:Buffer.from(fileBuffer, 'base64'),
                ContentType:'application/pdf'
            };
            const command = new PutObjectCommand(uploadParams);
            const result = await s3Client.send(command);
            return `https://${process.env.EXPO_PUBLIC_AWS_BUCKET_NAME}.s3.amazonaws.com/assignments/${selectedFile?.assets[0].name}`;

        } catch (error) {
          console.error('Error uploading file: ', error);
          throw error;
        }
    };


    // On submit
    const onSubmit = async data => {
        setStates({...states, loading:true});
        try {

            // Empty validations
            if(!data.answer || !selectedFile){
                setStates({...states, errors:{
                    answer:!data.answer ? '*Please enter an answer' : '',
                    attachment:!selectedFile ? '*Please upload an attachment ' : '',
                }});
                return;
            };

            // Upload pdf
            const pdfUploadResponse = await uploadFileToS3();

            // Api call
            const link = `${process.env.EXPO_PUBLIC_API_URL}/assignments/assignment/submit`;
            const res = await axios.post(link, {assignment_id:assignment._id, student:{adm_no:user.adm_no, name:user?.student?.name, roll_no:user?.student?.roll_no}, answer:data.answer, attachment:pdfUploadResponse});


            // Sending notification
            const notificationLink = `${process.env.EXPO_PUBLIC_API_URL}/notifications/send-notification`;
            await axios.post(notificationLink, {title:'Answer Added!', body:'A student added his/her answer!', topic:`teacher.${assignment.creator_adm_no.replace(/\//g, '_')}`});


            // Reseting
            setMessage(res.data === 'Submitted' ? 'Submitted Successfully!' : 'Error Submitting');
            setVisible(true);
            setSelectedFile();
            reset({
                answer:''
            });
            setStates({...states, loading:false});
            router.push({pathname:'/assignments/student', params:{submitted:true}})
        }catch(err){
            console.log(err);
        }
    };


    return (
        <View style={{height:'100%', alignItems:'center'}}>
            <View style={{width:'100%', height:120, display:'flex', flexDirection:'row', alignItems:'flex-end', justifyContent:'space-between', paddingHorizontal:10, paddingBottom:30, backgroundColor:'#0094DA', borderBottomRightRadius:40, borderBottomLeftRadius:40}}>
                <View style={{display:'flex', flexDirection:'row', alignItems:'center', gap:20}}>
                    <TouchableOpacity
                        onPress={() => router.push('/assignments/student')}
                    >
                        <Icon source='chevron-left' size={40} color='#fff'/>
                    </TouchableOpacity>
                    <Text style={{textAlign:'center', fontSize:18, color:'#fff', fontWeight:'900'}}>{assignment.title}</Text>
                </View>
            </View>


            {/* Form */}
            <ScrollView style={{width:'100%'}} contentContainerStyle={{alignItems:'center'}}>
                <View style={{width:'80%', gap:20, paddingVertical:50}}>
                    {states.loadingData ? (
                        <ActivityIndicator />
                    ) : (
                        <>


                            {/* Attachment */}
                            <View style={{gap:6}}>
                                <Text>Attachment</Text>
                                <TouchableOpacity
                                    onPress={pickDocument}
                                    style={{display:'flex', flexDirection:'row', alignItems:'center', backgroundColor:'#F5F5F8', height:60, paddingHorizontal:20, borderTopLeftRadius:5, borderTopRightRadius:5, borderBottomWidth:1, borderBottomColor:'gray'}}
                                >
                                    <Icon source='cloud-upload-outline' size={30} color='gray'/>
                                    <Text style={{marginLeft:10, color:'gray'}}>{selectedFile ? selectedFile?.assets[0]?.name : 'Upload'}</Text>
                                </TouchableOpacity>
                                {states.errors.attachment === '' ? <Text style={{color:'#0094DA', marginTop:-6}}>Supported file is .pdf. Maximum size is 5MB</Text> : <Text style={{color:'red', marginTop:-6}}>{states.errors.attachment}</Text>}
                            </View>


                            {/* Answer */}
                            <View style={{gap:6}}>
                                <Text>Answer</Text>
                                <Controller
                                    control={control}
                                    render={({field:{onChange, onBlur, value}}) => (
                                        <PaperTextInput
                                            style={{backgroundColor:'#F5F5F8'}}
                                            placeholder='Enter Answer'
                                            onBlur={() =>setStates({...states, errors:{...states.errors, answer:value === '' ? '*Please enter an answer' : ''}})}
                                            placeholderTextColor='gray'
                                            left={<PaperTextInput.Icon icon='pencil' size={30} color='gray' />}
                                            value={value}
                                            onChangeText={onChange}
                                            multiline
                                            numberOfLines={4}
                                        />
                                    )}
                                    name='answer'
                                />
                                {states.errors.answer !== '' && <Text style={{color:'red', marginTop:-6}}>{states.errors.answer}</Text>}
                            </View>
            
            
                            {/* Button */}
                            {states.loading ? (
                                <ActivityIndicator />
                            ) : (
                                <Button
                                    onPress={handleSubmit(onSubmit)}
                                    title='Submit'
                                />
                            )}

                        </>
                    )}
                </View>
            </ScrollView>


            {/* Snackbar */}
            <Snackbar
                style={{backgroundColor:message === 'Submitted Successfully!' ? 'green' : 'red'}}
                visible={visible}
                onDismiss={onDismissSnackBar}
                action={{
                    label: <Icon source='close' color='#fff' size={20}/>,
                    onPress:() => setVisible(false)
                }}
            >
                {message}
            </Snackbar>

        </View>
    );
};





// Export
export default CreateAssignment;
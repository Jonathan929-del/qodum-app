// Imports
import axios from 'axios';
import {Buffer} from 'buffer';
import configs from '../../../../configs';
import * as FileSystem from 'expo-file-system';
import {AuthContext} from '../../../../context/Auth';
import Icon from 'react-native-vector-icons/Ionicons';
import {useState, useContext, useEffect} from 'react';
import * as DocumentPicker from'expo-document-picker';
import {S3Client, PutObjectCommand} from '@aws-sdk/client-s3';
import {Text, TouchableOpacity, View, ScrollView, Button} from 'react-native';
import SubmissionConfirmation from '../../../../utils/student/SubmissionConfirmation';
import {TextInput as PaperTextInput, ActivityIndicator, Snackbar} from 'react-native-paper';





// Main function
const CreateAssignment = ({navigation, route}) => {

    // Snack bar actions
    const [visible, setVisible] = useState(false);
    const [message, setMessage] = useState('');
    const onDismissSnackBar = () => setVisible(false);


    // User
    const {user} = useContext(AuthContext);


    // Asignment
    const {assignment} = route.params;


    // Submission confirmation
    const [isSubmissionConfirmation, setIsSubmissionConfirmation] = useState(false);
    const [isSubmissionConfirmed, setIsSubmissionConfirmed] = useState(false);


    // Answer
    const [answer, setAnswer] = useState('');


    // States
    const [states, setStates] = useState({
        errors:{
            attachment:'',
            answer:''
        },
        loading:false,
        loadingData:false
    });


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
                region:configs.EXPO_PUBLIC_AWS_REGION,
                credentials: {
                accessKeyId:configs.EXPO_PUBLIC_AWS_ACCESS_KEY,
                secretAccessKey:configs.EXPO_PUBLIC_AWS_SECRET_ACCESS_KEY
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
                Bucket:configs.EXPO_PUBLIC_AWS_BUCKET_NAME,
                Key:`assignments/${selectedFile?.assets[0].name}`,
                Body:Buffer.from(fileBuffer, 'base64'),
                ContentType:'application/pdf'
            };
            const command = new PutObjectCommand(uploadParams);
            await s3Client.send(command);
            return `https://${configs.EXPO_PUBLIC_AWS_BUCKET_NAME}.s3.amazonaws.com/assignments/${selectedFile?.assets[0].name}`;

        } catch (error) {
          console.error('Error uploading file: ', error);
          throw error;
        }
    };


    // Submit click
    const submitClick = () => {

        // Empty validations
        if(!answer || !selectedFile){
            setStates({...states, errors:{
                answer:!answer ? '*Please enter an answer' : '',
                attachment:!selectedFile ? '*Please upload an attachment ' : '',
            }});
            return;
        };

        // Submitting
        setIsSubmissionConfirmation(true);

    };


    // On submit
    const onSubmit = async () => {
        setStates({...states, loading:true});
        try {

            // Upload pdf
            const pdfUploadResponse = await uploadFileToS3();

            // Api call
            const link = `${configs.EXPO_PUBLIC_API_URL}/assignments/assignment/submit`;
            const res = await axios.post(link, {assignment_id:assignment._id, student:{adm_no:user.adm_no, name:user?.student?.name, roll_no:user?.student?.roll_no}, answer:answer, attachment:pdfUploadResponse});


            // Sending notification
            const notificationLink = `${configs.EXPO_PUBLIC_API_URL}/notifications/send-notification`;
            const params = {
                title:`${assignment.subject} - Answer Added!`,
                body:`${user.student.name} added an answer!`,
                topic:assignment.creator_adm_no.replace(/\//g, '_'),
                type:'submission',
                assignment_id:assignment._id,
                answer_id:res.data.submitted_assignments.filter(a => a.student.adm_no === user.adm_no)[0]._id
            };
            await axios.post(notificationLink, params);


            // Reseting
            setMessage(res.data._id ? 'Submitted Successfully!' : 'Error Submitting');
            setVisible(true);
            setSelectedFile();
            setStates({...states, loading:false});
            navigation.navigate('student-assignments', {submitted:true});

        }catch(err){
            console.log(err);
        }
    };


    // Use effect
    useEffect(() => {
        if(isSubmissionConfirmed){
            onSubmit();
        };
    }, [isSubmissionConfirmation, isSubmissionConfirmed]);


    return (
        <View style={{height:'100%', alignItems:'center'}}>
            <View style={{width:'100%', display:'flex', flexDirection:'row', alignItems:'flex-end', justifyContent:'space-between', paddingHorizontal:10, paddingVertical:30, backgroundColor:'#0094DA', borderBottomRightRadius:40, borderBottomLeftRadius:40}}>
                <View style={{display:'flex', flexDirection:'row', alignItems:'center', gap:20}}>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('student-assignments')}
                    >
                        <Icon name='arrow-back-outline' size={35} color='#fff'/>
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
                                    <Icon name='cloud-upload-outline' size={30} color='gray'/>
                                    <Text style={{marginLeft:10, color:'gray'}}>{selectedFile ? selectedFile?.assets[0]?.name : 'Upload'}</Text>
                                </TouchableOpacity>
                                {states.errors.attachment === '' ? <Text style={{color:'#0094DA', marginTop:-6}}>Supported file is .pdf. Maximum size is 5MB</Text> : <Text style={{color:'red', marginTop:-6}}>{states.errors.attachment}</Text>}
                            </View>


                            {/* Answer */}
                            <View style={{gap:6}}>
                                <Text>Answer</Text>
                                <View style={{position:'relative', width:'100%'}}>
                                    <Icon name='create-outline' size={30} color='gray' style={{position:'absolute', zIndex:2, top:10, left:10}}/>
                                    <PaperTextInput
                                        style={{width:'100%', paddingLeft:35, backgroundColor:'#F5F5F8'}}
                                        placeholder='Enter Answer'
                                        onBlur={v => setStates({...states, errors:{...states.errors, answer:v === '' ? '*Please enter an answer' : ''}})}
                                        placeholderTextColor='gray'
                                        value={answer}
                                        onChangeText={v => setAnswer(v)}
                                        multiline
                                        numberOfLines={4}
                                    />
                                </View>
                                {states.errors.answer !== '' && <Text style={{color:'red', marginTop:-6}}>{states.errors.answer}</Text>}
                            </View>
            
            
                            {/* Button */}
                            {states.loading ? (
                                <ActivityIndicator />
                            ) : (
                                <Button
                                    onPress={submitClick}
                                    title='Submit'
                                />
                            )}

                        </>
                    )}
                </View>
            </ScrollView>


            {/* Submission confirmation message */}
            {isSubmissionConfirmation && (
                <SubmissionConfirmation
                    isSubmissionConfirmation={isSubmissionConfirmation}
                    setIsSubmissionConfirmation={setIsSubmissionConfirmation}
                    setIsSubmissionConfirmed={setIsSubmissionConfirmed}
                />
            )}


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
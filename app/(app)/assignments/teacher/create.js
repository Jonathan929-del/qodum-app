// Imports
import axios from 'axios';
import moment from 'moment';
import {Buffer} from 'buffer'
import {router} from 'expo-router';
import 'react-native-get-random-values';
import * as FileSystem from 'expo-file-system';
import {AuthContext} from '../../../../context/Auth';
import {useForm, Controller} from 'react-hook-form';
import {useState, useEffect, useContext} from 'react';
import * as DocumentPicker from'expo-document-picker';
import {Dropdown} from 'react-native-element-dropdown';
import {S3Client, PutObjectCommand} from '@aws-sdk/client-s3';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Text, TouchableOpacity, View, ScrollView, Button, Platform} from 'react-native';
import {TextInput as PaperTextInput, ActivityIndicator, Snackbar, Icon, Switch} from 'react-native-paper';





// Main function
const CreateAssignment = () => {

    // Snack bar actions
    const [visible, setVisible] = useState(false);
    const onDismissSnackBar = () => setVisible(false);


    // User
    const {user} = useContext(AuthContext);


    // States
    const [states, setStates] = useState({
        errors:{
            subject:'',
            class_name:'',
            title:'',
            attachment:'',
            assignment:''
        },
        loading:false,
        loadingData:false
    });


    // Controller
    const {control, handleSubmit} = useForm();


    // Opened dropdown
    const [openedField, setOpenedField] = useState('');


    // Values
    const [subjects, setSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState('');
    const [classes, setClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState('');
    const [assignmentDate, setAssignmentDate] = useState(new Date());
    const [selectedFile, setSelectedFile] = useState();
    const [isAllowStudentForMultipleSubmission, setIsAllowStudentForMultipleSubmission] = useState(false);
    const [isActive, setIsActive] = useState(false);


    // Pick document
    const pickDocument = async () => {
        let result = await DocumentPicker.getDocumentAsync({type:'*/*'});
        if (result?.assets[0]?.mimeType === 'application/pdf'){
            setSelectedFile(result);
            setStates({...states, errors:{...states.errors, attachment:''}});
        }else{
            console.log('Invalid file type. Only PDFs are allowed');
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
            if(!selectedSubject || !selectedClass || !data.title || !selectedFile || !data.assignment){
                setStates({...states, errors:{
                    subject:!selectedSubject ? '*Please select a subject' : '',
                    class_name:!selectedClass ? '*Please select a class' : '',
                    title:!data.title ? '*Please enter a title' : '',
                    attachment:!selectedFile ? '*Please upload a file' : '',
                    assignment:!data.assignment ? '*Please enter an assignment' : '',
                }});
                return;
            }


            // Upload pdf
            const pdfUploadResponse = await uploadFileToS3();


            // Api call
            const link = `${process.env.EXPO_PUBLIC_API_URL}/assignments/create`;
            const res = await axios.post(link, {creator:user.name, creator_image:user.image, subject:selectedSubject, class_name:selectedClass, title:data.title, assignment_date:assignmentDate, to_be_submitted_on:assignmentDate, attachment:pdfUploadResponse, assignment:data.assignment, is_allow_student_for_multiple_submission:isAllowStudentForMultipleSubmission, is_active:isActive});
            console.log(res.data);


            // Validations
            // if(res.data.adm_no === 'Wrong credentials.'){
            //     setIsError(true);
            //     setVisible(true);
            //     setStates({...states, loading:false});
            //     return;
            // };


            // Reseting
            setVisible(true);
            setStates({...states, loading:false});


        }catch(err){
            console.log(err);
        }
    };


    // Use effect
    useEffect(() => {
        setStates({...states, loadingData:true});
        const fetcher = async () => {

            // Subjects response
            const subjectsLink = `${process.env.EXPO_PUBLIC_API_URL}/subjects/names`;
            const subjectsRes = await axios.get(subjectsLink);
            const subjectsDropwdownData = subjectsRes.data.map(s => {
                return{
                    label:s.subject_name,
                    value:s.subject_name.toLowerCase()
                };
            });
            setSubjects(subjectsDropwdownData);


            // classes response
            const classesLink = `${process.env.EXPO_PUBLIC_API_URL}/classes/names`;
            const classesRes = await axios.get(classesLink);
            const classesDropdownData = classesRes.data.map(s => {
                return{
                    label:s.class_name,
                    value:s.class_name.toLowerCase()
                };
            });
            setClasses(classesDropdownData);


            // Setting loading to be false
            setStates({...states, loadingData:false});
        };
        fetcher();
    }, []);

    return (
        <View style={{height:'100%', alignItems:'center'}}>
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
            <ScrollView style={{width:'100%'}} contentContainerStyle={{alignItems:'center'}}>
                <View style={{width:'80%', gap:20, paddingVertical:50}}>
                    {states.loadingData ? (
                        <ActivityIndicator />
                    ) : (
                        <>


                            {/* Subject */}
                            <View style={{gap:6}}>
                                <Text>Subject</Text>
                                <Controller
                                    control={control}
                                    render={({field:{onChange, onBlur, value}}) => (
                                        <Dropdown
                                            placeholderStyle={{color:'gray', paddingLeft:10}}
                                            selectedTextStyle={{paddingLeft:10}}
                                            data={subjects}
                                            search
                                            activeColor='#ccc'
                                            labelField='label'
                                            valueField='value'
                                            placeholder='Select Subject'
                                            searchPlaceholder='Search...'
                                            value={value}
                                            onFocus={() => setOpenedField('subjects')}
                                            onBlur={() => setOpenedField('')}
                                            onChange={item => {setSelectedSubject(item.label);setStates({states, errors:{...states.errors, subject:!item.label  ? '*Please select a subject' : ''}})}}
                                            style={{backgroundColor:'#F5F5F8', height:60, paddingHorizontal:20, borderTopLeftRadius:5, borderTopRightRadius:5, borderBottomWidth:openedField === 'subjects' ? 2 : 1, borderBottomColor:openedField === 'subjects' ? '#0094DA' : 'gray'}}
                                            renderLeftIcon={() => (
                                                <Icon source='book-outline' color='gray' size={25}/>
                                            )}
                                        />
                                    )}
                                    name='subject'
                                />
                                {states.errors.subject !== '' && <Text style={{color:'red', marginTop:-6}}>{states.errors.subject}</Text>}
                            </View>


                            {/* Class */}
                            <View style={{gap:6}}>
                                <Text>Class</Text>
                                <Controller
                                    control={control}
                                    render={({field:{onChange, onBlur, value}}) => (
                                        <Dropdown
                                            placeholderStyle={{color:'gray', paddingLeft:10}}
                                            selectedTextStyle={{paddingLeft:10}}
                                            data={classes}
                                            search
                                            activeColor='#ccc'
                                            labelField='label'
                                            valueField='value'
                                            placeholder='Select Class'
                                            searchPlaceholder='Search...'
                                            value={value}
                                            onFocus={() => setOpenedField('classes')}
                                            onBlur={() => setOpenedField('')}
                                            onChange={item => {setSelectedClass(item.label);setStates({states, errors:{...states.errors, class_name:!item.label  ? '*Please select a class' : ''}})}}
                                            style={{backgroundColor:'#F5F5F8', height:60, paddingHorizontal:20, borderTopLeftRadius:5, borderTopRightRadius:5, borderBottomWidth:openedField === 'classes' ? 2 : 1, borderBottomColor:openedField === 'classes' ? '#0094DA' : 'gray'}}
                                            renderLeftIcon={() => (
                                                <Icon source='book-edit' color='gray' size={25}/>
                                            )}
                                        />
                                    )}
                                    name='class'
                                />
                                {states.errors.class_name !== '' && <Text style={{color:'red', marginTop:-6}}>{states.errors.class_name}</Text>}
                            </View>


                            {/* Title */}
                            <View style={{gap:6}}>
                                <Text>Title</Text>
                                <Controller
                                    control={control}
                                    render={({field:{onChange, onBlur, value}}) => (
                                        <PaperTextInput
                                            placeholder='Enter Title'
                                            onBlur={() => setStates({states, errors:{...states.errors, title:value === ''  ? '*Please enter a title' : ''}})}
                                            placeholderTextColor='gray'
                                            style={{backgroundColor:'#F5F5F8'}}
                                            left={<PaperTextInput.Icon icon='pencil-outline' size={30} color='gray'/>}
                                            value={value}
                                            onChangeText={onChange}
                                        />
                                    )}
                                    name='title'
                                />
                                {states.errors.title !== '' && <Text style={{color:'red', marginTop:-6}}>{states.errors.title}</Text>}
                            </View>


                            {/* Assignment Date */}
                            <View style={{gap:6}}>
                                <Text>Assignment Date</Text>
                                <TouchableOpacity
                                    onPress={() => setOpenedField('assignment_date')}
                                    style={{display:'flex', flexDirection:'row', alignItems:'center', backgroundColor:'#F5F5F8', height:60, paddingHorizontal:20, borderTopLeftRadius:5, borderTopRightRadius:5, borderBottomWidth:openedField === 'assignment_date' ? 2 : 1, borderBottomColor:openedField === 'assignment_date' ? '#0094DA' : 'gray'}}
                                >
                                    <Icon source='calendar' size={30} color='gray'/>
                                    <Text style={{marginLeft:10}}>{moment(assignmentDate).format('D-M-YYYY')}</Text>
                                </TouchableOpacity>
                                {openedField === 'assignment_date' && (
                                    <DateTimePicker
                                        mode='date'
                                        display='spinner'
                                        value={assignmentDate}
                                        onChange={(v, date) => {
                                            setOpenedField('');
                                            setAssignmentDate(date);
                                        }}
                                    />
                                )}
                            </View>


                            {/* Attachment */}
                            <View style={{gap:6}}>
                                <Text>Attachment</Text>
                                <TouchableOpacity
                                    onPress={pickDocument}
                                    style={{display:'flex', flexDirection:'row', alignItems:'center', backgroundColor:'#F5F5F8', height:60, paddingHorizontal:20, borderTopLeftRadius:5, borderTopRightRadius:5, borderBottomWidth:1, borderBottomColor:'gray'}}
                                >
                                    <Icon source='cloud-upload-outline' size={30} color='gray'/>
                                    <Text style={{marginLeft:10}}>{selectedFile ? selectedFile?.assets[0]?.name : 'Upload'}</Text>
                                </TouchableOpacity>
                                {states.errors.attachment !== '' && <Text style={{color:'red', marginTop:-6}}>{states.errors.attachment}</Text>}
                            </View>


                            {/* Assignment */}
                            <View style={{gap:6}}>
                                <Text>Assignment</Text>
                                <Controller
                                    control={control}
                                    render={({field:{onChange, onBlur, value}}) => (
                                        <PaperTextInput
                                            placeholder='Enter Assignment'
                                            onBlur={() => setStates({states, errors:{...states.errors, assignment:value === ''  ? '*Please enter an assignment' : ''}})}
                                            placeholderTextColor='gray'
                                            style={{backgroundColor:'#F5F5F8'}}
                                            left={<PaperTextInput.Icon icon='table-large' size={30} color='gray'/>}
                                            value={value}
                                            onChangeText={onChange}
                                        />
                                    )}
                                    name='assignment'
                                />
                                {states.errors.assignment !== '' && <Text style={{color:'red', marginTop:-6}}>{states.errors.assignment}</Text>}
                            </View>


                            {/* Allow Student For Multiple Submission */}
                            <View style={{display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
                                <Text>Allow Student For Multiple Submission</Text>
                                <Switch value={isAllowStudentForMultipleSubmission} onValueChange={setIsAllowStudentForMultipleSubmission} />
                            </View>


                            {/* Active */}
                            <View style={{display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
                                <Text>Active</Text>
                                <Switch value={isActive} onValueChange={setIsActive} />
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


                {/* Snackbar */}
                <Snackbar
                    style={{backgroundColor:'green'}}
                    visible={visible}
                    onDismiss={onDismissSnackBar}
                    action={{
                        label: <Icon source='close' color='#fff' size={20}/>,
                        onPress:() => setVisible(false)
                    }}
                >
                    Assignment Added Successfully!
                </Snackbar>


            </ScrollView>
        </View>
    );
};





// Export
export default CreateAssignment;
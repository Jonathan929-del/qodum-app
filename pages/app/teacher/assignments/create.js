// Imports
import axios from 'axios';
import moment from 'moment';
import {Buffer} from 'buffer';
import 'react-native-get-random-values';
import configs from '../../../../configs';
import * as FileSystem from 'expo-file-system';
import {useForm, Controller} from 'react-hook-form';
import {AuthContext} from '../../../../context/Auth';
import {useState, useEffect, useContext} from 'react';
import * as DocumentPicker from'expo-document-picker';
import Icon from 'react-native-vector-icons/Ionicons';
import {Dropdown} from 'react-native-element-dropdown';
import {S3Client, PutObjectCommand} from '@aws-sdk/client-s3';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Text, TouchableOpacity, View, ScrollView, Button} from 'react-native';
import {TextInput as PaperTextInput, ActivityIndicator, Snackbar, Switch} from 'react-native-paper';





// Main function
const CreateAssignment = ({navigation}) => {

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
            description:''
        },
        loading:false,
        loadingData:false
    });


    // Controller
    const {control, handleSubmit, reset} = useForm();


    // Opened dropdown
    const [openedField, setOpenedField] = useState('');


    // Values
    const [subjects, setSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState({label:'', value:''});
    const [classes, setClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState({label:'', value:''});
    const [assignmentDate, setAssignmentDate] = useState(new Date());
    const [lastDateOfSubmission, setLastDateOfSubmission] = useState(new Date());
    const [selectedFile, setSelectedFile] = useState();
    const [isAllowStudentForMultipleSubmission, setIsAllowStudentForMultipleSubmission] = useState(false);
    const [isActive, setIsActive] = useState(false);


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
            const result = await s3Client.send(command);
            return `https://${configs.EXPO_PUBLIC_AWS_BUCKET_NAME}.s3.amazonaws.com/assignments/${selectedFile?.assets[0].name}`;

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
            if(!selectedSubject || !selectedClass || !data.title || !selectedFile || !data.description){
                setStates({...states, errors:{
                    subject:!selectedSubject ? '*Please select a subject' : '',
                    class_name:!selectedClass ? '*Please select a class' : '',
                    title:!data.title ? '*Please enter a title' : '',
                    attachment:!selectedFile ? '*Please select a file' : '',
                    description:!data.description ? '*Please enter description' : '',
                }});
                return;
            };

            // Upload pdf
            const pdfUploadResponse = await uploadFileToS3();

            // Api call
            const link = `${configs.EXPO_PUBLIC_API_URL}/assignments/create`;
            const res = await axios.post(link, {creator:user.name, creator_image:user.image, creator_adm_no:user.adm_no, subject:selectedSubject.label, class_name:selectedClass.label, title:data.title, assignment_date:assignmentDate, last_date_of_submission:lastDateOfSubmission, attachment:pdfUploadResponse, description:data.description, is_allow_student_for_multiple_submission:isAllowStudentForMultipleSubmission, is_active:isActive});
            
            // Sending notification
            const params = {
                title:'New Assignment!',
                body:'A new assignment has been added!',
                topic:selectedClass.label,
                type:'assignment',
                assignment_id:res.data._id
            };
            const notificationLink = `${configs.EXPO_PUBLIC_API_URL}/notifications/send-notification`;
            await axios.post(notificationLink, params);

            // Reseting
            setVisible(true);
            setSelectedSubject({label:'', value:''});
            setSelectedClass({label:'', value:''});
            setAssignmentDate(new Date());
            setLastDateOfSubmission(new Date());
            setSelectedFile();
            setIsAllowStudentForMultipleSubmission(false);
            setIsActive(false);
            reset({
                title:'',
                description:''
            });
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
            const subjectsLink = `${configs.EXPO_PUBLIC_API_URL}/subjects/names`;
            const subjectsRes = await axios.get(subjectsLink);
            const subjectsDropwdownData = subjectsRes.data.map(s => {
                return{
                    label:s.subject_name,
                    value:s.subject_name.toLowerCase()
                };
            });
            setSubjects(subjectsDropwdownData);


            // classes response
            const classesLink = `${configs.EXPO_PUBLIC_API_URL}/classes/names`;
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
            <View style={{width:'100%',  display:'flex', flexDirection:'row', alignItems:'flex-end', justifyContent:'space-between', paddingHorizontal:10, paddingVertical:30, backgroundColor:'#0094DA', borderBottomRightRadius:40, borderBottomLeftRadius:40}}>
                <View style={{display:'flex', flexDirection:'row', alignItems:'center', gap:20}}>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('teacher-assignments')}
                    >
                        <Icon name='arrow-back-outline' size={35} color='#fff'/>
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
                                            value={selectedSubject}
                                            onFocus={() => setOpenedField('subjects')}
                                            onBlur={() => setOpenedField('')}
                                            onChange={item => {setSelectedSubject(item);setStates({states, errors:{...states.errors, subject:!item.label  ? '*Please select a subject' : ''}})}}
                                            style={{backgroundColor:'#F5F5F8', height:60, paddingHorizontal:20, borderTopLeftRadius:5, borderTopRightRadius:5, borderBottomWidth:openedField === 'subjects' ? 2 : 1, borderBottomColor:openedField === 'subjects' ? '#0094DA' : 'gray'}}
                                            renderLeftIcon={() => (
                                                <Icon name='book' color='gray' size={25}/>
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
                                            value={selectedClass}
                                            onFocus={() => setOpenedField('classes')}
                                            onBlur={() => setOpenedField('')}
                                            onChange={item => {setSelectedClass(item);setStates({states, errors:{...states.errors, class_name:!item.label  ? '*Please select a class' : ''}})}}
                                            style={{backgroundColor:'#F5F5F8', height:60, paddingHorizontal:20, borderTopLeftRadius:5, borderTopRightRadius:5, borderBottomWidth:openedField === 'classes' ? 2 : 1, borderBottomColor:openedField === 'classes' ? '#0094DA' : 'gray'}}
                                            renderLeftIcon={() => (
                                                <Icon name='bookmark' color='gray' size={25}/>
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
                                        <View style={{position:'relative'}}>
                                            <Icon name='pencil' size={30} color='gray' style={{position:'absolute', top:'25%', left:10, zIndex:2}}/>
                                            <PaperTextInput
                                                placeholder='Enter Title'
                                                onBlur={() => setStates({states, errors:{...states.errors, title:value === ''  ? '*Please enter a title' : ''}})}
                                                placeholderTextColor='gray'
                                                style={{paddingLeft:35, backgroundColor:'#F5F5F8'}}
                                                value={value}
                                                onChangeText={onChange}
                                            />
                                        </View>
                                    )}
                                    name='title'
                                />
                                {states.errors.title !== '' && <Text style={{color:'red', marginTop:-6}}>{states.errors.title}</Text>}
                            </View>


                            <View style={{display:'flex', flexDirection:'row', alignItems:'center', gap:10}}>
                                {/* Assignment Date */}
                                <View style={{gap:6}}>
                                    <Text>Assignment Date</Text>
                                    <TouchableOpacity
                                        onPress={() => setOpenedField('assignment_date')}
                                        style={{display:'flex', flexDirection:'row', alignItems:'center', backgroundColor:'#F5F5F8', height:60, paddingHorizontal:20, borderTopLeftRadius:5, borderTopRightRadius:5, borderBottomWidth:openedField === 'assignment_date' ? 2 : 1, borderBottomColor:openedField === 'assignment_date' ? '#0094DA' : 'gray'}}
                                    >
                                        <Icon name='calendar' size={30} color='gray'/>
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

                                {/* Last Date Of Submission */}
                                <View style={{gap:6}}>
                                    <Text>Last Date Of Submission</Text>
                                    <TouchableOpacity
                                        onPress={() => setOpenedField('last_date_of_submission_date')}
                                        style={{display:'flex', flexDirection:'row', alignItems:'center', backgroundColor:'#F5F5F8', height:60, paddingHorizontal:20, borderTopLeftRadius:5, borderTopRightRadius:5, borderBottomWidth:openedField === 'last_date_of_submission_date' ? 2 : 1, borderBottomColor:openedField === 'last_date_of_submission_date' ? '#0094DA' : 'gray'}}
                                    >
                                        <Icon name='calendar' size={30} color='gray'/>
                                        <Text style={{marginLeft:10}}>{moment(lastDateOfSubmission).format('D-M-YYYY')}</Text>
                                    </TouchableOpacity>
                                    {openedField === 'last_date_of_submission_date' && (
                                        <DateTimePicker
                                            mode='date'
                                            display='spinner'
                                            value={lastDateOfSubmission}
                                            onChange={(v, date) => {
                                                setOpenedField('');
                                                setLastDateOfSubmission(date);
                                            }}
                                        />
                                    )}
                                </View>
                            </View>


                            {/* Desription */}
                            <View style={{gap:6}}>
                                <Text>Description</Text>
                                <Controller
                                    control={control}
                                    render={({field:{onChange, onBlur, value}}) => (
                                        <View style={{position:'relative'}}>
                                            <Icon name='chatbox-ellipses' size={30} color='gray' style={{position:'absolute', top:10, left:10, zIndex:2}}/>
                                            <PaperTextInput
                                                placeholder='Enter Description'
                                                onBlur={() => setStates({states, errors:{...states.errors, description:value === ''  ? '*Please enter description' : ''}})}
                                                placeholderTextColor='gray'
                                                style={{paddingLeft:35, backgroundColor:'#F5F5F8'}}
                                                value={value}
                                                onChangeText={onChange}
                                                multiline
                                                numberOfLines={5}
                                            />
                                        </View>
                                    )}
                                    name='description'
                                />
                                {states.errors.description !== '' && <Text style={{color:'red', marginTop:-6}}>{states.errors.description}</Text>}
                            </View>


                            {/* Attachment */}
                            <View style={{gap:6}}>
                                <Text>Attachment</Text>
                                <TouchableOpacity
                                    onPress={pickDocument}
                                    style={{display:'flex', flexDirection:'row', alignItems:'center', backgroundColor:'#F5F5F8', height:60, paddingHorizontal:20, borderTopLeftRadius:5, borderTopRightRadius:5, borderBottomWidth:1, borderBottomColor:'gray'}}
                                >
                                    <Icon name='cloud-upload' size={30} color='gray'/>
                                    <Text style={{marginLeft:10}}>{selectedFile ? selectedFile?.assets[0]?.name : 'Upload'}</Text>
                                </TouchableOpacity>
                                {states.errors.attachment === '' ? <Text style={{color:'#0094DA', marginTop:-6}}>Supported file is .pdf. Maximum size is 5MB</Text> : <Text style={{color:'red', marginTop:-6}}>{states.errors.attachment}</Text>}
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
            </ScrollView>



            {/* Snackbar */}
            <Snackbar
                style={{backgroundColor:'green'}}
                visible={visible}
                onDismiss={onDismissSnackBar}
                action={{
                    label: <Icon name='close' color='#fff' size={20}/>,
                    onPress:() => setVisible(false)
                }}
            >
                Assignment Added Successfully!
            </Snackbar>

        </View>
    );
};





// Export
export default CreateAssignment;
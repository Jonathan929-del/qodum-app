// Imports
import axios from 'axios';
import configs from '../../configs';
import OtpInput from '../../utils/OtpInput';
import {AuthContext} from '../../context/Auth';
import {useContext, useEffect, useState} from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {Button, Snackbar, Icon, ActivityIndicator} from 'react-native-paper';





// Main functions
export default function App({navigation, route}) {


  // Context
  const {school, preLoginUser} = useContext(AuthContext);


  // Type
  const {type} = route.params;


  // Snack bar actions
  const [visible, setVisible] = useState(false);
  const onDismissSnackBar = () => setVisible(false);
  const [snackBarMessage, setSnackBarMessage] = useState('');


  // Is loading
  const [isLoading, setIsLoading] = useState(false);


  // Hide number function
  const hideNumber = number => '*'.repeat(Math.max(0, number?.toString().length - 2)) + number?.toString().slice(-2);


  // Seconds
  const [seconds, setSeconds] = useState(60);


  // Format seconds to display minutes and seconds
  const displaySeconds = seconds < 10 ? `0${seconds}` : seconds;


  // Text input
  const [otp, setOtp] = useState(['', '', '', '', '', '']);


  // Error
  const [error, setError] = useState(true);


  // Otp length error
  const [otpLengthError, setOtpLengthError] = useState(false);


  // Click handler
  const clickHandler = async () => {
    try {

      // API call
      setIsLoading(true);
      const link = type === 'student' ? `${configs.EXPO_PUBLIC_API_URL}/students/student/check-otp` : `${configs.EXPO_PUBLIC_API_URL}/teachers/teacher/check-otp`;
      const res = await axios.post(link, {the_otp:Number(otp.join(''))});
      

      // Validations
      if(res.data === 'OTP not provided'){
        setError('OTP not provided');
        setIsLoading(false);
        return;
      };
      if(res.data === 'OTP timeout'){
        setError('OTP timeout');
        setIsLoading(false);
        return;
      };
      if(res.data === "OTPs don't match"){
        setError("OTPs don't match");
        setIsLoading(false);
        return;
      };


      // Redirect to register page
      setSnackBarMessage('Checked Successfully');
      setVisible(true);
      setIsLoading(false);
      navigation.navigate('register', {type})

    } catch (err) {
      console.log(err);
    }
  };


  // Resend click handler
  const resendClickHandler = async () => {
    try {
      setIsLoading(true);
      const link = type === 'student' ? `${configs.EXPO_PUBLIC_API_URL}/students/student/send-otp` : `${configs.EXPO_PUBLIC_API_URL}/teachers/teacher/send-otp`;
      await axios.post(link, {adm_no:type === 'student' ? preLoginUser?.student?.adm_no : preLoginUser?.adm_no});
      setSnackBarMessage('Sent Successfully!');
      setVisible(true);
      setIsLoading(false);
      setSeconds(60);
    }catch(err){
      console.log(err);
    }
  };

  
  // Use effect
  useEffect(() => {
    const timer = setInterval(() => {
      if(seconds > 0){
        setSeconds(prevSeconds => prevSeconds - 1);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [seconds]);


  return (
    <View style={{height:'100%', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'space-evenly', paddingHorizontal:40}}>

      <Image
          style={{height:100, width:100}}
          source={{uri:school.logo}}
      />


      <View style={{height:'auto', gap:20}}>
        <Text style={{fontSize:20, fontWeight:'800', textAlign:'center'}}>OTP Authentication</Text>

        <Text style={{fontSize:16, color:'gray', textAlign:'center'}}>
            An authentication code has been sent to
            {hideNumber(type === 'student' ? preLoginUser?.student?.mobile : preLoginUser?.mobile)}
        </Text>
      </View>


      <View style={{height:'auto', gap:20}}>
        <OtpInput
          otp={otp}
          setOtp={setOtp}
          isError={otpLengthError}
        />


        {error && (
          <Text style={{color:'red', fontSize:14, textAlign:'center'}}>{error}</Text>
        )}


        <View style={{display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'center', gap:4}}>
          <Text>Didn't receive code?</Text>
            {displaySeconds == 0 ? (
              <TouchableOpacity
                  onPress={resendClickHandler}
              >
                  <Text style={{color:'#0094DA'}}>
                      Resend
                  </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity>
                  <Text style={{color:'#0094DA'}}>
                      Resend ({displaySeconds})
                  </Text>
              </TouchableOpacity>
            )}
        </View>
      </View>


      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <Button
            mode='outlined'
            textColor='#0094DA'
            style={{width:'100%', borderRadius:4, borderColor:'#0094DA'}}
            onPress={() => {
              otp.filter(o => o !== '').length < 6
                ?
                  setOtpLengthError(true)
                :
                  clickHandler()
            }}
        >
            Continue
        </Button>
      )}

      <Snackbar
        visible={visible}
        style={{backgroundColor:'green'}}
        onDismiss={onDismissSnackBar}
        action={{
            label: <Icon source='close' color='#fff' size={20}/>,
            onPress:() => setVisible(false)
        }}
      >
        {snackBarMessage}
      </Snackbar>

    </View>
  );
};
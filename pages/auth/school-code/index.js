// Imports
import axios from 'axios';
import FindSchool from './find-code';
import configs from '../../../configs';
import OtpInput from '../../../utils/OtpInput';
import {AuthContext} from '../../../context/Auth';
import {useContext, useEffect, useState} from 'react';
import {ActivityIndicator, Button} from 'react-native-paper';
import {Image, Text, TouchableOpacity, View} from 'react-native';





// Main functions
export default function App({navigation}) {


  // Context
  const {school, schoolLogin} = useContext(AuthContext);


  // Is find school opened
  const [isFindSchoolOpened, setIsFindSchoolOpened] = useState(false);


  // Text input
  const [otp, setOtp] = useState(['', '', '', '', '', '']);


  // Is error
  const [isError, setIsError] = useState(false);


  // Is loading
  const [isLoading, setIsLoading] = useState(false);


  // Is school found
  const [isSchoolFound, setIsSchoolFound] = useState(true);


  // Click handler
  const clickHandler = async () => {
    try {
      setIsLoading(true);
      const url = `${configs.EXPO_PUBLIC_API_URL}/schools/school`;
      const res = await axios.post(url, {school_no:otp.join('')});
      if(res.data === 'Not found'){
        setIsSchoolFound(false);
        setIsLoading(false);
      }else{
        setIsSchoolFound(true);
        schoolLogin(res.data);
        setTimeout(() => {
          setIsLoading(false);
          navigation.navigate('welcome');
        }, 500);
      };
    } catch (err) {
      console.log(err);
    }
  };


  // Use effect
  useEffect(() => {

    // School auth redirection
    if (school) navigation.navigate('welcome');
  
  }, []);


  return (
    <View style={{height:'100%', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'space-evenly', paddingHorizontal:40}}>

      {/* Find School */}
      <FindSchool
        isFindSchoolOpened={isFindSchoolOpened}
        setIsFindSchoolOpened={setIsFindSchoolOpened}
      />


      <Image
          style={{height:100, width:200}}
          source={require('../../../assets/logo.png')}
      />


      <View style={{height:'auto', gap:20}}>
        <Text style={{fontSize:20, fontWeight:'800'}}>School or College Code</Text>

        <Text style={{fontSize:16, color:'gray', textAlign:'center'}}>
            Please enter your code
        </Text>
      </View>


      <View style={{height:'auto', gap:20}}>
        <OtpInput
          otp={otp}
          setOtp={setOtp}
          isError={isError}
        />


        {!isSchoolFound && (
          <Text style={{color:'red', fontSize:14}}>The School/College Code is not registered with us. Kindly check again.</Text>
        )}


        <View style={{display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'center', gap:4}}>
          <Text>Find your</Text>
            <TouchableOpacity
                onPress={() => setIsFindSchoolOpened(true)}
            >
                <Text style={{color:'#0094DA'}}>
                    School or college code
                </Text>
            </TouchableOpacity>
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
                  setIsError(true)
                :
                  clickHandler()
            }}
        >
            Continue
        </Button>
      )}

    </View>
  );
};
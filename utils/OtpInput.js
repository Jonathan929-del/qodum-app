// Imports
import {useState, useRef} from 'react';
import {View, TextInput} from 'react-native';





// Main function
const OtpInput = ({otp, setOtp, isError}) => {

    // States
    const [focusedIndex, setFocusedIndex] = useState(0);
    const otpInputs = useRef([]);


    // Handle OTP input change
    const handleOtpChange = (text, index) => {
        const newOtp = [...otp];
        newOtp[index] = text;
        setOtp(newOtp);
        if (text && index < otp.length - 1) {
            otpInputs.current[index + 1].focus();
        }
    };


    // Handle backspace press
    const handleBackspacePress = (event, index) => {
            if(event.nativeEvent.key === 'Backspace'){
            if (otp[index] && index > 0){
                handleOtpChange('', index);
            }else if(!otp[index] && index > 0){
                otpInputs.current[index - 1].focus();
                handleOtpChange('', index - 1);
            }
        };
    };


    // Handle focus on OTP input
    const handleFocus = index => {
        setFocusedIndex(index);
    };


    // Render OTP input fields
    const renderOtpInputs = () => {
        return otp.map((value, index) => (
        <TextInput
            key={index}
            style={[
                {width:45, height:45, borderWidth:1, borderColor:'gray', textAlign:'center', fontSize:18, marginHorizontal:5, borderRadius:4},
                focusedIndex === index && {borderColor:isError ? 'red' : '#0094DA'}
            ]}
            maxLength={1}
            keyboardType='numeric'
            value={value}
            onChangeText={text => handleOtpChange(text, index)}
            onKeyPress={event => handleBackspacePress(event, index)}
            onFocus={() => handleFocus(index)}
            ref={ref => (otpInputs.current[index] = ref)}
        />
        ));
    };


    return (
        <View style={{flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
            {renderOtpInputs()}
        </View>
    );
};





// Export
export default OtpInput;
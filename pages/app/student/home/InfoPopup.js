// Imports
import moment from 'moment';
import {AuthContext} from '../../../../context/Auth';
import {useContext, useState, useEffect} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import {Text, TouchableOpacity, View, Animated, TouchableWithoutFeedback, Dimensions, Image} from 'react-native';





// Main function
const InfoPopup = ({isInfoPopupOpened, setIsInfoPopupOpened}) => {


    // Context
    const {user} = useContext(AuthContext);


    // Fade animation
    const [fadeAnim] = useState(new Animated.Value(0));


    // Use effect
    useEffect(() => {
        if (isInfoPopupOpened) {
        Animated.timing(fadeAnim, {
            toValue:1,
            duration:200,
            useNativeDriver:true
        }).start();
        }else{
        Animated.timing(fadeAnim, {
            toValue:0,
            duration:200,
            useNativeDriver:true
        }).start();
        }
    }, [isInfoPopupOpened]);


    return (
        <Animated.View
            style={{position:'absolute', width:'100%', height:Dimensions.get('screen').height, zIndex:10, backgroundColor:'rgba(0, 0, 0, 0.5)', opacity:fadeAnim}}
        >
            <TouchableWithoutFeedback
                onPress={() => setIsInfoPopupOpened(false)}
            >
                <View style={{height:'100%', width:'100%', alignItems:'center', justifyContent:'center'}}>
                    <Text>-</Text>
                    <TouchableWithoutFeedback onPress={() => setIsInfoPopupOpened(true)}>

                        <View style={{display:'flex', flexDirection:'column', gap:15, marginHorizontal:30, marginVertical:20, borderRadius:10, width:'80%', borderRadius:10, backgroundColor:'#fff'}}>

                            {/* Header */}
                            <View style={{width:'100%', display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'space-between', paddingVertical:10, paddingHorizontal:16, borderTopLeftRadius:10, borderTopRightRadius:10, backgroundColor:'#0094DA'}}>
                                <Text style={{textAlign:'center', fontSize:16, color:'#fff'}}>
                                    Info
                                </Text>
                                <TouchableOpacity onPress={() => setIsInfoPopupOpened(false)}>
                                    <Icon name='close-outline' color='#fff' size={20}/>
                                </TouchableOpacity>
                            </View>


                            {/* Data */}
                            <View style={{display:'flex', flexDirection:'column', gap:6, paddingHorizontal:10, paddingBottom:10}}>
                                <View style={{display:'flex', flexDirection:'row', alignItems:'center', gap:20}}>

                                    {/* Image */}
                                    {user?.student?.image ? (
                                    <Image
                                        width={70}
                                        height={70}
                                        source={{uri:user?.student?.image}}
                                        style={{borderRadius:10, borderWidth:1, borderColor:'#4F58CF'}}
                                    />
                                    ) : (
                                    <View style={{height:70, width:70, alignItems:'center', justifyContent:'center', borderRadius:10, borderWidth:1, borderColor:'#ccc'}}>
                                        <Text>No Photo</Text>
                                    </View>
                                    )}


                                    <View style={{display:'flex', flexDirection:'column', gap:10}}>
                                    {/* Name */}
                                    {user?.student?.name && (
                                        <View style={{display:'flex', flexDirection:'row', alignItems:'center', gap:2}}>
                                        <Text style={{fontSize:14}}>Name: </Text>
                                        <Text style={{color:'gray', fontSize:14}}>{user?.student?.name}</Text>
                                        </View>
                                    )}

                                    {/* DOB */}
                                    {user?.student?.dob && (
                                        <View style={{display:'flex', flexDirection:'row', alignItems:'center', gap:2}}>
                                        <Text style={{fontSize:14}}>DOB: </Text>
                                        <Text style={{color:'gray', fontSize:14}}>{moment(user?.student?.dob).format('D-M-YYYY')}</Text>
                                        </View>
                                    )}
                                    </View>
                                </View>


                                {/* Class */}
                                {user?.student?.class_name && (
                                    <View style={{display:'flex', flexDirection:'row', alignItems:'center', gap:2}}>
                                    <Text style={{fontSize:14}}>Class: </Text>
                                    <Text style={{color:'gray', fontSize:14}}>{user?.student?.class_name}</Text>
                                    </View>
                                )}


                                {/* Admission No. */}
                                {user?.adm_no && (
                                    <View style={{display:'flex', flexDirection:'row', alignItems:'center', gap:2}}>
                                    <Text style={{fontSize:14}}>Admission No.: </Text>
                                    <Text style={{color:'gray', fontSize:14}}>{user?.adm_no}</Text>
                                    </View>
                                )}


                                {/* Roll No. */}
                                {user?.student?.roll_no && (
                                    <View style={{display:'flex', flexDirection:'row', alignItems:'center', gap:2}}>
                                    <Text style={{fontSize:14}}>Roll No.: </Text>
                                    <Text style={{color:'gray', fontSize:14}}>{user?.student?.roll_no}</Text>
                                    </View>
                                )}


                                {/* Blood Group */}
                                {user?.student?.blood_group && (
                                    <View style={{display:'flex', flexDirection:'row', alignItems:'center', gap:2}}>
                                    <Text style={{fontSize:14}}>Blood Group: </Text>
                                    <Text style={{color:'gray', fontSize:14}}>{user?.student?.blood_group}</Text>
                                    </View>
                                )}


                                {/* House */}
                                {user?.student?.house && (
                                    <View style={{display:'flex', flexDirection:'row', alignItems:'center', gap:2}}>
                                    <Text style={{fontSize:14}}>House: </Text>
                                    <Text style={{color:'gray', fontSize:14}}>{user?.student?.house}</Text>
                                    </View>
                                )}


                                {/* Aadhar Card No. */}
                                {user?.student?.aadhar_card_no !== undefined && (
                                    <View style={{display:'flex', flexDirection:'row', alignItems:'center', gap:2}}>
                                    <Text style={{fontSize:14}}>Aadhar Card No.: </Text>
                                    <Text style={{color:'gray', fontSize:14}}>{user?.student?.aadhar_card_no}</Text>
                                    </View>
                                )}


                                {/* PEN */}
                                {user?.student?.pen_no && (
                                    <View style={{display:'flex', flexDirection:'row', alignItems:'center', gap:2}}>
                                    <Text style={{fontSize:14}}>PEN: </Text>
                                    <Text style={{color:'gray', fontSize:14}}>{user?.student?.pen_no}</Text>
                                    </View>
                                )}

                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Animated.View>
    );
};





// Export
export default InfoPopup
// Imports
import moment from 'moment';
import {AuthContext} from '../../../../context/Auth';
import Icon from 'react-native-vector-icons/Ionicons';
import {useContext, useState, useEffect} from 'react';
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
                            <View style={{width:'100%', display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'space-between', paddingVertical:10, paddingHorizontal:12, borderTopLeftRadius:10, borderTopRightRadius:10, backgroundColor:'#0094DA'}}>
                                <Text style={{textAlign:'center', fontSize:12, color:'#fff'}}>
                                    Info
                                </Text>
                                <TouchableOpacity onPress={() => setIsInfoPopupOpened(false)}>
                                    <Icon name='close' color='#fff' size={20}/>
                                </TouchableOpacity>
                            </View>


                            {/* Data */}
                            <View style={{display:'flex', flexDirection:'column', gap:6, paddingHorizontal:10, paddingBottom:10}}>
                                <View style={{display:'flex', flexDirection:'row', alignItems:'center', gap:20}}>

                                    {/* Image */}
                                    {user?.image ? (
                                        <Image
                                            width={70}
                                            height={70}
                                            source={{uri:user?.image}}
                                            style={{borderRadius:10, borderWidth:1, borderColor:'#4F58CF'}}
                                        />
                                    ) : (
                                        <View style={{width:70, height:70, display:'flex', alignItems:'center', justifyContent:'center', borderRadius:10, borderWidth:1, borderColor:'#4F58CF'}}>
                                            <Text style={{fontSize:8}}>No Photo</Text>
                                        </View>
                                    )}


                                    <View style={{display:'flex', flexDirection:'column', gap:10}}>
                                        {/* Name */}
                                        {user?.name && (
                                            <View style={{display:'flex', flexDirection:'row', alignItems:'center', gap:2}}>
                                            <Text style={{fontSize:12}}>Name: </Text>
                                            <Text style={{color:'gray', fontSize:12}}>{user?.name}</Text>
                                            </View>
                                        )}

                                        {/* DOB */}
                                        {user?.dob && (
                                            <View style={{display:'flex', flexDirection:'row', alignItems:'center', gap:2}}>
                                            <Text style={{fontSize:12}}>DOB: </Text>
                                            <Text style={{color:'gray', fontSize:12}}>{moment(user?.dob).format('D-M-YYYY')}</Text>
                                            </View>
                                        )}
                                    </View>
                                </View>


                                {/* Class */}
                                {user?.class_name && (
                                    <View style={{display:'flex', flexDirection:'row', alignItems:'center', gap:2}}>
                                        <Text style={{fontSize:12}}>Class: </Text>
                                        <Text style={{color:'gray', fontSize:12}}>{user?.class_name}</Text>
                                    </View>
                                )}


                                {/* Admission No. */}
                                {user?.adm_no && (
                                    <View style={{display:'flex', flexDirection:'row', alignItems:'center', gap:2}}>
                                        <Text style={{fontSize:12}}>Admission No.: </Text>
                                        <Text style={{color:'gray', fontSize:12}}>{user?.adm_no}</Text>
                                    </View>
                                )}


                                {/* House */}
                                {user?.address && (
                                    <View style={{display:'flex', flexDirection:'row', alignItems:'center', gap:2}}>
                                        <Text style={{fontSize:12}}>House: </Text>
                                        <Text style={{color:'gray', fontSize:12}}>{user?.address}</Text>
                                    </View>
                                )}


                                {/* Aadhar Card No. */}
                                {user?.aadhar_card_no && (
                                    <View style={{display:'flex', flexDirection:'row', alignItems:'center', gap:2}}>
                                        <Text style={{fontSize:12}}>Aadhar Card No.: </Text>
                                        <Text style={{color:'gray', fontSize:12}}>{user?.aadhar_card_no}</Text>
                                    </View>
                                )}

                                {/* DOA */}
                                {user?.doa && (
                                    <View style={{display:'flex', flexDirection:'row', alignItems:'center', gap:2}}>
                                        <Text style={{fontSize:12}}>DOA: </Text>
                                        <Text style={{color:'gray', fontSize:12}}>{moment(user?.doa).format('D-M-YYYY')}</Text>
                                    </View>
                                )}

                                {/* Marital Status */}
                                {user?.marital_status && (
                                    <View style={{display:'flex', flexDirection:'row', alignItems:'center', gap:2}}>
                                        <Text style={{fontSize:12}}>Marital Status: </Text>
                                        <Text style={{color:'gray', fontSize:12}}>{user.marital_status}</Text>
                                    </View>
                                )}

                                {/* Alternate Mobile */}
                                {user?.contact_nos[1] && (
                                    <View style={{display:'flex', flexDirection:'row', alignItems:'center', gap:2}}>
                                        <Text style={{fontSize:12}}>Alternate Mobile: </Text>
                                        <Text style={{color:'gray', fontSize:12}}>{user.contact_nos[1]}</Text>
                                    </View>
                                )}

                                {/* Alternate Email */}
                                {user?.alternate_email && (
                                    <View style={{display:'flex', flexDirection:'row', alignItems:'center', gap:2}}>
                                        <Text style={{fontSize:12}}>Alternate Email: </Text>
                                        <Text style={{color:'gray', fontSize:12}}>{user.alternate_email}</Text>
                                    </View>
                                )}

                                {/* Permenant Address */}
                                {user?.permenant_address && (
                                    <View style={{display:'flex', flexDirection:'row', alignItems:'center', gap:2}}>
                                        <Text style={{fontSize:12}}>Permenant Address: </Text>
                                        <Text style={{color:'gray', fontSize:12}}>{user.permenant_address}</Text>
                                    </View>
                                )}

                                {/* DOJ */}
                                {user?.doj && (
                                    <View style={{display:'flex', flexDirection:'row', alignItems:'center', gap:2}}>
                                        <Text style={{fontSize:12}}>DOJ: </Text>
                                        <Text style={{color:'gray', fontSize:12}}>{moment(user?.doj).format('D-M-YYYY')}</Text>
                                    </View>
                                )}

                                {/* Mobile */}
                                {user?.mobile && (
                                    <View style={{display:'flex', flexDirection:'row', alignItems:'center', gap:2}}>
                                        <Text style={{fontSize:12}}>Mobile: </Text>
                                        <Text style={{color:'gray', fontSize:12}}>{user.mobile}</Text>
                                    </View>
                                )}

                                {/* Email ID */}
                                {user?.email && (
                                    <View style={{display:'flex', flexDirection:'row', alignItems:'center', gap:2}}>
                                        <Text style={{fontSize:12}}>Email ID: </Text>
                                        <Text style={{color:'gray', fontSize:12}}>{user.email}</Text>
                                    </View>
                                )}

                                {/* Nationality */}
                                {user?.nationality && (
                                    <View style={{display:'flex', flexDirection:'row', alignItems:'center', gap:2}}>
                                        <Text style={{fontSize:12}}>Nationality: </Text>
                                        <Text style={{color:'gray', fontSize:12}}>{user.nationality}</Text>
                                    </View>
                                )}

                                {/* Qualification */}
                                {user?.qualification && (
                                    <View style={{display:'flex', flexDirection:'row', alignItems:'center', gap:2}}>
                                        <Text style={{fontSize:12}}>Qualification: </Text>
                                        <Text style={{color:'gray', fontSize:12}}>{user.qualification}</Text>
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
// Imports
import moment from 'moment';
import Icon from 'react-native-vector-icons/Ionicons';
import {useContext, useState} from 'react';
import MoreInfo from '../../../../utils/MoreInfo';
import {AuthContext} from '../../../../context/Auth';
import {Dimensions, Image, ScrollView, Text, TouchableOpacity, View} from 'react-native';





// Main functions
const page = ({navigation}) => {


  // Student
  const {user, school} = useContext(AuthContext);
  

  // Is info opened
  const [isInfoOpened, setIsInfoOpened] = useState(false);


  return (
    <ScrollView>
      <View style={{flex:1}}>
      
        {/* Info pop up */}
        {isInfoOpened && (
          <MoreInfo
            navigation={navigation}
            isInfoOpened={isInfoOpened}
            setIsInfoOpened={setIsInfoOpened}
          />
        )}


        <View style={{position:'relative', flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:-40}}>
          <View style={{height:250, width:'100%', position:'relative', display:'flex', alignItems:'center', justifyContent:'center', backgroundColor:'#ccc'}}>

            {/* Background image */}
            {user.student.background_image ? (
              <Image
                source={{uri:user.student.background_image}}
                style={{width:'100%', height:'100%'}}
              />
            ) : (
              <View style={{display:'flex', flexDirection:'column', alignItems:'center', gap:4}}>
                <Text>No backgroud image</Text>
                <TouchableOpacity onPress={() => console.log('Preseed')}><Text style={{color:'#0094DA'}}>Add image</Text></TouchableOpacity>
              </View>
            )}


            {/* Info icon */}
            <TouchableOpacity
              onPress={() => setIsInfoOpened(true)}
              style={{position:'absolute', top:Dimensions.get('screen').height / 16, right:20, width:30, height:30, alignItems:'center', justifyContent:'center', backgroundColor:'#fff', borderRadius:50}}
            >
              <Icon name='information-circle-outline' color='gray' size={30}/>
            </TouchableOpacity>

          </View>


          <View style={{width:'100%', display:'flex', flexDirection:'column', gap:10, borderTopRightRadius:40, borderTopLeftRadius:40, backgroundColor:'#fff', marginTop:-50}}>
            <View style={{display:'flex', flexDirection:'row', alignItems:'flex-start', justifyContent:'space-between', marginHorizontal:30, marginVertical:20, paddingBottom:10, borderBottomWidth:1, borderBottomColor:'#ccc'}}>
              <View style={{display:'flex', flexDirection:'column', height:'100%', gap:6, justifyContent:'flex-start'}}>

                {/* Student name */}
                <Text style={{fontSize:18, fontWeight:'600'}}>{user.student.name}</Text>

                {/* Student */}
                <View style={{display:'flex', flexDirection:'row', alignItems:'center', gap:2}}>
                  <Icon name='person-outline' color='#8A8A8A' size={20}/>
                  <Text style={{color:'#8A8A8A'}}>Student</Text>
                </View>


                {/* Address */}
                {user?.student?.h_no_and_streets && (
                  <View style={{display:'flex', flexDirection:'row', alignItems:'center', gap:2}}>
                    <Icon name='location-outline' color='#8A8A8A' size={20}/>
                    <Text style={{color:'#8A8A8A'}}>{user?.student?.h_no_and_streets}</Text>
                  </View>
                )}

                {/* Mobile */}
                {user?.student?.mobile && (
                  <View style={{display:'flex', flexDirection:'row', alignItems:'center', gap:2}}>
                    <Icon name='call-outline' color='#8A8A8A' size={20}/>
                    <Text style={{color:'#8A8A8A'}}>{user?.student?.mobile}</Text>
                  </View>
                )}
              </View>


              {school?.logo ? (
                <View style={{alignItems:'center', justifyContent:'center', borderRadius:100, height:100, width:100, borderWidth:1, borderColor:'#000', marginTop:-75, backgroundColor:'#fff', padding:15}}>
                  <Image
                      source={{uri:school?.logo}}
                      style={{height:'100%', width:'100%'}}
                  />
                </View>
              ) : (
                  <View style={{width:100, height:100, display:'flex', alignItems:'center', justifyContent:'center', marginTop:-75, backgroundColor:'#fff', borderRadius:100, borderWidth:0.5, borderColor:'#000'}}>
                    <TouchableOpacity>
                      <Text style={{fontSize:11}}>No image</Text>
                    </TouchableOpacity>
                  </View>
              )}

            </View>

            <View style={{display:'flex', flexDirection:'column', gap:15, marginHorizontal:30, marginVertical:20, borderRadius:10, borderWidth:1, borderColor:'#ccc'}}>

              {/* Header */}
              <Text style={{width:'100%', textAlign:'center', paddingVertical:8, fontSize:16, backgroundColor:'#D9DFEF', color:'#4F58CF', borderTopLeftRadius:10, borderTopRightRadius:10}}>
                Others Details
              </Text>


              {/* Data */}
              <View style={{display:'flex', flexDirection:'column', gap:10, paddingHorizontal:10, paddingBottom:10}}>


                <View style={{display:'flex', flexDirection:'row', alignItems:'center', gap:20}}>

                  {/* Image */}
                  {user?.student?.image ? (
                    <Image
                      width={100}
                      height={100}
                      source={{uri:user?.student?.image}}
                      style={{borderRadius:10, borderWidth:1, borderColor:'#4F58CF'}}
                    />
                  ) : (
                    <View style={{height:100, width:100, alignItems:'center', justifyContent:'center', borderRadius:10, borderWidth:1, borderColor:'#ccc'}}>
                      <Text>No Photo</Text>
                    </View>
                  )}


                  <View style={{display:'flex', flexDirection:'column', gap:10}}>
                    {/* Name */}
                    {user?.student?.name && (
                      <View style={{display:'flex', flexDirection:'row', alignItems:'center', gap:2}}>
                        <Text style={{fontSize:16}}>Name: </Text>
                        <Text style={{color:'gray', fontSize:16}}>{user?.student?.name}</Text>
                      </View>
                    )}

                    {/* DOB */}
                    {user?.student?.dob && (
                      <View style={{display:'flex', flexDirection:'row', alignItems:'center', gap:2}}>
                        <Text style={{fontSize:16}}>DOB: </Text>
                        <Text style={{color:'gray', fontSize:16}}>{moment(user?.student?.dob).format('D-M-YYYY')}</Text>
                      </View>
                    )}
                  </View>
                </View>


                {/* Class */}
                {user?.student?.class_name && (
                  <View style={{display:'flex', flexDirection:'row', alignItems:'center', gap:2}}>
                    <Text style={{fontSize:16}}>Class: </Text>
                    <Text style={{color:'gray', fontSize:16}}>{user?.student?.class_name}</Text>
                  </View>
                )}


                {/* Admission No. */}
                {user?.adm_no && (
                  <View style={{display:'flex', flexDirection:'row', alignItems:'center', gap:2}}>
                    <Text style={{fontSize:16}}>Admission No.: </Text>
                    <Text style={{color:'gray', fontSize:16}}>{user?.adm_no}</Text>
                  </View>
                )}


                {/* Roll No. */}
                {user?.student?.roll_no && (
                  <View style={{display:'flex', flexDirection:'row', alignItems:'center', gap:2}}>
                    <Text style={{fontSize:16}}>Roll No.: </Text>
                    <Text style={{color:'gray', fontSize:16}}>{user?.student?.roll_no}</Text>
                  </View>
                )}


                {/* Blood Group */}
                {user?.student?.blood_group && (
                  <View style={{display:'flex', flexDirection:'row', alignItems:'center', gap:2}}>
                    <Text style={{fontSize:16}}>Blood Group: </Text>
                    <Text style={{color:'gray', fontSize:16}}>{user?.student?.blood_group}</Text>
                  </View>
                )}


                {/* House */}
                {user?.student?.house && (
                  <View style={{display:'flex', flexDirection:'row', alignItems:'center', gap:2}}>
                    <Text style={{fontSize:16}}>House: </Text>
                    <Text style={{color:'gray', fontSize:16}}>{user?.student?.house}</Text>
                  </View>
                )}


                {/* Aadhar Card No. */}
                {user?.student?.aadhar_card_no !== undefined && (
                  <View style={{display:'flex', flexDirection:'row', alignItems:'center', gap:2}}>
                    <Text style={{fontSize:16}}>Aadhar Card No.: </Text>
                    <Text style={{color:'gray', fontSize:16}}>{user?.student?.aadhar_card_no}</Text>
                  </View>
                )}


                {/* PEN */}
                {user?.student?.pen_no && (
                  <View style={{display:'flex', flexDirection:'row', alignItems:'center', gap:2}}>
                    <Text style={{fontSize:16}}>PEN: </Text>
                    <Text style={{color:'gray', fontSize:16}}>{user?.student?.pen_no}</Text>
                  </View>
                )}
              </View>


            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};





// Export
export default page;
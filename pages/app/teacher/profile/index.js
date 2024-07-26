// Imports
import moment from 'moment';
import {useContext, useState} from 'react';
import MoreInfo from '../../../../utils/MoreInfo';
import {AuthContext} from '../../../../context/Auth';
import Icon from 'react-native-vector-icons/Ionicons';
import {Dimensions, Image, ScrollView, Text, TouchableOpacity, View} from 'react-native';





// Main functions
const TeacherProfile = ({navigation}) => {


  // User
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

        <View style={{position:'relative', flex:1, display:'flex', flexDirection:'column', alignItems:'center'}}>
          <View style={{height:250, width:'100%', position:'relative', display:'flex', alignItems:'center', justifyContent:'center', backgroundColor:'#ccc'}}>

            {/* Background image */}
            {user.background_image ? (
              <Image
                source={{uri:user.background_image}}
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
              <Icon name='information-circle' color='gray' size={30}/>
            </TouchableOpacity>

          </View>


          <View style={{width:'100%', display:'flex', flexDirection:'column', gap:10, borderTopRightRadius:40, borderTopLeftRadius:40, backgroundColor:'#fff', marginTop:-50}}>
            <View style={{display:'flex', flexDirection:'row', alignItems:'flex-start', justifyContent:'space-between', marginHorizontal:30, marginVertical:20, paddingBottom:10, borderBottomWidth:1, borderBottomColor:'#ccc'}}>
              <View style={{display:'flex', flexDirection:'column', height:'100%', gap:6, justifyContent:'flex-start'}}>

                {/* Teacher name */}
                <Text style={{fontSize:18, fontWeight:'600'}}>{user.name}</Text>

                {/* Teacher */}
                <View style={{display:'flex', flexDirection:'row', alignItems:'center', gap:2}}>
                  <Icon name='person' color='#8A8A8A' size={20}/>
                  <Text style={{color:'#8A8A8A'}}>Teacher</Text>
                </View>


                {/* Address */}
                {user?.address && (
                  <View style={{display:'flex', flexDirection:'row', alignItems:'center', gap:2}}>
                    <Icon name='location' color='#8A8A8A' size={20}/>
                    <Text style={{color:'#8A8A8A'}}>{user?.address}</Text>
                  </View>
                )}

                {/* Mobile */}
                {user?.mobile && (
                  <View style={{display:'flex', flexDirection:'row', alignItems:'center', gap:2}}>
                    <Icon name='call' color='#8A8A8A' size={20}/>
                    <Text style={{color:'#8A8A8A'}}>{user?.mobile}</Text>
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
                  <Image
                    width={100}
                    height={100}
                    source={{uri:user?.image}}
                    style={{borderRadius:10, borderWidth:1, borderColor:'#4F58CF'}}
                  />


                  <View style={{display:'flex', flexDirection:'column', gap:10}}>
                    {/* Name */}
                    {user?.name && (
                      <View style={{display:'flex', flexDirection:'row', alignItems:'center', gap:2}}>
                        <Text style={{fontSize:16}}>Name: </Text>
                        <Text style={{color:'gray', fontSize:16}}>{user?.name}</Text>
                      </View>
                    )}

                    {/* DOB */}
                    {user?.dob && (
                      <View style={{display:'flex', flexDirection:'row', alignItems:'center', gap:2}}>
                        <Text style={{fontSize:16}}>DOB: </Text>
                        <Text style={{color:'gray', fontSize:16}}>{moment(user?.dob).format('D-M-YYYY')}</Text>
                      </View>
                    )}
                  </View>
                </View>


                {/* Class */}
                {user?.class_name && (
                  <View style={{display:'flex', flexDirection:'row', alignItems:'center', gap:2}}>
                    <Text style={{fontSize:16}}>Class: </Text>
                    <Text style={{color:'gray', fontSize:16}}>{user?.class_name}</Text>
                  </View>
                )}


                {/* Admission No. */}
                {user?.adm_no && (
                  <View style={{display:'flex', flexDirection:'row', alignItems:'center', gap:2}}>
                    <Text style={{fontSize:16}}>Admission No.: </Text>
                    <Text style={{color:'gray', fontSize:16}}>{user?.adm_no}</Text>
                  </View>
                )}


                {/* House */}
                {user?.permenant_address && (
                  <View style={{display:'flex', flexDirection:'row', alignItems:'center', gap:2}}>
                    <Text style={{fontSize:16}}>House: </Text>
                    <Text style={{color:'gray', fontSize:16}}>{user?.permenant_address}</Text>
                  </View>
                )}


                {/* Aadhar Card No. */}
                {user?.aadhar_card_no && (
                  <View style={{display:'flex', flexDirection:'row', alignItems:'center', gap:2}}>
                    <Text style={{fontSize:16}}>Aadhar Card No.: </Text>
                    <Text style={{color:'gray', fontSize:16}}>{user?.aadhar_card_no}</Text>
                  </View>
                )}

                {/* DOA */}
                {user?.doa && (
                  <View style={{display:'flex', flexDirection:'row', alignItems:'center', gap:2}}>
                    <Text style={{fontSize:16}}>DOA: </Text>
                    <Text style={{color:'gray', fontSize:16}}>{moment(user?.doa).format('D-M-YYYY')}</Text>
                  </View>
                )}

                {/* Marital Status */}
                {user?.marital_status && (
                  <View style={{display:'flex', flexDirection:'row', alignItems:'center', gap:2}}>
                    <Text style={{fontSize:16}}>Marital Status: </Text>
                    <Text style={{color:'gray', fontSize:16}}>{user.marital_status}</Text>
                  </View>
                )}

                {/* Father Contact No. */}
                {user?.father_contact_no && (
                  <View style={{display:'flex', flexDirection:'row', alignItems:'center', gap:2}}>
                    <Text style={{fontSize:16}}>Father Contact No.: </Text>
                    <Text style={{color:'gray', fontSize:16}}>{user.father_contact_no}</Text>
                  </View>
                )}

                {/* Alternate Mobile */}
                {user?.contact_nos[1] && (
                  <View style={{display:'flex', flexDirection:'row', alignItems:'center', gap:2}}>
                    <Text style={{fontSize:16}}>Alternate Mobile: </Text>
                    <Text style={{color:'gray', fontSize:16}}>{user.contact_nos[1]}</Text>
                  </View>
                )}

                {/* Alternate Email */}
                {user?.alternate_email && (
                  <View style={{display:'flex', flexDirection:'row', alignItems:'center', gap:2}}>
                    <Text style={{fontSize:16}}>Alternate Email: </Text>
                    <Text style={{color:'gray', fontSize:16}}>{user.alternate_email}</Text>
                  </View>
                )}

                {/* Religion */}
                {user?.religion && (
                  <View style={{display:'flex', flexDirection:'row', alignItems:'center', gap:2}}>
                    <Text style={{fontSize:16}}>Religion: </Text>
                    <Text style={{color:'gray', fontSize:16}}>{user.religion}</Text>
                  </View>
                )}

                {/* Permenant Address */}
                {user?.permenant_address && (
                  <View style={{display:'flex', flexDirection:'row', alignItems:'center', gap:2}}>
                    <Text style={{fontSize:16}}>Permenant Address: </Text>
                    <Text style={{color:'gray', fontSize:16}}>{user.permenant_address}</Text>
                  </View>
                )}

                {/* DOJ */}
                {user?.doj && (
                  <View style={{display:'flex', flexDirection:'row', alignItems:'center', gap:2}}>
                    <Text style={{fontSize:16}}>DOJ: </Text>
                    <Text style={{color:'gray', fontSize:16}}>{moment(user?.doj).format('D-M-YYYY')}</Text>
                  </View>
                )}

                {/* Father Name */}
                {user?.father_name && (
                  <View style={{display:'flex', flexDirection:'row', alignItems:'center', gap:2}}>
                    <Text style={{fontSize:16}}>Father Name: </Text>
                    <Text style={{color:'gray', fontSize:16}}>{user.father_name}</Text>
                  </View>
                )}

                {/* Mobile */}
                {user?.mobile && (
                  <View style={{display:'flex', flexDirection:'row', alignItems:'center', gap:2}}>
                    <Text style={{fontSize:16}}>Mobile: </Text>
                    <Text style={{color:'gray', fontSize:16}}>{user.mobile}</Text>
                  </View>
                )}

                {/* Email ID */}
                {user?.email && (
                  <View style={{display:'flex', flexDirection:'row', alignItems:'center', gap:2}}>
                    <Text style={{fontSize:16}}>Email ID: </Text>
                    <Text style={{color:'gray', fontSize:16}}>{user.email}</Text>
                  </View>
                )}

                {/* Nationality */}
                {user?.nationality && (
                  <View style={{display:'flex', flexDirection:'row', alignItems:'center', gap:2}}>
                    <Text style={{fontSize:16}}>Nationality: </Text>
                    <Text style={{color:'gray', fontSize:16}}>{user.nationality}</Text>
                  </View>
                )}

                {/* Gender */}
                {user?.gender && (
                  <View style={{display:'flex', flexDirection:'row', alignItems:'center', gap:2}}>
                    <Text style={{fontSize:16}}>Gender: </Text>
                    <Text style={{color:'gray', fontSize:16}}>{user.gender}</Text>
                  </View>
                )}

                {/* Qualification */}
                {user?.qualification && (
                  <View style={{display:'flex', flexDirection:'row', alignItems:'center', gap:2}}>
                    <Text style={{fontSize:16}}>Qualification: </Text>
                    <Text style={{color:'gray', fontSize:16}}>{user.qualification}</Text>
                  </View>
                )}

                {/* Pan Card No. */}
                {user?.pan_card_no && (
                  <View style={{display:'flex', flexDirection:'row', alignItems:'center', gap:2}}>
                    <Text style={{fontSize:16}}>Pan Card No.: </Text>
                    <Text style={{color:'gray', fontSize:16}}>{user.pan_card_no}</Text>
                  </View>
                )}

                {/* Bank Account No. */}
                {user?.bank_account_no && (
                  <View style={{display:'flex', flexDirection:'row', alignItems:'center', gap:2}}>
                    <Text style={{fontSize:16}}>Bank Account No.: </Text>
                    <Text style={{color:'gray', fontSize:16}}>{user.bank_account_no}</Text>
                  </View>
                )}

                {/* UAN No. */}
                {user?.uan_no && (
                  <View style={{display:'flex', flexDirection:'row', alignItems:'center', gap:2}}>
                    <Text style={{fontSize:16}}>UAN No.: </Text>
                    <Text style={{color:'gray', fontSize:16}}>{user.uan_no}</Text>
                  </View>
                )}

                {/* Contact Nos. */}
                {user?.contact_nos?.length > 0 && (
                  <View style={{display:'flex', flexDirection:'row', alignItems:'center', gap:2}}>
                    <Text style={{fontSize:16}}>Contact Nos.: </Text>
                    <View style={{display:'flex', flexDirection:'row'}}>
                      {user.contact_nos.map(n => (
                        <Text style={{color:'gray', fontSize:16}} key={n}>{user.contact_nos.indexOf(n) === 0 ? `${n}, ` : n}</Text>
                      ))}
                    </View>
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
export default TeacherProfile;
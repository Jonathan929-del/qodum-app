// Imports
import axios from 'axios';
import configs from '../../../configs';
import {useEffect, useState} from 'react';
import {ActivityIndicator} from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import {Text, TouchableOpacity, View, TextInput, ScrollView, Image, Modal} from 'react-native';





// Main functions
export default function App({isFindSchoolOpened, setIsFindSchoolOpened}) {

  // Text input
  const [input, setInput] = useState('');


  // Schools
  const [schools, setSchools] = useState([]);


  // Is empty
  const [isEmpty, setIsEmpty] = useState(false);


  // Is loading
  const [isLoading, setIsLoading] = useState(false);


  // Use effect
  useEffect(() => {
    const fetcher = async () => {
      try {

        // Api call
        setIsLoading(true);
        const link = `${configs.EXPO_PUBLIC_API_URL}/schools/find`;
        const res = await axios.post(link, {school_name:input});


        // Validations
        if(res.data.length === 0){
          setIsEmpty(true);
          setSchools([]);
          setIsLoading(false);
          return;
        };
        if(res.data === 'No school name provided'){
          setSchools([]);
          setIsEmpty(false);
          setIsLoading(false);
          return;
        };
        if(res.data === 'No school name provided'){
          setSchools([]);
          setIsEmpty(true);
          setIsLoading(false);
        }


        // Setting schools
        if(res.data.length > 0){
          setSchools(res.data);
          setIsEmpty(false);
          setIsLoading(false);
          return;
        };

      }catch(err){
        console.log(err); 
      }
    };
    fetcher();
  }, [input]);

  return (
    <Modal style={{backgroundColor:'#fff'}} visible={isFindSchoolOpened}>
      <View style={{width:'100%', height:130, display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'space-between', paddingTop:10, paddingHorizontal:10, backgroundColor:'#0094DA', borderBottomRightRadius:40, borderBottomLeftRadius:40}}>
        <TouchableOpacity
          onPress={() => setIsFindSchoolOpened(false)}
          style={{width:'10%'}}
        >
          <Icon name='arrow-back' color='#fff' size={30}/>
        </TouchableOpacity>
        <Text style={{width:'90%', textAlign:'center', fontSize:18, color:'#fff', fontWeight:'900'}}>Find your school or college code</Text>
      </View>

      <View style={{display:'flex', alignItems:'center', paddingTop:30}}>
        {/* Text input */}
        <View style={{width:'80%', height:50, display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'center', backgroundColor:'#F7F7F7', borderRadius:10}}>
          <TouchableOpacity style={{height:'100%', width:'15%', display:'flex', alignItems:'center', justifyContent:'center'}}>
            <Icon name='search' size={25} color='#989898'/>
          </TouchableOpacity>
          <TextInput
            value={input}
            onChangeText={v => setInput(v)}
            placeholder='Search here...'
            style={{height:'100%', width:'85%', borderRadius:10}}
          />
        </View>

        {schools.length > 0 && (
          <ScrollView style={{width:'80%', display:'flex', flexDirection:'column', gap:15, marginVertical:30, borderRadius:10, borderWidth:1, borderColor:'#ccc'}}>

            {/* Header */}
            <Text style={{width:'100%', textAlign:'center', paddingVertical:8, fontSize:16, backgroundColor:'#D9DFEF', color:'#4F58CF', borderTopLeftRadius:10, borderTopRightRadius:10}}>
              Search Results
            </Text>


            {/* Data */}
            <View style={{display:'flex', flexDirection:'column', gap:10, paddingHorizontal:10, paddingVertical:10}}>

              {schools?.map(s => (
                <View key={s._id} style={{display:'flex', flexDirection:'row', paddingLeft:10, gap:20, borderBottomColor:'#ccc', borderBottomWidth:schools.indexOf(s) + 1 === schools.length ? 0 : 1, paddingBottom:6}}>
                  <Image
                    width={50}
                    height={50}
                    source={{uri:s?.logo}}
                  />
                  <View style={{display:'flex', flexDirection:'column', alignItems:'flex-start', justifyContent:'center', gap:4}}>
                    <Text style={{fontSize:16, fontWeight:'600', letterSpacing:2}}>{s.school_name}</Text>
                    <Text style={{letterSpacing:4, color:'#0094DA'}}>{s.school_no}</Text>
                  </View>
                </View>
              ))}

            </View>


          </ScrollView>
        )}

        {isEmpty && (
          <View style={{marginTop:30}}>
            <Text>No schools or colleges found.</Text>
          </View>
        )}

        {isLoading && (
          <View style={{marginTop:30}}>
            <ActivityIndicator size={30}/>
          </View>
        )}

      </View>
    </Modal>
  );
};
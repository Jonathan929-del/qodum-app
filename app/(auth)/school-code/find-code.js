// Imports
import axios from 'axios';
import {router} from 'expo-router';
import {Icon} from 'react-native-paper';
import {useEffect, useState} from 'react';
import {Text, TouchableOpacity, View, TextInput} from 'react-native';





// Main functions
export default function App() {


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
        const link = `${process.env.EXPO_PUBLIC_API_URL}/schools/find`;
        const res = await axios.post(link, {school_name:input});


        // Validations
        if(res.data.length === 0){
          setIsEmpty(true);
          setSchools([]);
          setIsLoading(false);
          return;
        };


        // Setting schools
        if(res.data.length > 0){
          setSchools(res.data);
          setIsEmpty(false);
          setIsLoading(false);
          return;
        };


        // Empty input
        if(res.data === 'No school name provided'){
          setSchools([]);
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
    <View style={{height:'100%'}}>
      <View style={{width:'100%', height:'15%', display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'space-between', paddingTop:10, paddingHorizontal:10, backgroundColor:'#0094DA', borderBottomRightRadius:40, borderBottomLeftRadius:40}}>
        <TouchableOpacity
          onPress={() => router.push('/school-code')}
          style={{width:'10%'}}
        >
          <Icon source='chevron-left' size={40} color='#fff'/>
        </TouchableOpacity>
        <Text style={{width:'90%', textAlign:'center', fontSize:18, color:'#fff', fontWeight:'900'}}>Find your school or college code</Text>
      </View>

      <View style={{display:'flex', alignItems:'center', paddingTop:30}}>
        {/* Text input */}
        <View style={{width:'80%', height:50, display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'center', backgroundColor:'#F7F7F7', borderRadius:10}}>
          <TouchableOpacity style={{height:'100%', width:'15%', display:'flex', alignItems:'center', justifyContent:'center'}}>
            <Icon source='magnify' size={30} color='#989898'/>
          </TouchableOpacity>
          <TextInput
            value={input}
            onChangeText={v => setInput(v)}
            placeholder='Search here...'
            style={{height:'100%', width:'85%', borderRadius:10}}
          />
        </View>

      </View>
    </View>
  );
};
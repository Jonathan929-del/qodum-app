// Imports
import {useState} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';





// Main functions
export default function App() {

  // Selected tab
  const [selectedTab, setSelectedTab] = useState('notice');

  return (
    <View style={{flex:1, alignItems:'center', paddingTop:50}}>


      {/* Tabs */}
      <View style={{width:'80%', display:'flex', flexDirection:'row', borderRadius:100, backgroundColor:'#F5F5F8'}}>
          <TouchableOpacity
              onPress={() => {
                  setSelectedTab('notice');
              }}
              style={{flex:1}}
          >
              <Text style={{paddingVertical:10, fontWeight:'800', textAlign:'center', borderRadius:100, color:selectedTab === 'notice' ? '#fff' : 'gray', backgroundColor:selectedTab === 'notice' ? '#3C5EAB' : '#F5F5F8'}}>Notice</Text>
          </TouchableOpacity>
          <TouchableOpacity
              onPress={() => {
                  setSelectedTab('circular');
              }}
              style={{flex:1}}
          >
              <Text style={{paddingVertical:10, fontWeight:'800', textAlign:'center', borderRadius:100, color:selectedTab === 'circular' ? '#fff' : 'gray', backgroundColor:selectedTab === 'circular' ? '#3C5EAB' : '#F5F5F8'}}>Circular</Text>
          </TouchableOpacity>
          <TouchableOpacity
              onPress={() => {
                  setSelectedTab('message');
              }}
              style={{flex:1}}
          >
              <Text style={{paddingVertical:10, fontWeight:'800', textAlign:'center', borderRadius:100, color:selectedTab === 'message' ? '#fff' : 'gray', backgroundColor:selectedTab === 'message' ? '#3C5EAB' : '#F5F5F8'}}>Message</Text>
          </TouchableOpacity>
      </View>


    </View>
  );
};
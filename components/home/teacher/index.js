// Imports
import Topbar from './Topbar';
import Academics from './Academics';
import Transport from './Transport';
import {ScrollView, View, StatusBar} from 'react-native';
import Celebration from './Celebration';
import EdisappToday from './EdisappToday';
import Communication from './Communication';
import SchoolUpdates from './SchoolUpdates';
import AttendanceProgress from './AttendanceProgress';





// Main functions
export default function App(){
  return (
    <View style={{flex:1}}>

      {/* Status bar */}
      <StatusBar
        barStyle='light-content'
      />

      <Topbar />
      <ScrollView>
        <View style={{flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:20, marginTop:20}}>
          <Celebration />
          <AttendanceProgress />
          <SchoolUpdates />
          <Academics />
          <Communication />
          <Transport />
          <EdisappToday />
        </View>
      </ScrollView>
    </View>
  );
};
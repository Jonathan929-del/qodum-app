// Imports
import Topbar from '../../components/home/Topbar';
import Academics from '../../components/home/Academics';
import Transport from '../../components/home/Transport';
import {ScrollView, View, StatusBar} from 'react-native';
import Celebration from '../../components/home/Celebration';
import EdisappToday from '../../components/home/EdisappToday';
import Communication from '../../components/home/Communication';
import SchoolUpdates from '../../components/home/SchoolUpdates';
import AttendanceProgress from '../../components/home/AttendanceProgress';





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
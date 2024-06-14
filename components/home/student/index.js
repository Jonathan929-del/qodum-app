// Imports
import Topbar from './Topbar';
import {useState} from 'react';
import Academics from './Academics';
import Transport from './Transport';
import Celebration from './Celebration';
import EdisappToday from './EdisappToday';
import Communication from './Communication';
import SchoolUpdates from './SchoolUpdates';
import AttendanceProgress from './AttendanceProgress';
import {ScrollView, View, StatusBar} from 'react-native';
import InfoPopup from './InfoPopup';





// Main functions
export default function App(){

  // Is info pop up opened
  const [isInfoPopupOpened, setIsInfoPopupOpened] = useState(false);

  return (
    <View style={{flex:1}}>

      {/* Status bar */}
      <StatusBar
        barStyle='light-content'
      />

      <Topbar
        setIsInfoPopupOpened={setIsInfoPopupOpened}
      />
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

      {/* Info Popup */}
      {isInfoPopupOpened && (
        <InfoPopup
          isInfoPopupOpened={isInfoPopupOpened}
          setIsInfoPopupOpened={setIsInfoPopupOpened}
        />
      )}
    </View>
  );
};
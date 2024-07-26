// Imports
import Topbar from './Topbar';
import {useState} from 'react';
import Message from './Message';
import Academics from './Academics';
import Transport from './Transport';
import InfoPopup from './InfoPopup';
import EdisappToday from './EdisappToday';
import Communication from './Communication';
import SchoolUpdates from './SchoolUpdates';
import AttendanceProgress from './AttendanceProgress';
import {ScrollView, View, StatusBar} from 'react-native';





// Main functions
export default function App({navigation}){

  // Is info pop up opened
  const [isInfoPopupOpened, setIsInfoPopupOpened] = useState(false);

  return (
    <View style={{flex:1}}>

      {/* Status bar */}
      <StatusBar
        backgroundColor='#0094DA'
        barStyle='light-content'
      />

      <Topbar
        setIsInfoPopupOpened={setIsInfoPopupOpened}
      />

      <ScrollView>
        <View style={{flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:20, marginTop:20}}>
          <Message />
          <AttendanceProgress />
          <SchoolUpdates navigation={navigation}/>
          <Academics navigation={navigation}/>
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
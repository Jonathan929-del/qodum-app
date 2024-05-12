// Imports
import {useContext} from 'react';
import {ScrollView} from 'react-native';
import {AuthContext} from '../../context/Auth';
import TeacherProfile from '../../components/profile/TeacherProfile';
import StudentProfile from '../../components/profile/StudentProfile';





// Main functions
export default function App() {


  // User
  const {user} = useContext(AuthContext);

  return user.type === 'Teacher' ? (
    <ScrollView>
      <TeacherProfile />
    </ScrollView>
  ) : (
    <ScrollView>
      <StudentProfile />
    </ScrollView>
  );
};
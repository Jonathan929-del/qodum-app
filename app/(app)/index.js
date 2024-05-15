// Imports
import {useContext} from 'react';
import {AuthContext} from '../../context/Auth';
import StudentHome from '../../components/home/student';
import TeacherHome from '../../components/home/teacher';





// Main functions
export default function App(){


  // User
  const {user} = useContext(AuthContext);


  return user.type === 'Teacher' ? (
    <TeacherHome />
  ) : (
    <StudentHome />
  );
};
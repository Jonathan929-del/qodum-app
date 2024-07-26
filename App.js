// Imports
import theme from './theme/theme';
import {useCallback} from 'react';
import {AuthProvider} from './context/Auth';
import {PaperProvider} from 'react-native-paper';
import {Alert, BackHandler, View} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NotificationProvider, useNotification} from './context/NotificationProvider';
import {NavigationContainer, useFocusEffect, useNavigation} from '@react-navigation/native';

import Login from './pages/auth/login';
import Welcome from './pages/auth/welcome';
import SendOTP from './pages/auth/send-otp';
import CheckOTP from './pages/auth/check-otp';
import Register from './pages/auth/register';

import StudentActivity from './pages/app/student/activity';
import StudentProfile from './pages/app/student/profile';
import StudentHome from './pages/app/student/home';
import StudentMessages from './pages/app/student/messages';
import StudentSettings from './pages/app/student/settings';
import StudentFee from './pages/app/student/fee';
import SchoolCode from './pages/auth/school-code';
import StudentAssignments from './pages/app/student/assignments';
import StudentAssignmentView from './pages/app/student/assignments/view';
import StudentAssignmentAnswer from './pages/app/student/assignments/answer';
import StudentAssignmentSubmission from './pages/app/student/assignments/submit';
import StudentAssignmentPdfPreview from './pages/app/student/assignments/pdf-preview';
import StudentAssignmentViewFeedback from './pages/app/student/assignments/view-feedback';
import StudentNotices from './pages/app/student/notice';
import StudentClassNotices from './pages/app/student/class-notices';
import StudentEdiaries from './pages/app/student/e-diaries';

import TeacherActivity from './pages/app/teacher/activity';
import TeacherProfile from './pages/app/teacher/profile';
import TeacherHome from './pages/app/teacher/home';
import TeacherMessages from './pages/app/teacher/messages';
import TeacherSettings from './pages/app/teacher/settings';
import TeacherNotices from './pages/app/teacher/notice';
import TeacherEditNotice from './pages/app/teacher/notice/edit-app-message';
import TeacherNoticeFlashMessage from './pages/app/teacher/notice/flash-message';
import TeacherNoticeSmsAndAppMessage from './pages/app/teacher/notice/sms-and-app-message';
import TeacherNoticeOnlyAppMessage from './pages/app/teacher/notice/app-message';
import TeacherClassNotice from './pages/app/teacher/class-notice';
import TeacherClassNoticeEdit from './pages/app/teacher/class-notice/edit';
import TeacherClassNoticeCreate from './pages/app/teacher/class-notice/create';
import TeacherEdiaries from './pages/app/teacher/e-diaries/index';
import TeacherEdiaryEdit from './pages/app/teacher/e-diaries/edit';
import TeacherEdiaryCreate from './pages/app/teacher/e-diaries/create';
import TeacherAssignments from './pages/app/teacher/assignments/index';
import TeacherAssignmentCreate from './pages/app/teacher/assignments/create';
import TeacherAssignmentView from './pages/app/teacher/assignments/view';
import TeacherAssignmentEdit from './pages/app/teacher/assignments/edit';
import TeacherAssignmentPdfPreView from './pages/app/teacher/assignments/pdf-preview';
import TeacherAssignmentAnswerView from './pages/app/teacher/assignments/view-answer';
import TeacherAssignmentFeedbackAdd from './pages/app/teacher/assignments/add-feedback';





// Main function
const App = () => {

  // Stack
  const Stack = createNativeStackNavigator();


  // Tab
  const Tab = createBottomTabNavigator();


  // Student activity with Back handler
  const StudentActivityScreen = () => {
    const navigation = useNavigation();
  
    useFocusEffect(
      useCallback(() => {
        const onBackPress = () => {
          Alert.alert('Hold on!', 'Are you sure you want to exit?', [
            {
              text: 'Cancel',
              onPress: () => null,
              style: 'cancel'
            },
            {
              text: 'YES', 
              onPress: () => {
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'Home' }],
                });
                BackHandler.exitApp();
              }
            }
          ]);
          return true;
        };
  
        BackHandler.addEventListener('hardwareBackPress', onBackPress);
  
        return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
      }, [navigation])
    );
  
    return <StudentActivity />;
  };


  // Teacher activity with back handler
  const TeacherActivityScreen = () => {
    const navigation = useNavigation();
  
    useFocusEffect(
      useCallback(() => {
        const onBackPress = () => {
          Alert.alert('Hold on!', 'Are you sure you want to exit?', [
            {
              text: 'Cancel',
              onPress: () => null,
              style: 'cancel'
            },
            {
              text: 'YES', 
              onPress: () => {
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'Home' }],
                });
                BackHandler.exitApp();
              }
            }
          ]);
          return true;
        };
  
        BackHandler.addEventListener('hardwareBackPress', onBackPress);
  
        return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
      }, [navigation])
    );
    return <TeacherActivity />;
  };


  // Student Tabs
  const StudentTabs = () => {
    
    const {notificationsCount} = useNotification();

    return(
      <Tab.Navigator
        initialRouteName='Home'
        screenOptions={({route}) => ({
          tabBarIcon:({color, size}) => {
            let iconName;
      
            if(route.name === 'Home'){
              iconName = 'home';
            }else if(route.name === 'Profile'){
              iconName = 'person';
            }else if(route.name === 'Activity'){
              iconName = 'notifications';
            }else if(route.name === 'Messages'){
              iconName = 'chatbubble-ellipses';
            }else if(route.name === 'Settings'){
              iconName = 'settings';
            };
      
            return route.name !== 'Home' ? (
              <Icon name={iconName} size={size} color={color} />
              ) : (
                <View style={{width:50, height:50, alignItems:'center', justifyContent:'center', borderRadius:50, backgroundColor:'#0094DA'}}>
                  <Icon name={iconName} size={size} color='#fff' />
                </View>
              )
          },
          tabBarLabel:route.name === 'Home' ? '' : route.name,
          tabBarActiveTintColor:route.name === 'Home' ? '#fff' : '#0094DA',
          tabBarStyle:{height:70, paddingVertical:20, paddingBottom:10}
        })}
      >

        {/* Activity */}
        <Stack.Screen
          name='Activity'
          component={StudentActivityScreen}
          options={{
            headerShown:false,
            tabBarBadge:notificationsCount === 0 ? null : notificationsCount
          }}
        />


        {/* Profile */}
        <Stack.Screen
          name='Profile'
          component={StudentProfile}
          options={{headerShown:false}}
        />


        {/* Home */}
        <Tab.Screen
          name='Home'
          component={StudentHome}
          options={{headerShown:false}}
        />


        {/* Messages */}
        <Tab.Screen
          name='Messages'
          component={StudentMessages}
          options={{headerShown:false}}
        />


        {/* Settings */}
        <Tab.Screen
          name='Settings'
          component={StudentSettings}
          options={{headerShown:false}}
        />

      </Tab.Navigator>
  )};


  // Teacher Tabs
  const TeacherTabs = () => {
    
    const {notificationsCount} = useNotification();

    return(
      <Tab.Navigator
        initialRouteName='Home'
        screenOptions={({route}) => ({
          tabBarIcon:({color, size}) => {
            let iconName;
      
            if(route.name === 'Home'){
              iconName = 'home';
            }else if(route.name === 'Profile'){
              iconName = 'person';
            }else if(route.name === 'Activity'){
              iconName = 'notifications';
            }else if(route.name === 'Messages'){
              iconName = 'chatbubble-ellipses';
            }else if(route.name === 'Settings'){
              iconName = 'settings';
            };
      
            return route.name !== 'Home' ? (
              <Icon name={iconName} size={size} color={color} />
              ) : (
                <View style={{width:50, height:50, alignItems:'center', justifyContent:'center', borderRadius:50, backgroundColor:'#0094DA'}}>
                  <Icon name={iconName} size={size} color='#fff' />
                </View>
              )
          },
          tabBarLabel:route.name === 'Home' ? '' : route.name,
          tabBarActiveTintColor:route.name === 'Home' ? '#fff' : '#0094DA',
          tabBarStyle:{height:70, paddingVertical:20, paddingBottom:10}
        })}
      >

        {/* Activity */}
        <Stack.Screen
          name='Activity'
          component={TeacherActivityScreen}
          options={{
            headerShown:false,
            tabBarBadge:notificationsCount === 0 ? null : notificationsCount
          }}
        />


        {/* Profile */}
        <Stack.Screen
          name='Profile'
          component={TeacherProfile}
          options={{headerShown:false}}
        />


        {/* Home */}
        <Tab.Screen
          name='Home'
          component={TeacherHome}
          options={{headerShown:false}}
        />


        {/* Messages */}
        <Tab.Screen
          name='Messages'
          component={TeacherMessages}
          options={{headerShown:false}}
        />


        {/* Settings */}
        <Tab.Screen
          name='Settings'
          component={TeacherSettings}
          options={{headerShown:false}}
        />

      </Tab.Navigator>
  )};

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <NotificationProvider>
          <PaperProvider theme={theme}>
            <NavigationContainer>
              <Stack.Navigator initialRouteName='school-code'>

                {/* School code */}
                <Stack.Screen
                  name='school-code'
                  component={SchoolCode}
                  options={{headerShown:false}}
                />


                {/* Welcome */}
                <Stack.Screen
                  name='welcome'
                  component={Welcome}
                  options={{headerShown:false}}
                />


                {/* Login */}
                <Stack.Screen
                  name='login'
                  component={Login}
                  options={{headerShown:false}}
                />


                {/* Register */}
                <Stack.Screen
                  name='register'
                  component={Register}
                  options={{headerShown:false}}
                />


                {/* Send OTP */}
                <Stack.Screen
                  name='send-otp'
                  component={SendOTP}
                  options={{headerShown:false}}
                />


                {/* Check OTP */}
                <Stack.Screen
                  name='check-otp'
                  component={CheckOTP}
                  options={{headerShown:false}}
                />


                {/* Student Tabs */}
                <Stack.Screen
                  name='student-tabs'
                  component={StudentTabs}
                  options={{headerShown:false}}
                />


                {/* Student Fee */}
                <Stack.Screen
                  name='student-fee'
                  component={StudentFee}
                  options={{headerShown:false}}
                />


                {/* Student Assignments */}
                <Stack.Screen
                  name='student-assignments'
                  component={StudentAssignments}
                  options={{headerShown:false}}
                />


                {/* Student Assignment Answer */}
                <Stack.Screen
                  name='student-assignment-answer'
                  component={StudentAssignmentAnswer}
                  options={{headerShown:false}}
                />


                {/* Student Assignment Pdf Preview */}
                <Stack.Screen
                  name='student-assignment-pdf-preview'
                  component={StudentAssignmentPdfPreview}
                  options={{headerShown:false}}
                />


                {/* Student Assignment Submission */}
                <Stack.Screen
                  name='student-assignment-submission'
                  component={StudentAssignmentSubmission}
                  options={{headerShown:false}}
                />


                {/* Student Assignment View Feedback */}
                <Stack.Screen
                  name='student-assignment-view-feedback'
                  component={StudentAssignmentViewFeedback}
                  options={{headerShown:false}}
                />


                {/* Student Assignment View */}
                <Stack.Screen
                  name='student-assignment-view'
                  component={StudentAssignmentView}
                  options={{headerShown:false}}
                />


                {/* Student Notices */}
                <Stack.Screen
                  name='student-notices'
                  component={StudentNotices}
                  options={{headerShown:false}}
                />


                {/* Student Class Notices */}
                <Stack.Screen
                  name='student-class-notices'
                  component={StudentClassNotices}
                  options={{headerShown:false}}
                />


                {/* Student E-diaries */}
                <Stack.Screen
                  name='student-ediaries'
                  component={StudentEdiaries}
                  options={{headerShown:false}}
                />


                {/* Teacher Tabs */}
                <Stack.Screen
                  name='teacher-tabs'
                  component={TeacherTabs}
                  options={{headerShown:false}}
                />


                {/* Teacher Notices */}
                <Stack.Screen
                  name='teacher-notices'
                  component={TeacherNotices}
                  options={{headerShown:false}}
                />


                {/* Teacher Edit Notice */}
                <Stack.Screen
                  name='teacher-edit-notice'
                  component={TeacherEditNotice}
                  options={{headerShown:false}}
                />


                {/* Teacher Notice Flash Message */}
                <Stack.Screen
                  name='teacher-notice-flash-message'
                  component={TeacherNoticeFlashMessage}
                  options={{headerShown:false}}
                />


                {/* Teacher Notice SMS and App Message */}
                <Stack.Screen
                  name='teacher-notice-sms-and-app-message'
                  component={TeacherNoticeSmsAndAppMessage}
                  options={{headerShown:false}}
                />


                {/* Teacher Notice Only App Message */}
                <Stack.Screen
                  name='teacher-notice-only-app-message'
                  component={TeacherNoticeOnlyAppMessage}
                  options={{headerShown:false}}
                />


                {/* Teacher Class Notice */}
                <Stack.Screen
                  name='teacher-class-notice'
                  component={TeacherClassNotice}
                  options={{headerShown:false}}
                />


                {/* Teacher Class Notice Edit */}
                <Stack.Screen
                  name='teacher-class-notice-edit'
                  component={TeacherClassNoticeEdit}
                  options={{headerShown:false}}
                />


                {/* Teacher Class Notice Create */}
                <Stack.Screen
                  name='teacher-class-notice-create'
                  component={TeacherClassNoticeCreate}
                  options={{headerShown:false}}
                />


                {/* Teacher Ediaries */}
                <Stack.Screen
                  name='teacher-ediaries'
                  component={TeacherEdiaries}
                  options={{headerShown:false}}
                />


                {/* Teacher Ediary Edit */}
                <Stack.Screen
                  name='teacher-ediary-edit'
                  component={TeacherEdiaryEdit}
                  options={{headerShown:false}}
                />


                {/* Teacher Ediary Create */}
                <Stack.Screen
                  name='teacher-ediary-create'
                  component={TeacherEdiaryCreate}
                  options={{headerShown:false}}
                />


                {/* Teacher Assignments */}
                <Stack.Screen
                  name='teacher-assignments'
                  component={TeacherAssignments}
                  options={{headerShown:false}}
                />


                {/* Teacher Assignment Create */}
                <Stack.Screen
                  name='teacher-assignment-create'
                  component={TeacherAssignmentCreate}
                  options={{headerShown:false}}
                />


                {/* Teacher Assignment Edit */}
                <Stack.Screen
                  name='teacher-assignment-edit'
                  component={TeacherAssignmentEdit}
                  options={{headerShown:false}}
                />


                {/* Teacher Assignment View */}
                <Stack.Screen
                  name='teacher-assignment-view'
                  component={TeacherAssignmentView}
                  options={{headerShown:false}}
                />


                {/* Teacher Assignment PDF Previiew */}
                <Stack.Screen
                  name='teacher-assignment-pdf-preview'
                  component={TeacherAssignmentPdfPreView}
                  options={{headerShown:false}}
                />


                {/* Teacher Assignment Answer View */}
                <Stack.Screen
                  name='teacher-assignment-answer-view'
                  component={TeacherAssignmentAnswerView}
                  options={{headerShown:false}}
                />


                {/* Teacher Assignment Feedback Add */}
                <Stack.Screen
                  name='teacher-assignment-feedback-add'
                  component={TeacherAssignmentFeedbackAdd}
                  options={{headerShown:false}}
                />

              </Stack.Navigator>
            </NavigationContainer>
          </PaperProvider>
        </NotificationProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
};





// Export
export default App;
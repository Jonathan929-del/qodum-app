// Imports
import {decode} from 'base-64';
import {createContext, useReducer} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';





// Initial state
const initialState = {
    user:null,
    preLoginUser:null,
    school:null
};





// User local storage check
const localStorageCheck = async () => {
    try {

        // User token check
        const token = await AsyncStorage.getItem('token');
        console.log(token);
        if(token){
            const decodedToken = JSON.parse(decode(token.split('.')[1]));
            if(decodedToken.exp > Date.now()){
                await AsyncStorage.removeItem('token');
            }else{
                initialState.user = decodedToken;
            }
        };


        // School data check
        const school = await AsyncStorage.getItem('schoolData');
        if(school){
            initialState.school = JSON.parse(school);
        };

    } catch (err) {
        console.log(err);
    }
};
localStorageCheck();





// Context
const AuthContext = createContext({
    user:null,
    preLoginUser:null,
    school:null,
    login:userData => {},
    logout:() => {},
    preLoginUserLogin:preLoginUsertData => {},
    schoolLogin:schoolData => {}
});





// Reducer
const AuthReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN':
            return {
                ...state,
                user:action.payload,
                preLoginUser:null
            }
        case 'PRE_LOGIN_USER_LOGIN':
            return {
                ...state,
                preLoginUser:action.payload
            }
        case 'LOGOUT':
            return{
                ...state,
                user:null,
                school:null,
                preLoginUser:null
            }
        case 'SCHOOL_LOGIN':
            return {
                ...state,
                school:action.payload,
                preLoginUser:null
            }
        default:
            return state;
    };
};





// Provider
const AuthProvider = props => {

    // State
    const [state, dispatch] = useReducer(AuthReducer, initialState);


    // login
    const login = async userData => {
        try {
            await AsyncStorage.setItem('token', userData.token);
            dispatch({
                type:'LOGIN',
                payload:userData
            });
        } catch (err) {
            console.log(err);
        }
    };


    // Pre login user
    const preLoginUserLogin = async preLoginUserLoginData => {
        try {
            dispatch({
                type:'PRE_LOGIN_USER_LOGIN',
                payload:preLoginUserLoginData
            });
        } catch (err) {
            console.log(err);
        }
    };


    // Logout
    const logout = async () => {
        try {
            await AsyncStorage.removeItem('token');
            await AsyncStorage.removeItem('schoolData');
            dispatch({
                type:'LOGOUT'
            });
        } catch (err) {
            console.log(err);
        }
    };


    // School login
    const schoolLogin = async schoolData => {
        try {
            await AsyncStorage.setItem('schoolData', JSON.stringify(schoolData));
            dispatch({
                type:'SCHOOL_LOGIN',
                payload:schoolData
            });
        } catch (err) {
            console.log(err);
        }
    };


    return(
        <AuthContext.Provider
            value={{user:state.user, preLoginUser:state.preLoginUser, school:state.school, login, preLoginUserLogin, logout, schoolLogin}}
            {...props}
        />
    );
};





// Export
export {AuthContext, AuthProvider};
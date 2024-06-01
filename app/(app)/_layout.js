// Imports
import {useContext} from 'react';
import {StatusBar} from 'expo-status-bar';
import {Slot, Redirect} from 'expo-router';
import {AuthContext} from '../../context/Auth';
import Tabs from '../../components/layout/Tabs';





// Main function
export default function HomeLayout() {

    // User check
    const {user} = useContext(AuthContext);
    if(!user) return <Redirect href='/school-code' />;

    return (
        <>
            <StatusBar style='auto' />
            <Slot />
            <Tabs />
        </>

    );
};
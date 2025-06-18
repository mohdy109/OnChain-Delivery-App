import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from "../components/LoginScreen"
import UserHome from "../components/UserHome";
import AgentHome from "../components/AgentHome"





export default function AppNavigator() {
    const Stack = createStackNavigator();
    return (
        <Stack.Navigator initialRouteName="Login">
            <Stack.Screen name="Login" component={LoginScreen} options={{
                headerShown: false,
            }} />
            <Stack.Screen name="User" component={UserHome} options={{
                headerShown: false,
            }} />
            <Stack.Screen name="Delivery-Agent" component={AgentHome} options={{
                headerShown: false,
            }} />

        </Stack.Navigator>

    );
}


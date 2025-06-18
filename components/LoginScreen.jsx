import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import * as Linking from 'expo-linking';

export default function LoginScreen({ setIsLoggedIn, setRole }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  const checkLocationAccess = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    const isEnabled = await Location.hasServicesEnabledAsync();

    if (status !== 'granted') {
      Alert.alert(
        'Location Permission Required',
        'This app needs location access to continue.',
        [{ text: 'Open Settings', onPress: () => Linking.openSettings() }]
      );
      return false;
    }

    if (!isEnabled) {
      Alert.alert(
        'GPS Disabled',
        'Please enable location services (GPS) from your phone settings.',
        [{ text: 'Open Settings', onPress: () => Linking.openSettings() }]
      );
      return false;
    }

    try {
      await Location.getCurrentPositionAsync(); // This also helps ensure GPS is really working
      return true;
    } catch (err) {
      Alert.alert(
        'Unable to Get Location',
        'Location services are required to proceed.'
      );
      return false;
    }
  };

  const login = async () => {
    const locationReady = await checkLocationAccess();
    if (!locationReady) return;

    try {
    //   const userCred = await signInWithEmailAndPassword(auth, email, password);
    //   const role = email.includes('agent') ? 'agent' : 'user';
    //   setRole(role);
    //   setIsLoggedIn(true);
      navigation.navigate('Delivery-Agent');
    } catch (err) {
      Alert.alert('Login Failed', err.message || 'Check email/password');
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Email</Text>
      <TextInput value={email} onChangeText={setEmail} style={{ borderWidth: 1, marginBottom: 10 }} />

      <Text>Password</Text>
      <TextInput value={password} onChangeText={setPassword} secureTextEntry style={{ borderWidth: 1, marginBottom: 20 }} />

      <Button title="Login" onPress={login} />
    </View>
  );
}

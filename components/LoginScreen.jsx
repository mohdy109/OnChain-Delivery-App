// import React, { useState } from 'react';
// import { View, Text, TextInput, Button, Alert } from 'react-native';
// import { signInWithEmailAndPassword } from 'firebase/auth';
// import { auth } from '../firebaseConfig';
// import { useNavigation } from '@react-navigation/native';
// import * as Location from 'expo-location';
// import * as Linking from 'expo-linking';

// export default function LoginScreen({ setIsLoggedIn, setRole }) {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const navigation = useNavigation();

//   const checkLocationAccess = async () => {
//     const { status } = await Location.requestForegroundPermissionsAsync();
//     const isEnabled = await Location.hasServicesEnabledAsync();

//     if (status !== 'granted') {
//       Alert.alert(
//         'Location Permission Required',
//         'This app needs location access to continue.',
//         [{ text: 'Open Settings', onPress: () => Linking.openSettings() }]
//       );
//       return false;
//     }

//     if (!isEnabled) {
//       Alert.alert(
//         'GPS Disabled',
//         'Please enable location services (GPS) from your phone settings.',
//         [{ text: 'Open Settings', onPress: () => Linking.openSettings() }]
//       );
//       return false;
//     }

//     try {
//       await Location.getCurrentPositionAsync(); // This also helps ensure GPS is really working
//       return true;
//     } catch (err) {
//       Alert.alert(
//         'Unable to Get Location',
//         'Location services are required to proceed.'
//       );
//       return false;
//     }
//   };

//   const login = async () => {
//     const locationReady = await checkLocationAccess();
//     if (!locationReady) return;

//     try {
//     //   const userCred = await signInWithEmailAndPassword(auth, email, password);
//     //   const role = email.includes('agent') ? 'agent' : 'user';
//     //   setRole(role);
//     //   setIsLoggedIn(true);
//       navigation.navigate('Delivery-Agent');
//     } catch (err) {
//       Alert.alert('Login Failed', err.message || 'Check email/password');
//     }
//   };

//   return (
//     <View style={{ padding: 20 }}>
//       <Text>Email</Text>
//       <TextInput value={email} onChangeText={setEmail} style={{ borderWidth: 1, marginBottom: 10 }} />

//       <Text>Password</Text>
//       <TextInput value={password} onChangeText={setPassword} secureTextEntry style={{ borderWidth: 1, marginBottom: 20 }} />

//       <Button title="Login" onPress={login} />
//     </View>
//   );
// }
import React, { useState } from 'react';
import { Alert } from 'react-native';
import styled from 'styled-components/native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import * as Linking from 'expo-linking';

const Container = styled.View`
  flex: 1;
  padding: 24px;
  background-color: #f5f7fa;
  justify-content: center;
`;

const Title = styled.Text`
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 32px;
  color: #1a1a1a;
  text-align: center;
`;

const Label = styled.Text`
  font-size: 16px;
  margin-bottom: 8px;
  color: #333;
`;

const Input = styled.TextInput`
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 16px;
  background-color: white;
`;

const RadioGroup = styled.View`
  flex-direction: row;
  justify-content: space-around;
  margin-bottom: 24px;
`;

const RadioButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
`;

const RadioCircle = styled.View`
  height: 20px;
  width: 20px;
  border-radius: 10px;
  border-width: 2px;
  border-color: #007bff;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
`;

const SelectedCircle = styled.View`
  height: 10px;
  width: 10px;
  border-radius: 5px;
  background-color: #007bff;
`;

const RadioText = styled.Text`
  font-size: 16px;
  color: #444;
`;

const StyledButton = styled.TouchableOpacity`
  background-color: #007bff;
  padding: 14px;
  border-radius: 8px;
  align-items: center;
`;

const ButtonText = styled.Text`
  color: white;
  font-size: 16px;
  font-weight: bold;
`;

export default function LoginScreen({ setIsLoggedIn, setRole }) {
  const [email, setEmail] = useState('');
  const [deliveryID, setDeliveryID] = useState('');
  const [selectedRole, setSelectedRole] = useState('agent');
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
      await Location.getCurrentPositionAsync();
      return true;
    } catch (err) {
      Alert.alert('Unable to Get Location', 'Location services are required to proceed.');
      return false;
    }
  };

  const login = async () => {
    const locationReady = await checkLocationAccess();
    if (!locationReady) return;

    try {
      // const password = deliveryID; // Treat deliveryID as password for auth
      // await signInWithEmailAndPassword(auth, email, password);

      // setRole(selectedRole);
      // setIsLoggedIn(true);

      if (selectedRole === 'agent') {
        navigation.navigate('Delivery-Agent');
      } else {
        navigation.navigate('User');
      }
    } catch (err) {
      Alert.alert('Login Failed', err.message || 'Invalid credentials');
    }
  };

  return (
    <Container>
      <Title>OnChain-Delivery-App</Title>

      <Label>Email</Label>
      <Input
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Label>Delivery ID</Label>
      <Input
        placeholder="Enter your delivery ID"
        value={deliveryID}
        onChangeText={setDeliveryID}
        autoCapitalize="none"
      />

      <RadioGroup>
        <RadioButton onPress={() => setSelectedRole('agent')}>
          <RadioCircle>
            {selectedRole === 'agent' && <SelectedCircle />}
          </RadioCircle>
          <RadioText>Delivery Agent</RadioText>
        </RadioButton>

        <RadioButton onPress={() => setSelectedRole('user')}>
          <RadioCircle>
            {selectedRole === 'user' && <SelectedCircle />}
          </RadioCircle>
          <RadioText>User</RadioText>
        </RadioButton>
      </RadioGroup>

      <StyledButton onPress={login}>
        <ButtonText>Login</ButtonText>
      </StyledButton>
    </Container>
  );
}

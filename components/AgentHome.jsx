import React, { useEffect, useRef, useState,useCallback } from 'react';
import { View, Button, Image, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Location from 'expo-location';
import { auth } from '../firebaseConfig';
import { useFocusEffect } from '@react-navigation/native';

export default function AgentHome() {
  const cameraRef = useRef(null);
  const [photo, setPhoto] = useState(null);
  const [location, setLocation] = useState(null);
  const [facing, setFacing] = useState('back');

  const [permission, requestPermission] = useCameraPermissions();
  const [locationPermissionGranted, setLocationPermissionGranted] = useState(false);

  
  useFocusEffect(
    useCallback(() => {
      (async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        const isEnabled = await Location.hasServicesEnabledAsync();

        if (status === 'granted' && isEnabled) {
          setLocationPermissionGranted(true);
        } else {
          setLocationPermissionGranted(false);
        }
      })();
    }, [])
  );

  if (!permission) return <View />;

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text>Camera permission required</Text>
        <Button title="Grant permission" onPress={requestPermission} />
      </View>
    );
  }

  const takePhotoAndLocation = async () => {
    if (!locationPermissionGranted) {
      Alert.alert('Location not granted', 'Enable location to proceed');
      return;
    }
  
    const isEnabled = await Location.hasServicesEnabledAsync();
    if (!isEnabled) {
      Alert.alert(
        'GPS Off',
        'Please turn on location services from your settings to continue.'
      );
      return;
    }
  
    if (!cameraRef.current) return;
  
    const pic = await cameraRef.current.takePictureAsync({ base64: true });
    const loc = await Location.getCurrentPositionAsync();
  
    setPhoto(pic);
    setLocation(loc);
  };

  const uploadProof = async () => {
    if (!photo || !location) {
      alert('Please take a photo and get location first');
      return;
    }

    const payload = {
      image: photo.base64,
      location: location.coords,
      timestamp: Date.now(),
      deliveryId: 'DELIVERY123',
      userId: auth.currentUser?.uid,
    };

    await fetch('https://YOUR_CLOUD_FUNCTION_URL', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  };

  return (
    <View style={{ flex: 1 }}>
      <CameraView ref={cameraRef} style={{ flex: 0.5 }} facing={facing} />
      <Button title="Take Photo & Get Location" onPress={takePhotoAndLocation} />
      {photo && <Image source={{ uri: photo.uri }} style={{ width: 100, height: 100 }} />}
      <Button title="Submit Proof" onPress={uploadProof} />
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'white',
    padding: 10,
    marginVertical: 10,
    alignSelf: 'center',
    borderRadius: 8,
  },
  text: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 18,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

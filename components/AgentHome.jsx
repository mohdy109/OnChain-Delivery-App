// import React, { useEffect, useRef, useState, useCallback } from "react";
// import {
//   View,
//   Button,
//   Image,
//   Text,
//   StyleSheet,
//   Alert,
//   ActivityIndicator,
//   TouchableOpacity,
// } from "react-native";
// import { CameraView, useCameraPermissions } from "expo-camera";
// import * as Location from "expo-location";
// import { auth } from "../firebaseConfig";
// import { useFocusEffect } from "@react-navigation/native";

// export default function AgentHome({ route }) {
//   const cameraRef = useRef(null);
//   const [photo, setPhoto] = useState(null);
//   const [location, setLocation] = useState(null);
//   const [facing, setFacing] = useState("back");
//   const { deliveryID, email } = route.params;

//   const [showCamera, setShowCamera] = useState(true);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [permission, requestPermission] = useCameraPermissions();
//   const [locationPermissionGranted, setLocationPermissionGranted] =
//     useState(false);

//   const [address, setAddress] = useState("");
//   const [loadingAddress, setLoadingAddress] = useState(false);

//   const GEOCODING_API_KEY = "842ac3f0135a48f899ea11d67bed647c";

//   useFocusEffect(
//     useCallback(() => {
//       (async () => {
//         const { status } = await Location.requestForegroundPermissionsAsync();
//         const isEnabled = await Location.hasServicesEnabledAsync();

//         if (status === "granted" && isEnabled) {
//           setLocationPermissionGranted(true);
//         } else {
//           setLocationPermissionGranted(false);
//         }
//       })();
//     }, [])
//   );

//   if (!permission) return <View />;

//   if (!permission.granted) {
//     return (
//       <View style={styles.container}>
//         <Text>Camera permission required</Text>
//         <Button title="Grant permission" onPress={requestPermission} />
//       </View>
//     );
//   }

//   const uploadImageToPinata = async (photo) => {
//     const formData = new FormData();
//     formData.append("file", {
//       uri: photo.uri,
//       name: "photo.jpg",
//       type: "image/jpeg",
//     });

//     try {
//       const response = await fetch(
//         "https://api.pinata.cloud/pinning/pinFileToIPFS",
//         {
//           method: "POST",
//           headers: {
//             Authorization: `Bearer ${process.env.EXPO_PUBLIC_PINATA_JWT}`,
//           },
//           body: formData,
//         }
//       );

//       const data = await response.json();
//       const ipfsHash = data.IpfsHash;

//       console.log("📦 Pinata response:", data); // <--- key debug point

//       if (!data.IpfsHash) throw new Error("No IpfsHash returned from Pinata");
//       return `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
//     } catch (err) {
//       console.error("Pinata upload failed", err);
//       throw err;
//     }
//   };

//   const fetchAddressFromCoords = async (latitude, longitude) => {
//     try {
//       setLoadingAddress(true);
//       const response = await fetch(
//         `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${GEOCODING_API_KEY}`
//       );
//       const data = await response.json();
//       if (data?.results?.length > 0) {
//         setAddress(data.results[0].formatted);
//       } else {
//         setAddress("Address not found");
//       }
//     } catch (error) {
//       setAddress("Failed to fetch address");
//     } finally {
//       setLoadingAddress(false);
//     }
//   };

//   const takePhotoAndLocation = async () => {
//     try {
//       if (!locationPermissionGranted) {
//         Alert.alert("Location not granted", "Enable location to proceed");
//         return;
//       }

//       const isEnabled = await Location.hasServicesEnabledAsync();
//       if (!isEnabled) {
//         Alert.alert("GPS Off", "Please turn on location services to continue.");
//         return;
//       }

//       if (!cameraRef.current) return;

//       const pic = await cameraRef.current.takePictureAsync({ base64: true });
//       const loc = await Location.getCurrentPositionAsync();

//       setPhoto(pic);
//       setLocation(loc);
//       setShowCamera(false);
//       setAddress("");
//       fetchAddressFromCoords(loc.coords.latitude, loc.coords.longitude);
//     } catch (e) {
//       console.error("Error taking photo/location:", e);
//       Alert.alert("Error", "Failed to take photo or get location");
//     }
//   };

//   const uploadProof = async () => {
//     try {
//       setIsSubmitting(true);
//       const ipfsImageUrl = await uploadImageToPinata(photo);
//       const payload = {
//         image: ipfsImageUrl,
//         location: address,
//         timestamp: Math.floor(Date.now() / 1000),
//         deliveryId: deliveryID,
//         userId: email,
//       };

//       const response = await fetch(
//         "http://192.168.1.98:5050/submitDeliveryProof",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(payload),
//         }
//       );

//       const data = await response.json();
//       if (data.status === "success") {
//         Alert.alert("Proof Submitted", `Tx Hash: ${data.txHash}`);
//       } else {
//         Alert.alert("Submission Failed");
//       }
//     } catch (err) {
//       console.error(err);
//       Alert.alert("Error", "Failed to submit proof");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <View style={{ flex: 1, padding: 10 }}>
//       {showCamera && (
//         <CameraView ref={cameraRef} style={{ flex: 0.5 }} facing={facing} />
//       )}

//       {!showCamera && (
//         <Button
//           title="📷 Take Another Photo"
//           onPress={() => {
//             setPhoto(null);
//             setLocation(null);
//             setShowCamera(true);
//           }}
//           disabled={isSubmitting}
//         />
//       )}
//       {isSubmitting && (
//         <ActivityIndicator
//           size="large"
//           color="green"
//           style={{ marginTop: 10 }}
//         />
//       )}

//       {!photo && (
//         <Button
//           title="Take Photo & Get Location"
//           onPress={takePhotoAndLocation}
//         />
//       )}
//       {isSubmitting && (
//         <View style={styles.overlay}>
//           <ActivityIndicator size="large" color="white" />
//           <Text style={{ color: "white", marginTop: 10 }}>Submitting...</Text>
//         </View>
//       )}

//       {photo && (
//         <View style={{ alignItems: "center", marginTop: 10 }}>
//           <Image
//             source={{ uri: photo.uri }}
//             style={{ width: 100, height: 100 }}
//           />
//           {loadingAddress ? (
//             <ActivityIndicator
//               size="small"
//               color="blue"
//               style={{ marginTop: 5 }}
//             />
//           ) : (
//             <Text
//               style={{
//                 textAlign: "center",
//                 marginTop: 5,
//                 paddingHorizontal: 10,
//               }}
//             >
//               {address}
//             </Text>
//           )}
//         </View>
//       )}

//       <Button
//         title="Submit Proof"
//         onPress={() => {
//           uploadProof();
//         }}
//         disabled={isSubmitting}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   button: {
//     backgroundColor: "white",
//     padding: 10,
//     marginVertical: 10,
//     alignSelf: "center",
//     borderRadius: 8,
//   },
//   text: {
//     color: "black",
//     fontWeight: "bold",
//     fontSize: 18,
//   },
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   overlay: {
//     position: "absolute",
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     backgroundColor: "rgba(0,0,0,0.6)",
//     justifyContent: "center",
//     alignItems: "center",
//     zIndex: 10,
//   },
// });

import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  View,
  Button,
  Image,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as Location from "expo-location";
import { useFocusEffect } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import EmailPicker from "./EmailPicker";

export default function AgentHome({ route }) {
  const cameraRef = useRef(null);
  const [photo, setPhoto] = useState(null);
  const [location, setLocation] = useState(null);
  const [facing, setFacing] = useState("back");
  const { deliveryID, email } = route.params;
  const navigation = useNavigation();
  const [showCamera, setShowCamera] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [locationPermissionGranted, setLocationPermissionGranted]=useState(false);
  const [address, setAddress] = useState("");
  const [loadingAddress, setLoadingAddress] = useState(false);

  const GEOCODING_API_KEY = process.env.EXPO_PUBLIC_GEOCODING_KEY;

  const api = process.env.EXPO_PUBLIC_BACKEND_API;

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        const isEnabled = await Location.hasServicesEnabledAsync();
        setLocationPermissionGranted(status === "granted" && isEnabled);
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

  const logout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () =>
          navigation.reset({
            index: 0,
            routes: [{ name: "Login" }],
          }),
      },
    ]);
  };

  const uploadImageToPinata = async (photo) => {
    const formData = new FormData();
    formData.append("file", {
      uri: photo.uri,
      name: "photo.jpg",
      type: "image/jpeg",
    });

    try {
      const response = await fetch(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.EXPO_PUBLIC_PINATA_JWT}`,
          },
          body: formData,
        }
      );

      const data = await response.json();
      if (!data.IpfsHash) throw new Error("No IpfsHash returned from Pinata");
      return `https://gateway.pinata.cloud/ipfs/${data.IpfsHash}`;
    } catch (err) {
      console.error("Pinata upload failed", err);
      throw err;
    }
  };

  const fetchAddressFromCoords = async (latitude, longitude) => {
    try {
      setLoadingAddress(true);
      const response = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${GEOCODING_API_KEY}`
      );
      const data = await response.json();
      setAddress(data?.results?.[0]?.formatted || "Address not found");
    } catch {
      setAddress("Failed to fetch address");
    } finally {
      setLoadingAddress(false);
    }
  };

  const takePhotoAndLocation = async () => {
    try {
      if (!locationPermissionGranted) {
        Alert.alert("Location not granted", "Enable location to proceed");
        return;
      }

      if (!cameraRef.current) return;
      const pic = await cameraRef.current.takePictureAsync();
      const loc = await Location.getCurrentPositionAsync();

      setPhoto(pic);
      setLocation(loc);
      setShowCamera(false);
      setAddress("");
      fetchAddressFromCoords(loc.coords.latitude, loc.coords.longitude);
    } catch (e) {
      console.error("Error taking photo/location:", e);
      Alert.alert("Error", "Failed to take photo or get location");
    }
  };

  const uploadProof = async () => {
    try {
      setIsSubmitting(true);
      const ipfsImageUrl = await uploadImageToPinata(photo);
      const payload = {
        image: ipfsImageUrl,
        location: address,
        timestamp: Math.floor(Date.now() / 1000),
        deliveryId: deliveryID,
        userId: email,
      };

      const response = await fetch(`${api}/submitDeliveryProof`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (data.status === "success") {
        Alert.alert("Proof Submitted", `Tx Hash: ${data.txHash}`);
      } else {
        Alert.alert("Submission Failed");
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to submit proof");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
        <MaterialIcons name="logout" size={22} color="white" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
      {showCamera ? (
        <View style={styles.cameraBox}>
          <CameraView ref={cameraRef} style={styles.camera} facing={facing} />
          <View style={styles.cameraBorder} />
        </View>
      ) : (
        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={() => {
            setPhoto(null);
            setLocation(null);
            setShowCamera(true);
          }}
        >
          <MaterialIcons name="camera-alt" size={24} color="white" />
          <Text style={styles.secondaryBtnText}>Retake Photo</Text>
        </TouchableOpacity>
      )}

      {!photo && (
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={takePhotoAndLocation}
        >
          <MaterialIcons name="location-on" size={24} color="white" />
          <Text style={styles.primaryBtnText}>Capture & Get Location</Text>
        </TouchableOpacity>
      )}

      {isSubmitting && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="white" />
          <Text style={{ color: "white", marginTop: 10 }}>Submitting...</Text>
        </View>
      )}

      {photo && (
        <View style={styles.previewContainer}>
          <Image source={{ uri: photo.uri }} style={styles.previewImage} />
          {loadingAddress ? (
            <ActivityIndicator
              size="small"
              color="blue"
              style={{ marginTop: 5 }}
            />
          ) : (
            <Text style={styles.addressText}>{address}</Text>
          )}

          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={uploadProof}
            disabled={isSubmitting}
          >
            <MaterialIcons name="cloud-upload" size={24} color="white" />
            <Text style={styles.primaryBtnText}>Submit Proof</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  logoutBtn: {
    flexDirection: "row",
    alignSelf: "flex-end",
    backgroundColor: "#dc3545",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginBottom: 10,
  },
  logoutText: {
    color: "white",
    marginLeft: 6,
    fontWeight: "600",
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f8f9fa",
    alignItems: "center",
  },
  cameraBox: {
    width: "100%",
    height: 300,
    position: "relative",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 16,
  },
  camera: {
    flex: 1,
  },
  cameraBorder: {
    position: "absolute",
    top: 10,
    bottom: 10,
    left: 10,
    right: 10,
    borderColor: "#00bcd4",
    borderWidth: 2,
    borderRadius: 12,
  },
  primaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#007bff",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 30,
    marginVertical: 10,
  },
  primaryBtnText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 10,
  },
  secondaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#6c757d",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginVertical: 10,
  },
  secondaryBtnText: {
    color: "white",
    fontSize: 15,
    marginLeft: 8,
  },
  previewContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  previewImage: {
    width: 300,
    height: 300,
    borderRadius: 8,
  },
  addressText: {
    textAlign: "center",
    marginTop: 20,
    paddingHorizontal: 20,
    fontSize: 18,
    fontWeight: "800",
    color: "#333",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
});

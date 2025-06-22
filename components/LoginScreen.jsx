// import React, { useState } from "react";
// import { Alert } from "react-native";
// import styled from "styled-components/native";
// import { signInWithEmailAndPassword } from "firebase/auth";
// import { auth } from "../firebaseConfig";
// import { useNavigation } from "@react-navigation/native";
// import * as Location from "expo-location";
// import * as Linking from "expo-linking";

// const Container = styled.View`
//   flex: 1;
//   padding: 24px;
//   background-color: #f5f7fa;
//   justify-content: center;
// `;

// const Title = styled.Text`
//   font-size: 28px;
//   font-weight: bold;
//   margin-bottom: 32px;
//   color: #1a1a1a;
//   text-align: center;
// `;

// const Label = styled.Text`
//   font-size: 16px;
//   margin-bottom: 8px;
//   color: #333;
// `;

// const Input = styled.TextInput`
//   border: 1px solid #ccc;
//   border-radius: 8px;
//   padding: 12px;
//   margin-bottom: 16px;
//   background-color: white;
// `;

// const RadioGroup = styled.View`
//   flex-direction: row;
//   justify-content: space-around;
//   margin-bottom: 24px;
// `;

// const RadioButton = styled.TouchableOpacity`
//   flex-direction: row;
//   align-items: center;
// `;

// const RadioCircle = styled.View`
//   height: 20px;
//   width: 20px;
//   border-radius: 10px;
//   border-width: 2px;
//   border-color: #007bff;
//   align-items: center;
//   justify-content: center;
//   margin-right: 8px;
// `;

// const SelectedCircle = styled.View`
//   height: 10px;
//   width: 10px;
//   border-radius: 5px;
//   background-color: #007bff;
// `;

// const RadioText = styled.Text`
//   font-size: 16px;
//   color: #444;
// `;

// const StyledButton = styled.TouchableOpacity`
//   background-color: #007bff;
//   padding: 14px;
//   border-radius: 8px;
//   align-items: center;
// `;

// const ButtonText = styled.Text`
//   color: white;
//   font-size: 16px;
//   font-weight: bold;
// `;

// export default function LoginScreen({ setIsLoggedIn, setRole }) {
//   const [email, setEmail] = useState("");
//   const [deliveryID, setDeliveryID] = useState("");
//   const [selectedRole, setSelectedRole] = useState("agent");
//   const navigation = useNavigation();

//   const checkLocationAccess = async () => {
//     const { status } = await Location.requestForegroundPermissionsAsync();
//     const isEnabled = await Location.hasServicesEnabledAsync();

//     if (status !== "granted") {
//       Alert.alert(
//         "Location Permission Required",
//         "This app needs location access to continue.",
//         [{ text: "Open Settings", onPress: () => Linking.openSettings() }]
//       );
//       return false;
//     }

//     if (!isEnabled) {
//       Alert.alert(
//         "GPS Disabled",
//         "Please enable location services (GPS) from your phone settings.",
//         [{ text: "Open Settings", onPress: () => Linking.openSettings() }]
//       );
//       return false;
//     }

//     try {
//       await Location.getCurrentPositionAsync();
//       return true;
//     } catch (err) {
//       Alert.alert(
//         "Unable to Get Location",
//         "Location services are required to proceed."
//       );
//       return false;
//     }
//   };

//   const login = async () => {
//     const locationReady = await checkLocationAccess();
//     if (!locationReady) return;

//     try {
//       if (selectedRole === "agent") {
//         navigation.navigate("Delivery-Agent", { deliveryID,email });
//       } else {
//         navigation.navigate("User", { deliveryID });
//       }
//     } catch (err) {
//       Alert.alert("Login Failed", err.message || "Invalid credentials");
//     }
//   };

//   return (
//     <Container>
//       <Title>OnChain-Delivery-App</Title>

//       <Label>Email</Label>
//       <Input
//         placeholder="Enter your email"
//         value={email}
//         onChangeText={setEmail}
//         keyboardType="email-address"
//         autoCapitalize="none"
//       />

//       <Label>Delivery ID</Label>
//       <Input
//         placeholder="Enter your delivery ID"
//         value={deliveryID}
//         onChangeText={setDeliveryID}
//         autoCapitalize="none"
//       />

//       <RadioGroup>
//         <RadioButton onPress={() => setSelectedRole("agent")}>
//           <RadioCircle>
//             {selectedRole === "agent" && <SelectedCircle />}
//           </RadioCircle>
//           <RadioText>Delivery Agent</RadioText>
//         </RadioButton>

//         <RadioButton onPress={() => setSelectedRole("user")}>
//           <RadioCircle>
//             {selectedRole === "user" && <SelectedCircle />}
//           </RadioCircle>
//           <RadioText>User</RadioText>
//         </RadioButton>
//       </RadioGroup>

//       <StyledButton onPress={login}>
//         <ButtonText>Login</ButtonText>
//       </StyledButton>
//     </Container>
//   );
// }

import React, { useState ,useEffect} from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from "react-native";
import styled from "styled-components/native";
import { useNavigation } from "@react-navigation/native";
import * as Location from "expo-location";
import * as Linking from "expo-linking";
import EmailPicker from "../components/EmailPicker";

const AppIcon = require("../assets/icon.jpg");

const Container = styled(KeyboardAvoidingView)`
  flex: 1;
  background-color: #f4f6fb;
`;

const InnerWrapper = styled(ScrollView)`
  padding: 32px 24px;
`;

const Header = styled.View`
  align-items: center;
  margin-bottom: 36px;
`;

const AppTitle = styled.Text`
  font-size: 30px;
  font-weight: bold;
  color: #222;
  margin-top: 12px;
`;

const Label = styled.Text`
  font-size: 16px;
  margin-bottom: 6px;
  color: #555;
`;
const WarningText = styled.Text`
  font-size: 14px;
  color: #dc3545; /* Bootstrap's danger red */
  margin-bottom: 16px;
  background-color: #f8d7da;
  padding: 10px 12px;
  border-radius: 8px;
  line-height: 20px;
`;

const Input = styled.TextInput`
  border: 1px solid #ccc;
  border-radius: 12px;
  padding: 14px 16px;
  margin-bottom: 20px;
  background-color: white;
  font-size: 16px;
  elevation: 2;
`;

const RadioGroup = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 30px;
`;

const RadioButton = styled.TouchableOpacity`
  flex: 1;
  flex-direction: row;
  align-items: center;
  padding: 12px;
  border: 2px solid ${({ selected }) => (selected ? "#007bff" : "#ccc")};
  border-radius: 10px;
  margin: 0 5px;
  background-color: ${({ selected }) => (selected ? "#eaf3ff" : "white")};
`;

const RadioText = styled.Text`
  font-size: 16px;
  color: ${({ selected }) => (selected ? "#007bff" : "#444")};
`;

const RadioIcon = styled.View`
  height: 18px;
  width: 18px;
  border-radius: 9px;
  border-width: 2px;
  border-color: #007bff;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
`;

const SelectedDot = styled.View`
  height: 10px;
  width: 10px;
  border-radius: 5px;
  background-color: #007bff;
`;

const StyledButton = styled.TouchableOpacity`
  background-color: #007bff;
  padding: 16px;
  border-radius: 10px;
  align-items: center;
  shadow-color: #000;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  elevation: 3;
`;

const ButtonText = styled.Text`
  color: white;
  font-size: 16px;
  font-weight: bold;
`;

export default function LoginScreen({ setIsLoggedIn, setRole }) {
  const [email, setEmail] = useState("");
  const [deliveryID, setDeliveryID] = useState("");
  const [selectedRole, setSelectedRole] = useState("agent");
  const navigation = useNavigation();
  const AGENT_EMAIL = "agent@delivery.com";
  const USER_EMAIL = "user@delivery.com";
  const api = process.env.EXPO_PUBLIC_BACKEND_API;


  useEffect(() => {
    // Update email automatically based on selected role
    if (selectedRole === "agent") {
      setEmail("agent@delivery.com");
    } else {
      setEmail("user@delivery.com");
    }
  }, [selectedRole]);

  const checkLocationAccess = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    const isEnabled = await Location.hasServicesEnabledAsync();
  

    if (status !== "granted") {
      Alert.alert(
        "Location Permission Required",
        "This app needs location access to continue.",
        [{ text: "Open Settings", onPress: () => Linking.openSettings() }]
      );
      return false;
    }

    if (!isEnabled) {
      Alert.alert(
        "GPS Disabled",
        "Please enable location services (GPS) from your phone settings.",
        [{ text: "Open Settings", onPress: () => Linking.openSettings() }]
      );
      return false;
    }

    try {
      await Location.getCurrentPositionAsync();
      return true;
    } catch (err) {
      Alert.alert(
        "Unable to Get Location",
        "Location services are required to proceed."
      );
      return false;
    }
  };

  const login = async () => {
    const locationReady = await checkLocationAccess();
    if (!locationReady) return;

    try {
     
      

      if (selectedRole === "agent") {
        navigation.navigate("Delivery-Agent", { deliveryID, email });
      } else {
        const response = await fetch(
          `${api}/getDeliveryProof?deliveryId=${deliveryID}`
        );
        if (response.status === 404) {
          Alert.alert(
            "Delivery Not Found",
            "Your delivery ID is not with us. Please create a delivery from the delivery agent."
          );
          return;
        }
        navigation.navigate("User", { deliveryID });
      }
    } catch (err) {
      Alert.alert("Login Failed", err.message || "Invalid credentials");
    }
  };

  return (
    <Container behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <InnerWrapper>
        <Header>
          <Image
            source={AppIcon}
            style={{ width: 300, height: 200, resizeMode: "contain" }}
          />
          <AppTitle>OnChain Delivery App</AppTitle>
        </Header>

        <EmailPicker selected={email} onSelect={setEmail} />

        <Label>Delivery ID</Label>
        <Input
          placeholder="Enter your delivery ID"
          value={deliveryID}
          onChangeText={setDeliveryID}
          autoCapitalize="none"
        />
        {selectedRole === "user" && (
          <WarningText>
            ⚠️ Please use the same Delivery ID you used while creating the
            delivery when logging in as a User.
          </WarningText>
        )}

        <RadioGroup>
          <RadioButton
            selected={selectedRole === "agent"}
            onPress={() => {
              setSelectedRole("agent");
              setEmail(AGENT_EMAIL); // <-- set email to agent
            }}
          >
            <RadioIcon>{selectedRole === "agent" && <SelectedDot />}</RadioIcon>
            <RadioText selected={selectedRole === "agent"}>
              Delivery Agent
            </RadioText>
          </RadioButton>

          <RadioButton
            selected={selectedRole === "user"}
            onPress={() => {
              setSelectedRole("user");
              setEmail(USER_EMAIL); // <-- set email to user
            }}
          >
            <RadioIcon>{selectedRole === "user" && <SelectedDot />}</RadioIcon>
            <RadioText selected={selectedRole === "user"}>User</RadioText>
          </RadioButton>
        </RadioGroup>

        <StyledButton onPress={login}>
          <ButtonText>Login</ButtonText>
        </StyledButton>
      </InnerWrapper>
    </Container>
  );
}

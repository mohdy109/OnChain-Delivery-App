// import React, { useEffect, useState } from "react";
// import { View, Text, Alert, Image } from "react-native";

// export default function UserHome({ route }) {
//   const { deliveryID } = route.params;
//   const [proof, setProof] = useState(null);

//   useEffect(() => {
//     if (!deliveryID) return;
//     fetchProof();
//   }, [deliveryID]);

//   const fetchProof = async () => {
//     try {
//       const response = await fetch(
//         `http://192.168.1.98:5050/getDeliveryProof?deliveryId=${deliveryID}`
//       );
//       const data = await response.json();
//       setProof(data);
//     } catch (err) {
//       console.error(err);
//       Alert.alert("Error", "Unable to fetch delivery proof");
//     }
//   };

//   return (
//     <View style={{ padding: 20 }}>
//       <Text>Delivery ID: {deliveryID}</Text>
//       {proof ? (
//         <View style={{ marginTop: 20 }}>
//           <Text>Delivery ID: {proof.deliveryId}</Text>
//           <Text>Agent Email: {proof.agentEmail}</Text>
//           <Text>Location: {proof.location}</Text>
//           <Text>
//             Timestamp: {new Date(Number(proof.timestamp)).toLocaleString()}
//           </Text>
//           <Text>Transaction Hash: {proof.txHash || "N/A"}</Text>
//           {proof.photoUrl && (
//             <Image
//               source={{ uri: proof.photoUrl }}
//               style={{ width: 200, height: 200, marginTop: 10 }}
//             />
//           )}
//         </View>
//       ) : (
//         <Text>Fetching delivery proof...</Text>
//       )}
//     </View>
//   );
// }

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Alert,
  Image,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import { MaterialIcons, Entypo } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import placeholderImage from "../assets/icon.jpg";

export default function UserHome({ route }) {
  const { deliveryID } = route.params;
  const [proof, setProof] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const [imageLoading, setImageLoading] = useState(true);
  const api = process.env.EXPO_PUBLIC_BACKEND_API;
  useEffect(() => {
    if (!deliveryID) return;
    fetchProof();
  }, [deliveryID]);

  const fetchProof = async () => {
    try {
      const response = await fetch(
        `${api}/getDeliveryProof?deliveryId=${deliveryID}`
      );
      const data = await response.json();
      setProof(data);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Unable to fetch delivery proof");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text) => {
    await Clipboard.setStringAsync(text);
    Alert.alert("Copied", "Transaction hash copied to clipboard.");
  };

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

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Fetching delivery proof...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
        <MaterialIcons name="logout" size={22} color="white" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      <Text style={styles.header}>📦 Delivery Proof Summary</Text>

      <View style={styles.card}>
        <View style={styles.row}>
          <MaterialIcons name="badge" size={20} color="#007bff" />
          <Text style={styles.label}>Delivery ID:</Text>
        </View>
        <Text style={styles.value}>{proof?.deliveryId}</Text>

        <View style={styles.row}>
          <MaterialIcons name="email" size={20} color="#28a745" />
          <Text style={styles.label}>Agent Email:</Text>
        </View>
        <Text style={styles.value}>{proof?.agentEmail}</Text>

        <View style={styles.row}>
          <Entypo name="location-pin" size={20} color="#dc3545" />
          <Text style={styles.label}>Location:</Text>
        </View>
        <Text style={styles.value}>{proof?.location}</Text>

        <View style={styles.row}>
          <MaterialIcons name="access-time" size={20} color="#ffc107" />
          <Text style={styles.label}>Timestamp:</Text>
        </View>
        <Text style={styles.value}>
          {proof?.timestamp
            ? new Date(Number(proof.timestamp) * 1000).toLocaleString()
            : "N/A"}
        </Text>

        <View style={styles.row}>
          <MaterialIcons name="receipt-long" size={20} color="#6f42c1" />
          <Text style={styles.label}>Transaction Hash:</Text>
        </View>
        <View style={styles.row}>
          <Text style={[styles.value, { flex: 1 }]}>
            {proof?.txHash || "Not available"}
          </Text>
          {proof?.txHash && (
            <TouchableOpacity onPress={() => copyToClipboard(proof.txHash)}>
              <MaterialIcons
                name="content-copy"
                size={20}
                color="#007bff"
                style={{ marginLeft: 8 }}
              />
            </TouchableOpacity>
          )}
        </View>

        <Text style={[styles.label, { marginTop: 12 }]}>Captured Photo:</Text>
        <View style={styles.imageContainer}>
          <Image
            source={
              proof?.photoUrl ? { uri: proof.photoUrl } : placeholderImage
            }
            style={styles.image}
            onLoadStart={() => setImageLoading(true)}
            onLoadEnd={() => setImageLoading(false)}
          />
          {imageLoading && (
            <ActivityIndicator
              size="small"
              color="#007bff"
              style={styles.imageLoader}
            />
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    height: 250,
    marginTop: 10,
    borderRadius: 10,
    overflow: "hidden",
  },
  imageLoader: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -10 }, { translateY: -10 }],
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#333",
  },
  container: {
    padding: 20,
    backgroundColor: "#f1f3f5",
    alignItems: "center",
    flexGrow: 1,
  },
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
  header: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#343a40",
    marginBottom: 20,
    textAlign: "center",
  },
  card: {
    backgroundColor: "white",
    width: "100%",
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "800",
    marginLeft: 6,
    color: "#444",
  },
  value: {
    fontSize: 16,
    color: "#333",
    marginLeft: 26,
    marginTop: 4,
  },
  image: {
    width: "100%",
    height: 250,
    borderRadius: 10,
    marginTop: 10,
    resizeMode: "cover",
  },
});

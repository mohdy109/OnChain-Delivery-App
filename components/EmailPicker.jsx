import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  Platform,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const EMAIL_OPTIONS = [
  { label: "Delivery Agent", value: "agent@example.com" },
  { label: "User", value: "user@example.com" },
];

export default function EmailPicker({ selected, onSelect }) {
  const [visible, setVisible] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Email</Text>

      <View style={[styles.dropdown, { backgroundColor: "#eee" }]}>
        <Text style={[styles.selectedText, { color: "#999" }]}>
          {selected || "Email not set"}
        </Text>
        <MaterialIcons name="lock" size={20} color="#999" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 6,
  },
  dropdown: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: Platform.OS === "ios" ? 14 : 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "#fff",
    borderColor: "#ccc",
    borderWidth: 1,
  },
  selectedText: {
    fontSize: 16,
    color: "#444",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    padding: 20,
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 10,
    maxHeight: "50%",
  },
  option: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  optionText: {
    fontSize: 16,
    color: "#333",
  },
});

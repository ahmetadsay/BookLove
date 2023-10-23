import React from "react";
import { View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { TouchableOpacity } from "react-native";
import BarCodeScan from "../app/barcodeScanner";


const Navbar = () => {
  return (
    <View style={styles.navbar}>
      <Ionicons name="home" size={32} color="black" />
      <TouchableOpacity onPress={() => router.push("profile")}>
        <Ionicons name="person-outline" size={32} color="black" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("barcodeScanner")}>
        <Ionicons name="add-circle-outline" size={48} color="black" />
      </TouchableOpacity>
      <Ionicons name="book-outline" size={32} color="black" />
      <Ionicons name="trophy-outline" size={32} color="black" />
    </View>
  );
};

const styles = StyleSheet.create({
  navbar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#fff",
    height: 60,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    paddingHorizontal: 20,
  },
});

export default Navbar;

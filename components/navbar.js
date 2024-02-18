import React from "react";
import { View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { TouchableOpacity } from "react-native";
import BarCodeScan from "../app/barcodeScanner";


const Navbar = () => {

 const goBack = () => {
    router.back();
  };

  return (
    <View style={styles.navbar}>
      <Ionicons name="home" size={32} color="black" />
      <TouchableOpacity onPress={() => router.push("profile")}>
        <Ionicons name="person-outline" size={32} color="black" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("barcodeScanner")}>
        <Ionicons name="add-circle-outline" size={48} color="black" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("freeBooks")}>
      <Ionicons name="book-outline" size={32} color="black" />
      </TouchableOpacity>
      <TouchableOpacity onPress={goBack}>
      <Ionicons name="arrow-back-outline" size={32} color="black" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  navbar: {
    position : "sticky",
    bottom: 0,
    left: 0,
    right: 0,
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

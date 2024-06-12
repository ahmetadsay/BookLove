import React from "react";
import { View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { usePathname } from "expo-router";
import { TouchableOpacity } from "react-native";
import { router } from "expo-router";



const Navbar = () => {
  const pathname = usePathname();
  console.log(pathname);

  const goBack = () => {
    router.back();
  };

  return (
    <View style={styles.navbar}>
      <TouchableOpacity
        onPress={() => router.push("home")}
        style={[styles.icon, pathname === "/home" && styles.underline]}
      >
        <Ionicons name="home" size={32} color="black" />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push("profile")}
        style={[styles.icon, pathname === "/profile" && styles.underline]}
      >
        <Ionicons name="person-outline" size={32} color="black" />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push("barcodeScanner")}
        style={[styles.icon, pathname === "/barcodeScanner" && styles.underline]}
      >
        <Ionicons name="add-circle-outline" size={48} color="black" />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push("freeBooks")}
        style={[styles.icon, pathname === "/freeBooks" && styles.underline]}
      >
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
    position: "sticky",
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
  icon: {
    alignItems: "center",
  },
  underline: {
    borderBottomWidth: 4, // You can adjust the width and color of the underline
    borderBottomColor: "black",
    marginTop: 5,

    
  },
});

export default Navbar;

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Navbar from "../components/navbar";

const Home = () => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Your main content goes here */}
      </View>
      <Navbar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#D0C4B0",
    justifyContent: "space-between", // This ensures the navbar stays at the bottom
  },
  content: {
    flex: 1, // This will take up the available space above the navbar
    backgroundColor: "#C2B7B7", // Background color for the main content
  },
});

export default Home;

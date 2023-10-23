
import Navbar from "../components/navbar";
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TextInput,} from "react-native";
import { Picker } from "@react-native-picker/picker";


const Home = () => {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    // Fetch user's name from authentication API and update state variable
    // ...
  }, []);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    // Fetch books from Google library API based on search query and selected category
    // ...
  }, [searchQuery, selectedCategory]);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.welcome}>Welcome {userName}</Text>
        <Text style={styles.message}>Which books would you like to check out today?</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for books"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <Picker
          style={styles.categoryPicker}
          selectedValue={selectedCategory}
          onValueChange={setSelectedCategory}
        >
          <Picker.Item label="All categories" value="all" />
          <Picker.Item label="Fiction" value="fiction" />
          <Picker.Item label="Non-fiction" value="nonfiction" />
        </Picker>

      
        {/* Render a Book component for each book */}
        {/* ... */}
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
    padding: 16,
  },
  welcome: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  message: {
    fontSize: 18,
    marginBottom: 16,
  },
  searchInput: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
  },
  categoryPicker: {
    marginBottom: 16,
  },
});

export default Home;


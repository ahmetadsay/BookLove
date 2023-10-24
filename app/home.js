import Navbar from "../components/navbar";
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { fetchBooksFromGoogleAPI } from "../library/bookStore"; 
import Book from "../components/book";

const Home = () => {
  const [userName, setUserName] = useState("John Doe"); // Replace with the user's name

  // State variables for search and category
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // State variable to store the list of books
  const [books, setBooks] = useState([]);

  let timer;

  // Function to fetch books when searchQuery or selectedCategory changes
  useEffect(() => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(async () => {
      const books = await fetchBooksFromGoogleAPI(searchQuery, selectedCategory);
      setBooks(books);
    }
    , 500);

  }, [searchQuery, selectedCategory]);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.welcome}>Welcome, {userName}</Text>
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
        
        {books ? (
        books.map((book, index) => (
          <Book key={index} book={book} />
        ))
      ) : (
        <Text>No books available</Text>
      )}
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
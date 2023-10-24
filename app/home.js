import Navbar from "../components/navbar";
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TextInput, ScrollView } from "react-native";

import { fetchBooksFromGoogleAPI } from "../library/bookStore";
import Book from "../components/book";
import { fetchCategoriesFromGoogleAPI } from "../library/categoryStore";

const Home = () => {
  const [userName, setUserName] = useState("John Doe");

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // State variable to store the trending books
  const [trendingBooks, setTrendingBooks] = useState([]);

  // State variable to store the list of books
  const [books, setBooks] = useState([]);

  let timer;

  useEffect(() => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(async () => {
      // Fetch books based on the searchQuery and selectedCategory
      const booksData = await fetchBooksFromGoogleAPI(
        searchQuery,
        selectedCategory
      );
      setBooks(booksData);

  
    }, 500);
  }, [searchQuery, selectedCategory]);

  useEffect(() => {
    const fetchTrendingBooks = async () => {
      const trendingBooksData = await fetchCategoriesFromGoogleAPI('Classics');
      console.log(trendingBooksData); // Add this line
      setTrendingBooks(trendingBooksData);
    };
  
    fetchTrendingBooks();
  }, []);
  

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.welcome}>Welcome, {userName}</Text>
        <Text style={styles.message}>
          Which books would you like to check out today?
        </Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for books"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        {books ? (
          <ScrollView>
            {books.map((book, index) => (
              <Book key={index} book={book} />
            ))}
          </ScrollView>
        ) : (
          <Text>No books available</Text>
        )}

        {/* Trending Categories */}
        <View style={styles.trendingCategories}>
          <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 8 }}>
            Trending Categories
          </Text>
          {trendingBooks.length > 0 ? (
            <ScrollView horizontal={true}>
              {trendingBooks.slice(0, 10).map((book, index) => (
                <Book key={index} book={book} />
              ))}
            </ScrollView>
          ) : (
            <Text>No trending books available</Text>
          )}
        </View>
      </View>
      <Navbar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#D0C4B0",
    justifyContent: "space-between",
  },
  content: {
    flex: 1,
    backgroundColor: "#C2B7B7",
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
  trendingCategories: {
    marginBottom: 16,
    
  },
});

export default Home;

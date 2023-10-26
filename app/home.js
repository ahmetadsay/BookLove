import Navbar from "../components/navbar";
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TextInput, ScrollView } from "react-native";
import { fetchBooksFromGoogleAPI } from "../library/bookStore";
import Book from "../components/book";
import { fetchCategoriesFromGoogleAPI } from "../library/categoryStore";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const Home = () => {
  const [userName, setUserName] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // State variable to store the trending books
  const [trendingBooks, setTrendingBooks] = useState([]);

  // State variable to store the list of books
  const [books, setBooks] = useState([]);

  const categories = [
    "Classics",
    "Novels",
    "Fantasy",
    "Mystery",
    "Horror",
    "Romance",
    "Comics",
  ];

  const trendingBoksByCategory = {};

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
    const fetchTrendingBooks = async (category) => {
      const trendingBooksData = await fetchCategoriesFromGoogleAPI(category);
      trendingBoksByCategory[category] = trendingBooksData;
      setTrendingBooks({ ...trendingBoksByCategory });
    };
    categories.forEach((category) => {
      fetchTrendingBooks(category);
    });
  }, []);

  useEffect(() => {
    // give me the current user datas from firebase and console.log it
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log(user);
        setUserName(user.displayName);
      } else {
        console.log("user is not logged in");
      }
    });
  }, []);

  return (
    <ScrollView style={styles.container}>
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
          <ScrollView
            horizontal={true}
            contentContainerStyle={styles.booksScrollView}
          >
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


        {/* Render the books according to category */}
        {categories.map((category) => (
          <View key={category}>
            <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 8 }}>
              {category}
            </Text>
            {trendingBooks[category] ? (
              <ScrollView horizontal={true}>
                {trendingBooks[category].slice(0, 10).map((book, index) => (
                  <Book key={index} book={book} />
                ))}
              </ScrollView>
            ) : (
              <Text>No books available</Text>
            )}
          </View>
        ))}
      </View>
      <Navbar />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#D0C4B0",
  },
  booksScrollView: {
    flexDirection: "row",
    flexWrap: "wrap",
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

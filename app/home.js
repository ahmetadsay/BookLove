import Navbar from "../components/navbar";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { fetchBooksFromGoogleAPI } from "../library/bookStore";
import Book from "../components/book";
import { fetchCategoriesFromGoogleAPI } from "../library/categoryStore";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Ionicons } from "@expo/vector-icons";
const Home = () => {
  const [userName, setUserName] = useState(null);
  const [loading, setLoading] = useState(true); // Initialize loading to true

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
      // Update the loading state when data is loaded
      setLoading(false);
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
    // give me the current user data from Firebase and console.log it
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

  return loading ? (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#007BFF" />
      <Text style={styles.loadingText}>Loading...</Text>
    </View>
  ) : (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.welcome}>Welcome, {userName}!</Text>
        <Text style={styles.message}>
          Which books would you like to check out today?
        </Text>

        {/* add search icon inside of search input  */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",

            
            marginBottom: 16,
          }}
        >
          <Ionicons
            name="search"
            size={24}
            color="black"
            style={{ marginRight: 8 , marginBottom: 9 }}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for books"
            onChangeText={(text) => setSearchQuery(text)}
            value={searchQuery}
          />
        </View>


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
     null
        )}

 

        {/* Render the books according to category */}
        {categories.map((category) => (
          <View key={category}>
            <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 8, color: '#663300',  }}>
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
    backgroundColor: " #F5F5F5",
  },
  booksScrollView: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  content: {
    flex: 1,
    backgroundColor: "white",
    padding: 16,
  },
  welcome: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    color: '#663300',
  },
  message: {
    fontSize: 18,
    marginBottom: 16,
    color: "#A3A3A3",
  },
  searchInput: {
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
    flex: 1,

  },
  trendingCategories: {
    marginBottom: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
});

export default Home;

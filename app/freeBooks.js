import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  Image,
  TouchableOpacity,
} from "react-native";
import { StyleSheet } from "react-native";
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons for the search icon
import { router } from "expo-router";
import Navbar from "../components/navbar";

const FreeBooks = () => {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => {
      clearTimeout(timerId);
    };
  }, [search]);

  useEffect(() => {
    fetch(`https://gutendex.com/books/?search=${search}`)
      .then((response) => response.json())
      .then((data) => {
        setBooks(data.results.slice(0, 10)); // Only take the first 10 results
      })
      .catch((error) => {
        console.error(error);
      });
  }, [debouncedSearch]);

  const renderItem = ({ item }) => {
    return (
      <View style={styles.itemContainer}>
        <Image
          source={{ uri: item.formats["image/jpeg"] }}
          style={styles.coverImage}
        />
        <View style={styles.contentContainer}>
          <Text style={styles.title} numberOfLines={1} ellipsizeMode='tail' >{item.title}</Text>
          <Text numberOfLines={3} ellipsizeMode='tail'>{item.subjects.join(", ")}</Text>
          <Text style={styles.rating}>Rating: {item.download_count}</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push(`readBook/${item.id}`)}
          >
            <Text style={styles.buttonText}>Click for reading</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={24} color="black" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            onChangeText={(text) => setSearch(text)}
            value={search}
          />
        </View>
        <FlatList
          data={books}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
        />
      </View>
      <Navbar style={styles.navbar} />
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginHorizontal: 20,
    marginVertical: 10,


  },
  coverImage: {
    width: 100,
    borderRadius: 10,

  },
  contentContainer: {
    flex: 1,
    padding: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  author: {
    fontSize: 16,
  },
  rating: {
    fontSize: 14,
    marginBottom: 5,
  },
  button: {
    backgroundColor: "#23527C",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
  },
  navbar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export default FreeBooks;

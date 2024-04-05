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
import { router } from "expo-router";

const FreeBooks = () => {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch(`https://gutendex.com/books/?search=${search}`)
      .then((response) => response.json())
      .then((data) => {
        setBooks(data.results);
        console.log(data.results);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [search]);

  const renderItem = ({ item }) => {
    return (
      <View style={styles.itemContainer}>
        <Image
          source={{ uri: item.formats["image/jpeg"] }}
          style={styles.coverImage}
        />
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text>{item.subjects.join(", ")}</Text>
          <Text >{item.authors[0]}</Text>
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
    <View>
      <Text>Free Books</Text>
      <TextInput
        style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
        onChangeText={(text) => setSearch(text)}
        value={search}
      />
      <FlatList
        data={books}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
      />
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
    margin: 10,
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
    backgroundColor: "#000",
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
});

export default FreeBooks;

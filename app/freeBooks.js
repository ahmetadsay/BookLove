import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TextInput, Image, TouchableOpacity } from "react-native";
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
      })
      .catch((error) => {
        console.error(error);
      });
  }, [search]);

  const renderItem = ({ item }) => {
    return (
      <View>
        <Text>{item.title}</Text>
        <Text>{item.author}</Text>
        {item.formats["image/jpeg"] && (
          <Image
            source={{ uri: item.formats["image/jpeg"] }}
            style={{ width: 50, height: 50 }}
          />
        )}
        <Text>Rating: {item.download_count}</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push(`readBook/${item.id}`)}
        >
          <Text style={styles.buttonText}>Click for reading</Text>
        </TouchableOpacity>
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

    button: {
        backgroundColor: "#000",
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
        },
        buttonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center",
        },
});


export default FreeBooks;

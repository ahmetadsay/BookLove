import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

const Book = ({ book }) => {
  const router = useRouter();

  const id = book.id;

  const title = book.volumeInfo.title;

  if (!book) {
    return null; // Return null or some loading/empty state if book is undefined
  }

  // Provide the image source based on whether thumbnail exists or not
  const imageSource = book.volumeInfo.imageLinks && book.volumeInfo.imageLinks.thumbnail
    ? { uri: book.volumeInfo.imageLinks.thumbnail }
    : require("../assets/thebook.png"); // Fallback image path

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.push(`bookDetail/${id}`)}>
        <Image
          source={imageSource}
          style={styles.image}
        />
      </TouchableOpacity>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.author} ellipsizeMode="tail">
        {book.volumeInfo.authors && book.volumeInfo.authors[0]}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 150,
    marginRight: 16,
    marginBottom: 16,
  },
  image: {
    width: 130,
    height: 180,
    marginBottom: 8,
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  author: {
    fontSize: 16,
    color: "#A3A3A3",
  },
});

export default Book;

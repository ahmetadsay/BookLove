import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Button,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";

const Book = ({ book }) => {
  const router = useRouter();

  const id = book.id;

  const title = book.volumeInfo.title;
  console.log(id);
  if (!book) {
    return null; // Return null or some loading/empty state if book is undefined
  }

  return (
    <View style={styles.container}>
      {book.volumeInfo.imageLinks && book.volumeInfo.imageLinks.thumbnail && (
        <TouchableOpacity onPress={() => router.push(`bookDetail/${id}`)}>

       {    <Image
            source={{ uri: book.volumeInfo.imageLinks.thumbnail }}
            style={styles.image}
          />}
        </TouchableOpacity>
      )}
      <Text style={styles.title}>{book.volumeInfo.title}</Text>
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

  rating: {
    fontSize: 12,
  },
});

export default Book;

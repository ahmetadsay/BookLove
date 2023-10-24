import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

const Book = ({ book }) => {
  return (
    <View style={styles.container}>
      {book.volumeInfo.imageLinks && book.volumeInfo.imageLinks.thumbnail && (
        <Image
          source={{ uri: book.volumeInfo.imageLinks.thumbnail }}
          style={styles.image}
        />
      )}
      <Text style={styles.title}>{book.volumeInfo.title}</Text>
      <Text style={styles.description} numberOfLines={3} ellipsizeMode="tail">
        {book.volumeInfo.description}
      </Text>
      <Text style={styles.rating}>
        Rating: {book.volumeInfo.averageRating || "N/A"}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 16,
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    width: 200,
    height: 'auto'
  },
  image: {
    width: 100,
    height: 150,
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  description: {
    fontSize: 14,
    marginBottom: 8,
  },
  rating: {
    fontSize: 12,
  },
});

export default Book;

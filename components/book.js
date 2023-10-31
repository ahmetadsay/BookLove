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
          <Image
            source={{ uri: book.volumeInfo.imageLinks.thumbnail }}
            style={styles.image}
          />

        </TouchableOpacity>
      )}
      <Text style={styles.title}>{book.volumeInfo.title}</Text>
      <Text style={styles.description} numberOfLines={3} ellipsizeMode="tail">
        {book.volumeInfo.description}
      </Text>
      <Text style={styles.rating}>
        Rating: {book.volumeInfo.averageRating || "N/A"}
      </Text>

    {/* create a button 'click for reading'  */}

   

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
    height: "auto",
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

import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const Book = ({ book }) => {
  const router = useRouter();

  const id = book.id;

  const title = book.volumeInfo.title;

  const bookImageUrl = book.volumeInfo.imageLinks
  console.log(bookImageUrl)

  if (!book) {
    return null; // Return null or some loading/empty state if book is undefined
  }

  // Provide the image source based on whether thumbnail exists or not
  const imageSource =
    book.volumeInfo.imageLinks && book.volumeInfo.imageLinks.thumbnail
      ? { uri: book.volumeInfo.imageLinks.thumbnail }
      : require("../assets/thebook.png"); // Fallback image path

  const handleAddToCollection = async () => {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (!currentUser) {
      alert("You must be signed in to add a book to your collection!");
      return;
    }

    try {
      const db = getFirestore();
      const userCollection = collection(db, "userCollection");
      await addDoc(userCollection, {
        userId: currentUser.uid,
        bookId: id,
        title: title,
        uri: bookImageUrl,
        // Add more book details you want to store
      });
      alert("Book added to your collection!");
    } catch (error) {
      console.error("Error adding book to collection:", error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.push(`bookDetail/${id}`)}>
        <Image source={imageSource} style={styles.image} />
      </TouchableOpacity>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.author} ellipsizeMode="tail">
        {book.volumeInfo.authors && book.volumeInfo.authors[0]}
      </Text>
      <TouchableOpacity
        onPress={handleAddToCollection}
        style={styles.addButton}
      >
        <Text style={styles.addButtonText}>Add</Text>
      </TouchableOpacity>
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
  addButton: {
    backgroundColor: "#23527C",
    borderRadius: 5,
    padding: 5,
    alignItems: "center",
    marginTop: 8,
  },
  addButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default Book;

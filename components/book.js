import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";

const Book = ({ book }) => {
  const router = useRouter();

  const id = book.id;

  const title = book.volumeInfo.title;

  const bookImageUrl = book.volumeInfo.imageLinks;

  const [isAdded, setIsAdded] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  if (!book) {
    return null; // Return null or some loading/empty state if book is undefined
  }

  // Provide the image source based on whether thumbnail exists or not
  const imageSource =
    book.volumeInfo.imageLinks && book.volumeInfo.imageLinks.thumbnail
      ? { uri: book.volumeInfo.imageLinks.thumbnail }
      : require("../assets/thebook.png"); // Fallback image path

  const handleLİkeBook = async () => {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (!currentUser) {
      alert("You must be signed in to add a book to your collection!");
      return;
    }

    try {
      const db = getFirestore();
      const userCollection = collection(db, "userLikeCollection");
      await addDoc(userCollection, {
        userId: currentUser.uid,
        bookId: id,
        title: title,
        uri: bookImageUrl,
        // Add more book details you want to store
      });
      setIsLiked(true);
      alert(
        "Success!, Book added to your like collection!",
        [{ text: "OK", onPress: () => console.log("OK Pressed") }],
        { cancelable: false }
      );
    } catch (error) {
      console.error("Error adding book to collection:", error);
    }
  };

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
      setIsAdded(true);
    } catch (error) {
      console.error("Error adding book to collection:", error);
    }
  };

  const showAlert = () => {
    alert(
      "Success!, Book added to your collection!",
      [{ text: "OK", onPress: () => console.log("OK Pressed") }],
      { cancelable: false }
    );
  };
  return (
    <View style={styles.container}>
      {isAdded && showAlert()}
      <TouchableOpacity onPress={() => router.push(`bookDetail/${id}`)}>
        <Image source={imageSource} style={styles.image} />
      </TouchableOpacity>
      <View style={styles.textContainer}>
  <Text style={styles.title}>{title}</Text>
  <Text style={styles.author} ellipsizeMode="tail">
    {book.volumeInfo.authors && book.volumeInfo.authors[0]}
  </Text>
</View>
<View style={styles.rating}>
  {!isAdded && (
    <TouchableOpacity
      onPress={handleAddToCollection}
      style={styles.addButton}
    >
      <Ionicons
        name="add-circle"
        size={32}
        color="gray"
        style={styles.addIcon}
      />
    </TouchableOpacity>
  )}
  <TouchableOpacity onPress={handleLİkeBook} style={styles.heartButton}>
    <Ionicons
      name={"heart"}
      size={32}
      color="red"
    />
  </TouchableOpacity>
</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 160,
    marginRight: 16,
    backgroundColor: "white",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E5E5",

  },
  textContainer: {
    height: 60, // Adjust this value as needed
    padding: 8,
  },
  image: {
    width: "100%",
    height: 200,
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    position: "relative",
    padding: 8,
    marginTop: 24,
  },


});

export default Book;

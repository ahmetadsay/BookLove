import React, { useEffect } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { getDocs, query, where } from "firebase/firestore";

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
      : require("../assets/nacover.png"); // Fallback image path

  const handleLikeBook = async () => {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (!currentUser) {
      alert("You must be signed in to add a book to your collection!");
      return;
    }

    try {
      if (isLiked) {
        alert("You have already liked this book!");
        return;
      }
      const db = getFirestore();
      const userCollection = collection(db, "userLikeCollection");
      await addDoc(userCollection, {
        userId: currentUser.uid,
        bookId: id,
        title: title,
        uri: bookImageUrl,
        isLiked: !isLiked, // Toggle the like status
        // Add more book details you want to store
      });
      setIsLiked(!isLiked); // Toggle the state
      alert("Success!, Book added to your like collection!");
    } catch (error) {
      console.error("Error adding book to collection:", error);
    }
  };
  const fetchIsLiked = async () => {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (!currentUser) {
      return;
    }

    try {
      const db = getFirestore();
      const userLikeCollection = collection(db, "userLikeCollection");
      const q = query(
        userLikeCollection,
        where("bookId", "==", id),
        where("userId", "==", currentUser.uid)
      );
      const bookSnapshot = await getDocs(q);

      setIsLiked(!bookSnapshot.empty); // Set isLiked to true if any document exists, otherwise false
    } catch (error) {
      console.error("Error fetching user likes:", error);
    }
  };

  useEffect(() => {
    fetchIsLiked();
  }, []);

  const handleAddToCollection = async () => {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (!currentUser) {
      alert("You must be signed in to add a book to your collection!");
      return;
    }

    try {
      if (isAdded) {
        alert("You have already added this book to your collection!");
        return;
      }
      const db = getFirestore();
      const userCollection = collection(db, "userCollection");
      await addDoc(userCollection, {
        userId: currentUser.uid,
        bookId: id,
        title: title,
        uri: bookImageUrl,
        isAdded: !isAdded, // Toggle the like status

        // Add more book details you want to store
      });
      setIsAdded(!isAdded);
      alert("Success!, Book added to your like collection!"); // Toggle the state
    } catch (error) {
      console.error("Error adding book to collection:", error);
    }
  };

  const fetchAddCollection = async () => {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (!currentUser) {
      return;
    }

    try {
      const db = getFirestore();
      const userCollection = collection(db, "userCollection");
      const q = query(
        userCollection,
        where("bookId", "==", id),
        where("userId", "==", currentUser.uid)
      );
      const bookSnapshot = await getDocs(q);

      setIsAdded(!bookSnapshot.empty); // Set isLiked to true if any document exists, otherwise false
    } catch (error) {
      console.error("Error fetching user likes:", error);
    }
  }


  useEffect(() => {
    fetchAddCollection();
  }, []);

  return (
    <View style={styles.container}>
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
       
          <TouchableOpacity
            onPress={handleAddToCollection}
            style={styles.addButton}
          >
            <Ionicons
              name={isAdded ? "checkbox" : "add-circle"}
              size={32}
              color={isAdded ? "green" : "black"}
              style={styles.addIcon}
            />
          </TouchableOpacity>
     
        <TouchableOpacity onPress={handleLikeBook} style={styles.heartButton}>
          <Ionicons
            name={isLiked ? "heart" : "heart-outline"}
            size={32}
            color={isLiked ? "red" : "black"}
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

import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, ScrollView } from "react-native";
import { usePathname } from "expo-router";
import HTML from "react-native-render-html";
import Navbar from "../../components/navbar";

const BookDetail = ({}) => {
  const pathname = usePathname();
  const id = pathname.split("/")[2];
  const [book, setBook] = useState(null);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await fetch(
          `https://www.googleapis.com/books/v1/volumes/${id}`
        );
        const data = await response.json();
        setBook(data);
      } catch (error) {
        console.error("Error fetching book:", error);
      }
    };
    fetchBook();
  }, [id]);

  if (!book) {
    return null;
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.content}>
          {book.volumeInfo && book.volumeInfo.imageLinks && (
            <Image
              source={{ uri: book.volumeInfo.imageLinks.thumbnail }}
              style={styles.image}
            />
          )}
          {book.volumeInfo && book.volumeInfo.title && (
            <Text style={styles.title}>{book.volumeInfo.title}</Text>
          )}
          {book.volumeInfo && book.volumeInfo.authors && (
            <Text style={styles.author} ellipsizeMode="tail">
              {book.volumeInfo.authors[0]}
            </Text>
          )}
          {book.volumeInfo && book.volumeInfo.description && (
            <HTML source={{ html: book.volumeInfo.description }} />
          )}
        </View>
      </ScrollView>
      <Navbar style={styles.navbar} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,

    marginHorizontal: 20,
  },
  contentContainer: {
    flexGrow: 1,
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
    flexGrow: 1,
    paddingVertical: 20,
    gap: 20,
  },
  image: {
    width: 190,
    height: 280,
    marginBottom: 8,
    borderRadius: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  author: {
    fontSize: 16,
    color: "#A3A3A3",
    textAlign: "center",
  },
  navbar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export default BookDetail;

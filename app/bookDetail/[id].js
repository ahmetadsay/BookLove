import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { usePathname } from "expo-router";
import HTML from "react-native-render-html";

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

        <Text>
      About the author:
      </Text>

      {book.volumeInfo && book.volumeInfo.description && (
        <HTML source={{ html: book.volumeInfo.description }} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '%80',
    marginRight: 16,
    marginLeft: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 190,
    height: 280,
    marginBottom: 8,
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: 'center',
  },
  author: {
    fontSize: 16,
    color: "#A3A3A3",
    textAlign: 'center',
  },


});

export default BookDetail;

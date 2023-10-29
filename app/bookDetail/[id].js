import React, { useEffect, useState } from "react";
import { View, Text, Image } from "react-native";
import { usePathname } from "expo-router";
import HTML from "react-native-render-html";

const BookDetail = ({}) => {
  const pathname = usePathname();
  const id = pathname.split("/")[2];
  const [book, setBook] = useState(null);

  useEffect(() => {
    const fetchBook = async () => {
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes/${id}`
      );
      const data = await response.json();
      setBook(data);
    };
    fetchBook();
  }, []);

  if (!book) {
    return null;
  }

  return (
    <View>
      <Image
        source={{ uri: book.volumeInfo.imageLinks.thumbnail }}
        style={{ width: 200, height: 300 }}
      />
      <Text>{book.volumeInfo.title}</Text>

      <View >
        <HTML source={{ html: book.volumeInfo.description }} />
      </View>
      <Text>{book.volumeInfo.averageRating}</Text>

      {book.volumeInfo.authors.map((author) => (
        <Text>{author}</Text>
      ))}

      {book.volumeInfo.categories.map((category) => (
        <Text>{category}</Text>
      ))}

      {book.volumeInfo.industryIdentifiers.map((industryIdentifier) => (
        <Text>
          {industryIdentifier.type}: {industryIdentifier.identifier}
        </Text>
      ))}
    </View>
  );
};

export default BookDetail;

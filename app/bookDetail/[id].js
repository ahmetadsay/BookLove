import React, { useEffect, useState } from "react";
import { View, Text, Image } from "react-native";
import { usePathname } from "expo-router";

const BookDetail = ({  }) => {
    const pathname = usePathname();
    const id = pathname.split("/")[2];
    const [book, setBook] = useState(null);

    useEffect(() => {
        const fetchBook = async () => {
            const response = await fetch(`https://www.googleapis.com/books/v1/volumes/${id}`);
            const data = await response.json();
            setBook(data);
        };
        fetchBook();
    }

    , []);

    if (!book) {

        return null;

    }

    return (
        <View>
            <Image source={{ uri: book.volumeInfo.imageLinks.thumbnail }} style={{ width: 200, height: 300 }} />
            <Text>{book.volumeInfo.title}</Text>
            <Text>{book.volumeInfo.authors[0]}</Text>
            <Text>{book.volumeInfo.description}</Text>
        </View>
    );

        
};

export default BookDetail;

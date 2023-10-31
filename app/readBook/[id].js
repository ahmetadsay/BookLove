 // BookReader.js
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import axios from 'axios';
import HTML from 'react-native-render-html';
import { usePathname } from 'expo-router';

const BookReader = ({ bookId }) => {
  const [bookContent, setBookContent] = useState('');
  const pathname = usePathname();
  const id = pathname.split("/")[2];

  useEffect(() => {
    // Fetch the e-book content from the Project Gutenberg catalog API
    axios
      .get(`https://www.gutenberg.org/ebooks/${id}.txt.utf-8`)
      .then(response => {
        setBookContent(response.data);
      })
      .catch(error => {
        console.error('Error fetching book content: ', error);
      });
  }, [bookId]);

  return (
    <ScrollView>
      <HTML source={{ html: bookContent }} />
    </ScrollView>
  );
};

export default BookReader;

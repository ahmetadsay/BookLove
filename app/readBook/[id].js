import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Text, Button, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Navbar from '../../components/navbar';
import { usePathname } from 'expo-router'

const PAGE_SIZE = 1000; // Number of characters per page
const SCROLL_POSITION_KEY = 'scrollPosition_';

const BookReader = () => {
  const pathname = usePathname();
  const id = pathname.split("/")[2];
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch(`https://www.gutenberg.org/ebooks/${id}.txt.utf-8`);
        const text = await response.text();
        setContent(text);
        setTotalPages(Math.ceil(text.length / PAGE_SIZE));
        const savedPage = await AsyncStorage.getItem(SCROLL_POSITION_KEY + id);
        if (savedPage !== null) {
          setCurrentPage(Math.ceil(savedPage));
        }
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch book content:', error);
        setLoading(false);
      }
    };

    fetchContent();
  }, [id]);

  const handlePageChange = async (page) => {
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page);
      try {
        await AsyncStorage.setItem(SCROLL_POSITION_KEY + id, page.toString());
      } catch (error) {
        console.error('Failed to save current page:', error);
      }
    }
  };

  const getPageContent = () => {

    const start = currentPage * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    return content.substring(start, end);
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007BFF" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      ) : (
        <View style={styles.readerContainer}>
          <ScrollView contentContainerStyle={styles.pageContentContainer}>
            <Text style={styles.pageContent}>{getPageContent()}</Text>
          </ScrollView>
          <View style={styles.pagination}>
            <Button title="Previous" onPress={() => handlePageChange(currentPage - 1)} disabled={currentPage === 0} />
            <Text style={styles.pageInfo}>{`Page ${currentPage + 1} of ${totalPages}`}</Text>
            <Button title="Next" onPress={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages - 1} />
          </View>
        </View>
      )}
      <Navbar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  readerContainer: {
    flex: 1,
  },
  pageContentContainer: {
    padding: 20,
  },
  pageContent: {
    fontSize: 16,
    textAlign: 'justify',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  pageInfo: {
    fontSize: 16,
  },
});

export default BookReader;

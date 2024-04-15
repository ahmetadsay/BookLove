import React, { useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import { usePathname } from 'expo-router';
import Navbar from '../../components/navbar';


const BookReader = () => {

  const pathname = usePathname();
  const id = pathname.split("/")[2];
  const [loading, setLoading] = useState(true);
  const bookUrl = `https://www.gutenberg.org/ebooks/${id}.html.images`;

  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007BFF" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      )}

      <WebView
        source={{ uri: bookUrl }}
        style={{ ...styles.webview, display: loading ? 'none' : 'flex' }}
        onLoad={() => setLoading(false)}
      />
      <Navbar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
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
});

export default BookReader;


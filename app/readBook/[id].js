import React from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

const BookReader = () => {
  // Replace with the actual URL of the book in a reader-friendly format (e.g., "text/plain" or "text/html")
  const bookUrl = 'https://www.gutenberg.org/ebooks/1513.html.images';

  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: bookUrl }}
        style={styles.webview}
      />
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
});

export default BookReader;

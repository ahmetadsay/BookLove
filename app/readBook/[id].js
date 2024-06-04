import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import { usePathname } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Navbar from '../../components/navbar';

const SCROLL_POSITION_KEY = 'scrollPosition_';

const BookReader = () => {
  const pathname = usePathname();
  const id = pathname.split("/")[2];
  const [loading, setLoading] = useState(true);
  const [scrollPosition, setScrollPosition] = useState(0);
  const webViewRef = useRef(null);
  const bookUrl = `https://www.gutenberg.org/ebooks/${id}.html.images`;

  useEffect(() => {
    const loadScrollPosition = async () => {
      try {
        const savedPosition = await AsyncStorage.getItem(SCROLL_POSITION_KEY + id);
        if (savedPosition !== null) {
          setScrollPosition(Number(savedPosition));
        }
      } catch (error) {
        console.error('Failed to load scroll position:', error);
      }
    };

    loadScrollPosition();
  }, [id]);

  const handleMessage = async (event) => {
    const { data } = event.nativeEvent;
    try {
      await AsyncStorage.setItem(SCROLL_POSITION_KEY + id, data);
    } catch (error) {
      console.error('Failed to save scroll position:', error);
    }
  };

  const injectedJavaScript = `
    window.addEventListener('scroll', function() {
      window.ReactNativeWebView.postMessage(window.scrollY.toString());
    });
    true;
  `;

  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007BFF" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      )}

      <WebView
        ref={webViewRef}
        source={{ uri: bookUrl }}
        style={{ ...styles.webview, display: loading ? 'none' : 'flex' }}
        onLoad={() => {
          setLoading(false);
          webViewRef.current.injectJavaScript(`
            window.scrollTo(0, ${scrollPosition});
            true;
          `);
        }}
        injectedJavaScript={injectedJavaScript}
        onMessage={handleMessage}
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

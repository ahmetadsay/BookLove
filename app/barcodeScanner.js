import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Button } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { fetchBookData } from "../components/getBookIspn";
import Navbar from "../components/navbar";
import { Image } from "react-native";

export default function BarCodeScan() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [bookData, setBookData] = useState(null);

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true);
    const bookData = await fetchBookData(data);
    setBookData(bookData);
    console.log(bookData);
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.text}>Scan your book's barcode</Text>
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
        {scanned && (
          <>
            <Button
              title={"Tap to Scan Again"}
              onPress={() => setScanned(false)}
            />
            {bookData ? (
              <View style={styles.bookDataContainer}>
                {/* <Image
                  style={{ width: 100, height: 200 }}
                  source={{
                    uri: bookData.items[0].volumeInfo.imageLinks.thumbnail,
                  }}
                /> */}
                <Text style={styles.bookDataTitle}>
                  {bookData.items[0].volumeInfo.title}
                </Text>

                <Text style={styles.bookDataAuthor}>
                  {bookData.items[0].volumeInfo.authors[0]}
                </Text>
                <Text style={styles.bookDataDescription}>
                  {bookData.items[0].volumeInfo.description}
                </Text>
              </View>
            ) : (
              <Text style={styles.bookDataLoading}>Loading book data...</Text>
            )}
          </>
        )}
      </View>
      <Navbar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: "black",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  text: {
    fontSize: 20,
    color: "white",
    textAlign: "center",
    marginTop: 20,
  },
  bookDataContainer: {
    backgroundColor: "#fff",
    padding: 20,
    margin: 20,
    borderRadius: 5,
  },
  bookDataTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  bookDataAuthor: {
    fontSize: 16,
    marginBottom: 10,
  },
  bookDataDescription: {
    fontSize: 14,
  },
  bookDataLoading: {
    color: "#fff",
    textAlign: "center",
    marginTop: 20,
  },
});

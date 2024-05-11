import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Button } from "react-native";
import { fetchBookData } from "../components/getBookIspn";
import Navbar from "../components/navbar";
import { Image } from "react-native";
import { addDoc, collection } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { CameraView, Camera } from "expo-camera";
import { bookImage } from "../assets/book.png";
export default function BarCodeScan() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [bookData, setBookData] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getCameraPermissions();
  }, []);

  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true);
    const bookData = await fetchBookData(data);
    setBookData(bookData);
    console.log(bookData.items[0]);
    const auth = getAuth();
    const currentUser = auth.currentUser;

    try {
      const db = getFirestore();
      const image =
        bookData.items[0].volumeInfo.imageLinks?.smallThumbnail ||
       "https://d28hgpri8am2if.cloudfront.net/book_images/onix/cvr9781787550360/classic-book-cover-foiled-journal-9781787550360_xlg.jpg"
      await addDoc(collection(db, "scannedBooks"), {
        title: bookData.items[0].volumeInfo.title,
        image: image,
        userId: currentUser.uid,
      });
    } catch (error) {
      console.error("Error adding document: ", error);
    }

    alert("Automatically added to your to be read and loved  collection!");
  };

  if (hasPermission === null) {
    console.log("Request");
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    console.log("no access");
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.text}>Scan your book's barcode</Text>
        <CameraView
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          barcodeScannerSettings={{
            barCodeTypes: ["ean13"],
          }}
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
                {bookData.items[0].volumeInfo.imageLinks &&
                bookData.items[0].volumeInfo.imageLinks.smallThumbnail ? (
                  <Image
                    style={{ width: 210, height: 300 }}
                    source={{
                      uri: bookData.items[0].volumeInfo.imageLinks
                        .smallThumbnail,
                    }}
                  />
                ) : (
                  <Text>No image available</Text>
                )}
                <Text style={styles.bookDataTitle}>
                  {bookData.items[0].volumeInfo.title || "No title"}
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
    alignItems: "center",
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

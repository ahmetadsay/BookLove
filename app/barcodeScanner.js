import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Button, Modal, TouchableOpacity } from "react-native";
import { fetchBookData } from "../components/getBookIspn";
import Navbar from "../components/navbar";
import { Image } from "react-native";
import { addDoc, collection } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { Camera, useCameraDevices } from "react-native-vision-camera";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function BarCodeScan() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [bookData, setBookData] = useState(null);
  const [user, setUser] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(false);
  const devices = useCameraDevices();
  const device = devices.back;

  useEffect(() => {
    const getCameraPermissions = async () => {
      const status = await Camera.requestCameraPermission();
      setHasPermission(status === "authorized");
    };

    const checkWelcomeMessage = async () => {
      const hasSeenWelcome = await AsyncStorage.getItem('hasSeenWelcome');
      if (hasSeenWelcome === null) {
        setShowWelcomeMessage(true);
      }
    };

    getCameraPermissions();
    checkWelcomeMessage();
  }, []);

  const handleBarCodeScanned = async (barcode) => {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (!currentUser) {
      setModalVisible(true);
      setScanned(false);
      return;
    }

    setScanned(true);
    try {
      const bookData = await fetchBookData(barcode.displayValue);
      if (!bookData || !bookData.items || !bookData.items[0]) {
        throw new Error("Invalid book data");
      }
      setBookData(bookData);
      console.log(bookData.items[0]);

      const db = getFirestore();
      const image = bookData.items[0].volumeInfo.imageLinks?.smallThumbnail || 
        "https://d28hgpri8am2if.cloudfront.net/book_images/onix/cvr9781787550360/classic-book-cover-foiled-journal-9781787550360_xlg.jpg";
      
      await addDoc(collection(db, "scannedBooks"), {
        title: bookData.items[0].volumeInfo.title,
        image: image,
        userId: currentUser.uid,
      });

      alert("Automatically added to your to be read and loved collection!");
    } catch (error) {
      console.error("Error fetching book data: ", error);
      setBookData(null); // Clear book data on error
      alert("Failed to fetch book data. Please try again.");
    }
  };

  const handleWelcomeMessageClose = async () => {
    setShowWelcomeMessage(false);
    await AsyncStorage.setItem('hasSeenWelcome', 'true');
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
        {device && (
          <Camera
            style={StyleSheet.absoluteFillObject}
            device={device}
            isActive={!scanned}
            onInitialized={() => console.log('Camera initialized')}
            onError={(error) => console.error('Camera error', error)}
            frameProcessor={(frame) => {
              // Implement barcode scanning logic here
              // Call handleBarCodeScanned with the scanned barcode data
            }}
          />
        )}
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
                  {bookData.items[0].volumeInfo.authors ? bookData.items[0].volumeInfo.authors[0] : "No author"}
                </Text>
                <Text style={styles.bookDataDescription}>
                  {bookData.items[0].volumeInfo.description || "No description"}
                </Text>
              </View>
            ) : (
              <Text style={styles.bookDataLoading}>Loading book data...</Text>
            )}
          </>
        )}
      </View>
      <Navbar />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              You should sign-up to add books to your collection
            </Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.textStyle}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={showWelcomeMessage}
        onRequestClose={() => setShowWelcomeMessage(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              You can add books to your collection by scanning the barcode.
            </Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleWelcomeMessageClose}
            >
              <Text style={styles.textStyle}>Okay</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  closeButton: {
    backgroundColor: "#2196F3",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});
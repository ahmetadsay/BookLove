import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Button,
  Modal,
} from "react-native";
import { Image } from "react-native";
import { getAuth, signOut, deleteUser } from "firebase/auth";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { query, where, getDocs } from "firebase/firestore";
import { router } from "expo-router";
import Navbar from "../components/navbar";
import { ContributionGraph } from "react-native-chart-kit";
import { serverTimestamp } from "firebase/firestore";
import { ActivityIndicator } from "react-native";

const ProfilePage = () => {
  const [userGender, setUserGender] = useState("");
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [readBooks, setReadBooks] = useState([]);
  const [toReadBooks, setToReadBooks] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [readingData, setReadingData] = useState([]);

  const auth = getAuth();
  const currentUser = auth.currentUser;

  useEffect(() => {
    const fetchToReadBooks = async () => {
      if (currentUser) {
        const db = getFirestore();
        const userCollection = collection(db, "userLikeCollection");
        const userBooksQuery = query(
          userCollection,
          where("userId", "==", currentUser.uid)
        );
        const querySnapshot = await getDocs(userBooksQuery);
        const books = querySnapshot.docs.map((doc) => doc.data());
        setToReadBooks(books);
      }
    };

    fetchToReadBooks();
  }, [currentUser]);

  useEffect(() => {
    const fetchReadBooks = async () => {
      if (currentUser) {
        const db = getFirestore();
        const userCollection = collection(db, "userCollection");
        const userBooksQuery = query(
          userCollection,
          where("userId", "==", currentUser.uid)
        );
        const querySnapshot = await getDocs(userBooksQuery);
        const books = querySnapshot.docs.map((doc) => doc.data());
        setReadBooks(books);
      }
    };

    fetchReadBooks();
  }, [currentUser]);

  useEffect(() => {
    const fetchReadingData = async () => {
      const db = getFirestore();
      const readingCollection = collection(db, "userReading");
      const userReadingQuery = query(
        readingCollection,
        where("userId", "==", currentUser.uid)
      );
      const querySnapshot = await getDocs(userReadingQuery);
      const data = querySnapshot.docs.map((doc) => {
        const reading = doc.data();
        return { date: reading.date.toDate(), count: 1 };
      });
      setReadingData(data);
    };

    if (currentUser) {
      fetchReadingData();
    }
  }, [currentUser]);

  const handleReadBook = () => {
    if (!currentUser) {
      // Alert non-users to sign up for this feature
      alert("You should sign up for this feature.");
    } else {
      // Show the modal for reading progress
      setShowModal(true);
    }
  };

  const handleAddReadingProgress = async () => {
    if (currentUser) {
      // Add a new reading record for the current day
      const db = getFirestore();
      const readingCollection = collection(db, "userReading");
      await addDoc(readingCollection, {
        userId: currentUser.uid,
        date: serverTimestamp(),
      });

      // Close the modal and refresh the reading data
      setShowModal(false);
      const userReadingQuery = query(
        readingCollection,
        where("userId", "==", currentUser.uid)
      );
      const querySnapshot = await getDocs(userReadingQuery);
      const data = querySnapshot.docs.map((doc) => {
        const reading = doc.data();
        return { date: reading.date.toDate(), count: 1 };
      });
      setReadingData(data);

      // Alert the user
      alert("Successfully added!");
    }
  };

  useEffect(() => {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (!currentUser) {
      setLoading(false);
      return;
    }
  }, []);

  useEffect(() => {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (currentUser) {
      setUserName(currentUser.displayName);

      const db = getFirestore();
      const usersCollection = collection(db, "users");

      const userQuery = query(
        usersCollection,
        where("uid", "==", currentUser.uid)
      );

      getDocs(userQuery)
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            const userData = doc.data();
            setUserGender(userData.gender);
            setUserName(userData.name);
          });
        })
        .catch((error) => {
          console.error("Error getting user data:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, []);


  const handleLogOut = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        router.push("/login");
      })
      .catch((error) => {});
  };


  const handleDelete = () => {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    deleteUser(currentUser)
      .then(() => {
        router.push("/login");
      })
      .catch((error) => {});
  };
  const handleDeleteConfirmation = () => {
    setShowDeleteConfirmation(true);
  };
  const cancelDelete = () => {
    setShowDeleteConfirmation(false);
  };

  return (
    <View style={{ flex: 1 }}>
      {loading ? ( // Render a loading indicator
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <ScrollView contentContainerStyle={styles.ScrollViewContent}>
          <View style={styles.container}>
            <Text style={{ fontSize: 30, fontWeight: "bold" }}>Profile</Text>

            <TouchableOpacity onPress={handleLogOut}>
              <Image
                source={require("../assets/logout.png")}
                style={{ width: 30, height: 30 }}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.container}>
            {userGender === "Male" ? (
              <Image
                source={require("../assets/boy.png")}
                style={{ width: 100, height: 100, borderRadius: 50 }}
              />
            ) : userGender === "Female" ? (
              <Image
                source={require("../assets/girl.png")}
                style={{ width: 100, height: 100, borderRadius: 50 }}
              />
            ) : (
              <Image
                source={require("../assets/book.png")}
                style={{ width: 100, height: 100, borderRadius: 50 }}
              />
            )}
            {!userName && (
              <Text style={styles.profileName}> Hi booklover!</Text>
            )}
            <Text style={styles.profileName}> {userName} </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Change Theme</Text>
            <View style={styles.privacySettings}>
              <Text style={styles.privacyText}>Dark</Text>
              <Switch
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                ios_backgroundColor="#3e3e3e"

   
              />
              <Text style={styles.privacyText}>Light</Text>
            </View>
          </View>

          <View
            style={{ borderBottomWidth: 1, borderBottomColor: "#d3d3d3" }}
          />
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>The books I've read</Text>

            <ScrollView horizontal={true}>
              {readBooks.map((book, index) => (
                <View key={index} style={styles.bookContainer}>
                  <Image
                    source={{ uri: book.uri.thumbnail }}
                    style={styles.bookImage}
                  />
                  <Text style={styles.bookTitle}>{book.title}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
          <View
            style={{ borderBottomWidth: 1, borderBottomColor: "#d3d3d3" }}
          />
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Books I will read and like</Text>
            <ScrollView horizontal={true}>
              {toReadBooks.map((book, index) => (
                <View key={index} style={styles.bookContainer}>
                  {/* Modify to include heart icon */}
                  <TouchableOpacity onPress={() => handleLikeBook(book)}>
                    <Image
                      source={{ uri: book.uri.thumbnail }}
                      style={styles.bookImage}
                    />
                  </TouchableOpacity>
                  <Text style={styles.bookTitle}>{book.title}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
          <View
            style={{ borderBottomWidth: 1, borderBottomColor: "#d3d3d3" }}
          />
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Reading Progress</Text>

            <ContributionGraph
              values={readingData}
              endDate={new Date()}
              numDays={90}
              width="100%"
              height={220}
              
              chartConfig={{
                backgroundColor: '#1cc910',
                backgroundGradientFrom: '#eff3ff',
                backgroundGradientTo: '#efefef',
                decimalPlaces: 2,
                color: (opacity = 1) => `rgba(0, 20, 0, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
              }}
            />
            <TouchableOpacity onPress={handleReadBook}>
              <Text style={styles.button}>Add Reading Progress</Text>
            </TouchableOpacity>
          </View>

          <View
            style={{ borderBottomWidth: 1, borderBottomColor: "#d3d3d3" }}
          />
          {userName && (
            <TouchableOpacity onPress={handleDeleteConfirmation}>
              <Text style={styles.button}>Click here to delete account</Text>
            </TouchableOpacity>
          )}
          <Modal
            animationType="slide"
            transparent={true}
            visible={showDeleteConfirmation}
            onRequestClose={() => {
              setShowDeleteConfirmation(false);
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>
                  Are you sure you want to delete your account?
                </Text>
                <Button onPress={handleDelete} title="Yes" color="#841584" />
                <Button onPress={cancelDelete} title="No" color="#841584" />
              </View>
            </View>
          </Modal>
        </ScrollView>
      )}
      <Navbar />
      <Modal
        animationType="slide"
        transparent={true}
        visible={showModal}
        onRequestClose={() => {
          setShowModal(false);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Did you read a book today?</Text>
            <Button
              onPress={handleAddReadingProgress}
              title="Yes"
              color="#841584"
            />
            <Button
              onPress={() => setShowModal(false)}
              title="No"
              color="#841584"
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 30,
    padding: 20,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#d3d3d3",
  },
  profileName: {
    fontSize: 40,
    marginTop: 10,
    fontFamily: "sans-serif-condensed",
    fontWeight: "bold",
  },
  section: {
    margin: 20,
    gap: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  progressBar: {
    backgroundColor: "#d3d3d3",
    height: 10,
    borderRadius: 5,
    marginTop: 5,
    marginBottom: 5,
  },
  achievementItem: {
    marginBottom: 10,
  },
  achievementText: {
    fontSize: 16,
    color: "#6a5acd",
  },
  privacySettings: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
    marginBottom: 10,
  },
  privacyText: {
    fontSize: 16,
  },
  button: {
    backgroundColor: "#23527C",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    marginHorizontal: 20,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    gap: 20,
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
  bookImage: {
    width: 130,
    height: 180,
    marginBottom: 8,
    borderRadius: 8,
  },

  bookContainer: {
    width: 150,
    marginTop: 10,
    marginRight: 16,
    marginBottom: 16,
  },
});

export default ProfilePage;

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
import { Picker } from "@react-native-picker/picker";
import { Image } from "react-native";
import { getAuth, signOut, deleteUser } from "firebase/auth";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { query, where, getDocs } from "firebase/firestore";
import { router } from "expo-router";
import Navbar from "../components/navbar";
import { ContributionGraph } from "react-native-chart-kit";
import { serverTimestamp } from "firebase/firestore";

const ProfilePage = () => {
  // TAKE the user's gender from the database and display the appropriate image here

  const [userGender, setUserGender] = useState("");
  const [userName, setUserName] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [readingData, setReadingData] = useState([]);

  const auth = getAuth();
  const currentUser = auth.currentUser;

 
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

  useEffect(() => {
    // Fetch reading data when component mounts
    fetchReadingData();
  }, [currentUser.uid]);


  const handleReadBook = async () => {
    // Add a new reading record for the current day
    const auth = getAuth();
    const currentUser = auth.currentUser;
    const db = getFirestore();
    const readingCollection = collection(db, "userReading");
    await addDoc(readingCollection, {
      userId: currentUser.uid,
      date: serverTimestamp(),
    });

    // Close the modal and refresh the reading data
    setShowModal(false);
    fetchReadingData();

    // Alert the user
    alert("Successfully added!");
  };

  useEffect(() => {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (currentUser) {
      currentUser.displayName = userName;

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
        });
    }
  }, []);

  const [user, setUser] = useState({
    currentlyReading: [
      { title: "Book 1", author: "Author 1" },
      { title: "Book 2", author: "Author 2" },
    ],
    toRead: [
      { title: "Book 3", author: "Author 3" },
      { title: "Book 4", author: "Author 4" },
    ],
    friends: [{ name: "Friend 1" }, { name: "Friend 2" }],
    booksRead: 5,
    wordsSaved: 1000,
    // Add achievements and badges here
    achievements: [
      "Bookworm Badge",
      "Reading Challenge Champion",
      "Top Reviewer",
    ],
    isPublic: true,
    activityVisibility: "Friends",
  });

  const handleLogOut = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        router.push("/login");
      })
      .catch((error) => {});
  };

  const togglePrivacy = () => {
    setUser({ ...user, isPublic: !user.isPublic });
  };

  const handleVisibilityChange = (value) => {
    setUser({ ...user, activityVisibility: value });
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

  return (
    <View style={{ flex: 1 }}>
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
          {!userName && <Text style={styles.profileName}> Hi booklover!</Text>}
          <Text style={styles.profileName}> {userName} </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Change Theme</Text>
          <View style={styles.privacySettings}>
            <Text style={styles.privacyText}>Dark</Text>
            <Switch
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={user.isPublic ? "#f5dd4b" : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={togglePrivacy}
              value={user.isPublic}
            />
            <Text style={styles.privacyText}>Light</Text>
          </View>
        </View>

        <View style={{ borderBottomWidth: 1, borderBottomColor: "#d3d3d3" }} />
        <Text style={styles.sectionTitle}>Reading Progress</Text>

        <ContributionGraph
          values={readingData}
          endDate={new Date()}
          numDays={105}
          width="100%"
          height={220}
          chartConfig={{
            backgroundColor: "#d3d3d3",
            backgroundGradientFrom: "#fff",
            backgroundGradientTo: "#fff",
            decimalPlaces: 2, // optional, defaults to 2dp

            color: (opacity = 1) => `rgba(0, 20, 0, ${opacity})`,
            style: {
              borderRadius: 4,
            },
          }}
        />
        <TouchableOpacity onPress={() => setShowModal(true)}>
          <Text style={styles.button}>Add Reading Progress</Text>
        </TouchableOpacity>

        <View style={{ borderBottomWidth: 1, borderBottomColor: "#d3d3d3" }} />
        {userName && (
          <TouchableOpacity onPress={handleDelete}>
            <Text style={styles.button}> Clich here for delete account </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
      <Navbar />
      <Modal
        animationType="slide"
        transparent={true}
        visible={showModal}
        onRequestClose={() => {
          setShowModal(!showModal);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Did you read a book today?</Text>
            <Button onPress={handleReadBook} title="Yes" color="#841584" />
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
});

export default ProfilePage;

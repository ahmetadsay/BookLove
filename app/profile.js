import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Switch,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Image } from "react-native";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { getFirestore, doc, getDoc, collection } from "firebase/firestore";
import { query, where, getDocs } from "firebase/firestore";
import { router } from "expo-router";

const ProfilePage = () => {
  // TAKE the user's gender from the database and display the appropriate image here

  const [userGender, setUserGender] = useState("");
  const [userName, setUserName] = useState("");

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
        console.log("User signed out");
        router.push("/login");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const togglePrivacy = () => {
    setUser({ ...user, isPublic: !user.isPublic });
  };

  const handleVisibilityChange = (value) => {
    setUser({ ...user, activityVisibility: value });
  };

  return (
    <ScrollView>
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
        <Text style={styles.sectionTitle}>Activity Visibility</Text>
        <Picker
          selectedValue={user.activityVisibility}
          onValueChange={handleVisibilityChange}
        >
          <Picker.Item label="Public" value="Public" />
          <Picker.Item label="Friends" value="Friends" />
          <Picker.Item label="Private" value="Private" />
        </Picker>
      </View>

      {/* give me a straight line like hr */}
      <View style={{ borderBottomWidth: 1, borderBottomColor: "#d3d3d3" }} />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Books Read</Text>
        <View style={styles.progressBar}>
          <View
            style={{
              backgroundColor: "#6a5acd",
              height: 10,
              width: `${(user.booksRead / 10) * 100}%`,
            }}
          />
        </View>
        <Text>{user.booksRead} out of 10 books read</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Words Saved</Text>
        <View style={styles.progressBar}>
          <View
            style={{
              backgroundColor: "#6a5acd",
              height: 10,
              width: `${(user.wordsSaved / 10000) * 100}%`,
            }}
          />
        </View>
        <Text>{user.wordsSaved} out of 10000 words saved</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Comment Made</Text>
        <View style={styles.progressBar}>
          <View
            style={{
              backgroundColor: "#6a5acd",
              height: 10,
              width: `${(user.wordsSaved / 10000) * 100}%`,
            }}
          />
        </View>
        <Text>{user.wordsSaved} comments made</Text>
      </View>
      <View style={{ borderBottomWidth: 1, borderBottomColor: "#d3d3d3" }} />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Friend Recommendations</Text>
        <Text>Suggested Friends: Friend 3, Friend 4</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Achievements and Badges</Text>
        {user.achievements.map((achievement, index) => (
          <View key={index} style={styles.achievementItem}>
            <Text style={styles.achievementText}>{achievement}</Text>
          </View>
        ))}
      </View>

      {userName && (
        <TouchableOpacity>
          <Text style={styles.button}> Clich here for delete account </Text>
        </TouchableOpacity>
      )}
    </ScrollView>
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
    // give a background color and blur the background image to make the text more readable
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
});

export default ProfilePage;

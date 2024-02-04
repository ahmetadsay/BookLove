import React, { useState, useEffect} from "react";
import { StyleSheet, View, Text, Image, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';

const index = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [firstLaunch, setFirstLaunch] = useState(null);
  const slides = [
    {
      image: require("../assets/book.png"),
      title: "Welcome to BookLove",
      description: "Discover and share your favorite books with the world",
    },
    {
      image: require("../assets/books2.png"),
      title: "Find Your Next Read",
      description:
        "Explore our vast collection of books and find your next favorite",
    },
    {
      image: require("../assets/books3.png"),
      title: "Connect with Other Readers",
      description:
        "Join our community of book lovers and share your thoughts and opinions",
    },
    {
      image: require("../assets/books4.png"),
      title: "Get Started",
      description:
        "Create an account or log in to start discovering and sharing books",
    },
  ];

  useEffect(() => {
    AsyncStorage.getItem('alreadyLaunched').then(value => {
      if (value == null) {
        AsyncStorage.setItem('alreadyLaunched', 'true');
        setFirstLaunch(true);
      } else {
        setFirstLaunch(false);
      }
    });
  }, []);


useEffect(() => {
  if (firstLaunch === false) {
    router.push("/login");
  }
}, [firstLaunch]);


  const handleNext = () => {
    if (currentIndex === slides.length - 1) {
      // Navigate to login page
      router.push("/login");
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={slides[currentIndex].image} style={styles.image} />
      <Text style={styles.title}>{slides[currentIndex].title}</Text>
      <Text style={styles.description}>{slides[currentIndex].description}</Text>
      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>
          {currentIndex === slides.length - 1 ? (
            <MaterialIcons name="home" size={72} color="#23527C" />
          ) : (
            <MaterialIcons name="forward" size={72} color="#23527C" />
          )}
         
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FDF3E6",
  },
  image: {
    width: 400,
    height: 400,
    resizeMode: "contain",
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    marginTop: 32,
    marginBottom: 16,
    textAlign: "center",
  },
  description: {
    fontSize: 22,
    marginBottom: 32,
    textAlign: "center",
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default index;

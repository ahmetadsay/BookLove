import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,

} from "react-native";
import { router } from "expo-router";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";

WebBrowser.maybeCompleteAuthSession();

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorText, setErrorText] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId:
      "408102652283-q7o2bq5615r96agpaplt8vsnc2cnslof.apps.googleusercontent.com",
    iosClientId:
      "408102652283-jekidab8mqvq8p2mgjff5sk7so27t7sm.apps.googleusercontent.com",
    androidClientId:
      "408102652283-bro7s3ah3t1uhsdf6r6h1ln4jkc4ui3i.apps.googleusercontent.com",
  });

  useEffect(() => {
    AsyncStorage.getItem("email").then((savedEmail) => {
      if (savedEmail) {
        setEmail(savedEmail);
      }
    });
    AsyncStorage.getItem("password").then((savedPassword) => {
      if (savedPassword) {
        setPassword(savedPassword);
      }
    });
  }, []);

  const handleLogin = () => {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
      
        router.push("/home");

        if (rememberMe) {
          AsyncStorage.setItem("email", email);
          AsyncStorage.setItem("password", password);
        }

        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = "Invalid email or password";
        setErrorText(errorMessage);
      });
  };

  const handleSignup = () => {
    router.push("/signUpForm");
  };

  const goHomePage = () => {
    router.push("/home");
  };

  const getRandomColor = () => {
    // Generate a random color in the format #RRGGBB
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const applyRandomColor = (text) => {
    // Apply random color to each letter of the text
    return text.split("").map((letter, index) => (
      <Text key={index} style={{ color: getRandomColor() }}>
        {letter}
      </Text>
    ));
  };

  return (
    <View style={styles.container}>
      <Image source={require("../assets/home.png")} style={styles.image} />
      <Text style={styles.title}>
        {applyRandomColor("Welcome to BookLove")}
      </Text>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity
            onPress={() => setRememberMe(!rememberMe)}
            style={{
              width: 20,
              height: 20,
              borderRadius: 5,
              borderWidth: 1,
              borderColor: "#000",
              marginRight: 10,
            }}
          >
            {rememberMe ? (
              <View
                style={{
                  flex: 1,
                  backgroundColor: "#000",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "#fff" }}>✓</Text>
              </View>
            ) : null}
          </TouchableOpacity>
          <Text>Remember me</Text>
        </View>

        {errorText ? <Text style={styles.error}>{errorText}</Text> : null}
  

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Log In</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleSignup}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>


        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View style={{ flex: 1, height: 1, backgroundColor: "#000" }} />
          <View>
            <Text style={{ width: 50, textAlign: "center" }}>OR</Text>
          </View>
          <View style={{ flex: 1, height: 1, backgroundColor: "#000" }} />
        </View>
        <TouchableOpacity style={styles.button} onPress={goHomePage}>
          <Text style={styles.buttonText}>Continue as guest </Text>
        </TouchableOpacity>
      </View>
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
    width: 250,
    height: 250,
    marginBottom: 20,
  },

  google: {
    backgroundColor: "#fff",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    flexDirection: "row",
  },
  form: {
    width: "80%",
    gap: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },

  error: {
    color: "red",
    textAlign: "center",
    fontWeight: "bold",
  },

  button: {
    backgroundColor: "#23527C",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
});

export default Login;

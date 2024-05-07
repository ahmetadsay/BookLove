import React from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  TouchableOpacity,
  Platform,
} from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { collection, addDoc } from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  fetchSignInMethodsForEmail,
} from "firebase/auth";
import { Picker, PickerIOS } from "@react-native-picker/picker";
import { auth, db, getUserByEmail, getAuth } from "../firebase/firebase";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import SelectDropdown from "react-native-select-dropdown";

const signUpSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm password is required"),
  gender: Yup.string().required("Gender is required"),
});

const SignUpForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailError, setEmailError] = useState("");

  const goBack = () => {
    router.back();
  };

  const handleSubmit = async (values) => {
    const displayName = values.name;
    try {
      const { email, password, gender, name } = values;

      const existingUserMethods = await fetchSignInMethodsForEmail(auth, email);
      if (existingUserMethods.length > 0) {
        setEmailError("Email already in use");
        return;
      }
      // Create the user in Firebase Authentication displayName is the name of the user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Update the user profile in Firebase Authentication
      await updateProfile(userCredential.user, {
        displayName: name,
      });

      await userCredential.user.reload();

      // Create a user document in Firestore
      const docRef = await addDoc(collection(db, "users"), {
        uid: userCredential.user.uid,

        name: name,
        email: email,
        gender: gender,
      });
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      if (errorCode === "auth/email-already-in-use") {
        setEmailError("Email already in use");
      } else {
        console.error("Error adding document: ", error);
      }
      return;
    }

    router.push("/home");
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={goBack}>
        <Ionicons name="arrow-back-outline" size={32} color="black" />
      </TouchableOpacity>
      <Text style={styles.title}>Sign Up</Text>
      <Text style={styles.subtitle}>
        Create an account to start discovering and sharing books
      </Text>

      <Formik
        initialValues={{
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
          agreeToTerms: false, // add new field for checkbox
          gender: "",
        }}
        validationSchema={signUpSchema}
        onSubmit={handleSubmit}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
        }) => (
          <>
            <TextInput
              style={styles.input}
              placeholder="Name"
              onChangeText={handleChange("name")}
              onBlur={handleBlur("name")}
              value={values.name}
            />
            {errors.name && touched.name && (
              <Text style={styles.error}>{errors.name}</Text>
            )}

            <TextInput
              style={styles.input}
              placeholder="Email"
              onChangeText={handleChange("email")}
              onBlur={handleBlur("email")}
              value={values.email}
            />
            {errors.email && touched.email && (
              <Text style={styles.error}>{errors.email}</Text>
            )}
            {emailError && <Text style={styles.error}>{emailError}</Text>}

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry={!showPassword} // use state to toggle secureTextEntry
                onChangeText={handleChange("password")}
                onBlur={handleBlur("password")}
                value={values.password}
              />
              <MaterialIcons
                style={styles.icon}
                name={showPassword ? "visibility" : "visibility-off"}
                size={24}
                color="#007AFF"
                onPress={() => setShowPassword(!showPassword)}
              />
            </View>

            {errors.password && touched.password && (
              <Text style={styles.error}>{errors.password}</Text>
            )}

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                secureTextEntry={!showConfirmPassword} // use state to toggle secureTextEntry
                onChangeText={handleChange("confirmPassword")}
                onBlur={handleBlur("confirmPassword")}
                value={values.confirmPassword}
              />
              <MaterialIcons
                style={styles.icon}
                name={showConfirmPassword ? "visibility" : "visibility-off"}
                size={24}
                color="#007AFF"
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              />
            </View>

            {errors.confirmPassword && touched.confirmPassword && (
              <Text style={styles.error}>{errors.confirmPassword}</Text>
            )}

            {Platform.OS === "ios" && (
              <SelectDropdown
                data={["Male", "Female"]}
                onSelect={(selectedItem, index) =>
                  handleChange("gender")(selectedItem)
                }
                renderButton={(selectedItem, isOpened) => (
                  <View style={styles.dropdownButtonStyle}>
                    <Text style={styles.dropdownButtonTxtStyle}>
                      {(selectedItem && selectedItem) || "Select Gender"}
                    </Text>
                    <MaterialIcons
                      name={
                        isOpened ? "keyboard-arrow-up" : "keyboard-arrow-down"
                      }
                      style={styles.dropdownButtonIconStyle}
                    />
                  </View>
                )}
                renderItem={(item, index, isSelected) => (
                  <View
                    style={{
                      ...styles.dropdownItemStyle,
                      ...(isSelected && { backgroundColor: "#D2D9DF" }),
                    }}
                  >
                    <Text style={styles.dropdownItemTxtStyle}>{item}</Text>
                  </View>
                )}
                showsVerticalScrollIndicator={false}
                dropdownStyle={styles.dropdownMenuStyle}
              />
            )}

            {Platform.OS === "android" && (
              <View style={styles.pickerContainer}>
                <Picker
                  value={values.gender}
                  style={styles.input2}
                  selectedValue={values.gender}
                  onValueChange={(itemValue, itemIndex) =>
                    handleChange("gender")(itemValue)
                  }
                >
                  <Picker.Item label="Select Gender" value="" />
                  <Picker.Item label="Male" value="Male" />
                  <Picker.Item label="Female" value="Female" />
                </Picker>
                {errors.gender && touched.gender && (
                  <Text style={styles.error}>{errors.gender}</Text>
                )}
              </View>
            )}

            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>
          </>
        )}
      </Formik>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 3,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    gap: 10,
    marginHorizontal: 20,
  },
  pickerContainer: {
    width: "80%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 10,
  },

  inputContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  input: {
    width: "80%",
    height: 50,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  input2: {
    width: "100%",
    height: 50,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },

  icon: {
    position: "absolute",
    right: 20,
    top: 15,
  },

  error: {
    color: "red",
  },
  button: {
    backgroundColor: "#006661",
    padding: 10,
    borderRadius: 5,
    width: "80%",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 1,
    borderColor: "#ccc",
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxLabel: {
    fontSize: 16,
  },
  dropdownButtonStyle: {
    width: "80%",
    height: 50,
    backgroundColor: "#E9ECEF",
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  dropdownButtonTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "500",
    color: "#151E26",
  },
  dropdownButtonArrowStyle: {
    fontSize: 28,
  },
  dropdownButtonIconStyle: {
    fontSize: 28,
    marginRight: 8,
  },
  dropdownMenuStyle: {
    backgroundColor: "#E9ECEF",
    borderRadius: 8,
  },
  dropdownItemStyle: {
    width: "100%",
    flexDirection: "row",
    paddingHorizontal: 12,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8,
  },
  dropdownItemTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "500",
    color: "#151E26",
  },
  dropdownItemIconStyle: {
    fontSize: 28,
    marginRight: 8,
  },
});

export default SignUpForm;

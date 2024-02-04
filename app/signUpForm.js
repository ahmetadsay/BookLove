import React from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  TouchableOpacity,
} from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { Picker } from "@react-native-picker/picker";



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

const handleSubmit = async (values) => {
  const displayName = values.name;
  const auth = getAuth();
  const db = getFirestore();
  try {
    const { email, password, gender, name  } = values;
    
    // Create the user in Firebase Authentication displayName is the name of the user in Firebase Authentication 
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
      displayName
    );

    // Update the user profile in Firebase Authentication
    await updateProfile(auth.currentUser, {
      displayName: name,
    });




      





       // Create a user document in Firestore
    const docRef = await addDoc(collection(db, "users"), {
      uid: userCredential.user.uid,

      name: name,
      email: email,
      gender: gender,

    });
    
    console.log("Document written with ID: ", docRef.id);
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorCode, errorMessage);

    // Handle error
  }
};

  return (
    <View style={styles.container}>
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

            <View style={styles.checkboxContainer}>
              <TouchableOpacity
                style={styles.checkbox}
                onPress={() =>
                  handleChange("agreeToTerms")(!values.agreeToTerms)
                }
              >
                {values.agreeToTerms && (
                  <MaterialIcons name="check" size={24} color="#007AFF" />
                )}
              </TouchableOpacity>

              <Text style={styles.checkboxLabel}>
                I agree to the terms and conditions
              </Text>
            </View>

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
    gap: 20,
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
    marginBottom: 10,
    borderRadius: 5,
  },
  input2: {
    width: "100%",
    height: 50,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 10,
    borderRadius: 5,
  },

  icon: {
    position: "absolute",
    right: 20,
    top: 15,
  },

  error: {
    color: "red",
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#006661",
    padding: 10,
    borderRadius: 5,
    width: "80%",
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
});

export default SignUpForm;

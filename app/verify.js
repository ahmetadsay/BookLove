import React, { useEffect, useState } from "react";
import {
  View,
  TextInput,
  Text,
  Button,
  Alert,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { auth, db } from "../firebase/firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { addDoc, collection } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function VerifyScreen() {
  const [code, setCode] = useState("");
  const [signupData, setSignupData] = useState(null);
  const router = useRouter();

  // Verileri AsyncStorage'dan oku
  useEffect(() => {
    const getSignupData = async () => {
      try {
        const jsonData = await AsyncStorage.getItem("signupData");
        if (jsonData) {
          const parsedData = JSON.parse(jsonData);
          setSignupData(parsedData);
        } else {
          Alert.alert("Hata", "Kayıt verileri bulunamadı.");
          router.replace("/signup"); // Eğer veri yoksa signup sayfasına yönlendir
        }
      } catch (error) {
        console.error("AsyncStorage read error:", error);
        Alert.alert("Hata", "Veriler alınırken hata oluştu.");
      }
    };

    getSignupData();
  }, []);

  const handleVerify = async () => {
    if (!signupData) return;

    const { email, password, gender, name } = signupData;
    const formattedEmail = email?.toString().trim().toLowerCase();
    const formattedCode = code?.toString().trim();

    try {
      const response = await fetch("https://booklove-kbyb.onrender.com/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formattedEmail,
          code: formattedCode,
        }),
      });

      const data = await response.json();

      if (data.success) {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          formattedEmail,
          password
        );

        await updateProfile(userCredential.user, {
          displayName: name,
        });

        await addDoc(collection(db, "users"), {
          uid: userCredential.user.uid,
          name,
          email: formattedEmail,
          gender,
        });

        await AsyncStorage.removeItem("signupData"); // Kullanıcı oluşturulduktan sonra verileri temizle

        Alert.alert("Başarılı!", "Kayıt tamamlandı.");
        router.push("/home");
      } else {
        Alert.alert("Doğrulama Başarısız", "Kod yanlış veya süresi dolmuş.");
      }
    } catch (error) {
      console.error("Doğrulama hatası:", error);
      Alert.alert("Hata", "Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>E-posta Doğrulama</Text>
      <Text style={styles.label}>Mailine gönderilen 6 haneli kodu gir:</Text>
      <TextInput
        placeholder="123456"
        value={code}
        onChangeText={setCode}
        keyboardType="numeric"
        maxLength={6}
        style={styles.input}
      />
      <Button title="Doğrula ve Kaydol" onPress={handleVerify} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginTop: 60,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: "#ccc",
    fontSize: 18,
    paddingVertical: 8,
    marginBottom: 20,
  },
});

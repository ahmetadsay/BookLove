import React, { useState } from "react";
import { View, TextInput, Text, Button, Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { auth, db } from "../firebase/firebase" // kendi firebase dosyana göre ayarla
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { addDoc, collection } from "firebase/firestore";

export default function VerifyScreen() {
  const [code, setCode] = useState("");
  const router = useRouter();
  const { email, password, gender, name } = useLocalSearchParams();

  const handleVerify = async () => {
    try {
      const response = await fetch("http://10.0.2.2:3000/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });

      const data = await response.json();

      if (data.success) {
        // ✅ Firebase'e kayıt ol
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);

        await updateProfile(userCredential.user, {
          displayName: name,
        });

        await addDoc(collection(db, "users"), {
          uid: userCredential.user.uid,
          name: name,
          email: email,
          gender: gender,
        });

        router.push("/home");
      } else {
        Alert.alert("Kod yanlış veya süresi dolmuş");
      }
    } catch (error) {
      console.error("Doğrulama hatası:", error);
      Alert.alert("Beklenmeyen bir hata oluştu.");
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Mailine gönderilen 6 haneli kodu gir:</Text>
      <TextInput
        placeholder="123456"
        value={code}
        onChangeText={setCode}
        keyboardType="numeric"
        maxLength={6}
        style={{ borderBottomWidth: 1, marginVertical: 20 }}
      />
      <Button title="Doğrula ve Kaydol" onPress={handleVerify} />
    </View>
  );
}

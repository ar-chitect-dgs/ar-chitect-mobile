import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet, Image, TouchableOpacity } from "react-native";
import auth from "@react-native-firebase/auth";
import storage from "@react-native-firebase/storage";
import { launchImageLibrary } from "react-native-image-picker";

const RegisterScreen: React.FC = ({ navigation }: any) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [displayName, setDisplayName] = useState<string>("");
  const [profileImage, setProfileImage] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleImagePicker = () => {
    launchImageLibrary({ mediaType: "photo" }, (response) => {
      if (response.assets && response.assets.length > 0) {
        setProfileImage(response.assets[0]);
      }
    });
  };

  const uploadImage = async (userId: string) => {
    if (!profileImage) return null;
    const reference = storage().ref(`/profilePictures/${userId}`);
    await reference.putFile(profileImage.uri);
    return await reference.getDownloadURL();
  };

  const handleRegister = async () => {
    if (email === "" || password === "" || displayName === "") {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      const userCredential = await auth().createUserWithEmailAndPassword(
        email,
        password
      );

      if (userCredential.user) {
        const photoURL = await uploadImage(userCredential.user.uid);

        await userCredential.user.updateProfile({
          displayName: displayName,
          photoURL,
        });

        Alert.alert("Success", "Account created successfully!");
        navigation.navigate("Home");
      }
    } catch (error: any) {
      Alert.alert("Registration Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>

      <TouchableOpacity onPress={handleImagePicker} style={styles.imagePicker}>
        {profileImage ? (
          <Image source={{ uri: profileImage.uri }} style={styles.profileImage} />
        ) : (
          <Text style={styles.imageText}>Add Profile Picture</Text>
        )}
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Display Name"
        placeholderTextColor="#ccc"
        value={displayName}
        onChangeText={setDisplayName}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#ccc"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#ccc"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Button
        title={loading ? "Registering..." : "Register"}
        onPress={handleRegister}
        disabled={loading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: "center",
    color: "#000",
  },
  imagePicker: {
    alignItems: "center",
    marginBottom: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  imageText: {
    color: "#888",
    fontSize: 16,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    color: "#000",
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
});

export default RegisterScreen;

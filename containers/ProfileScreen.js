import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useState, useEffect } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import axios from "axios";
import Lottie from "lottie-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome5 } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";

export default function ProfileScreen({ setToken, userToken, userId }) {
  const [username, setUsername] = useState("");
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState("");
  const [photo, setPhoto] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
  const [error, setError] = useState(null);
  const [updateText, setUpdateText] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `https://express-airbnb-api.herokuapp.com/user/${userId}`,
          {
            headers: { Authorization: "Bearer " + userToken },
          }
        );
        setUsername(data.username);
        setEmail(data.email);
        setDescription(data.description);
        setPhoto(data.photo);
      } catch (error) {
        console.log(error.response);
      }
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const handleUpdate = async () => {
    setIsLoadingUpdate(true);
    setError(null);
    setUpdateText(null);
    try {
      const { data } = await axios.put(
        "https://express-airbnb-api.herokuapp.com/user/update",
        { email, description, username },
        {
          headers: { Authorization: "Bearer " + userToken },
        }
      );
      setUpdateText("Profil mis à jour !");
    } catch (error) {
      if (error.response.data) {
        setError(error.response.data.error);
      }
    }
    setIsLoadingUpdate(false);
  };

  return isLoading ? (
    <View style={[styles.container, styles.horizontal]}>
      {/* <ActivityIndicator size="large" color="#ea5a62" /> */}
      <Lottie
        source={require(`../assets/93041-home-sweet-home-icon.json`)}
        style={{
          width: "30%",
        }}
        autoPlay
      />
    </View>
  ) : (
    <KeyboardAwareScrollView
      keyboardShouldPersistTaps="always"
      contentContainerStyle={{ alignItems: "center" }}
    >
      <View
        style={{
          marginVertical: 15,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <View
          style={{
            width: 140,
            height: 140,
            borderColor: "#ea5a62",
            borderWidth: 2,
            borderRadius: 150 / 2,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {photo ? (
            <Image source={photo} resizeMode="contain" />
          ) : (
            <FontAwesome5 name="user-alt" size={80} color="lightgrey" />
          )}
        </View>
        <View
          style={{
            marginLeft: 20,
            height: 130,
            justifyContent: "space-around",
          }}
        >
          <FontAwesome
            name="picture-o"
            size={30}
            color="grey"
            style={styles.icon}
          />
          <Ionicons
            name="camera-sharp"
            size={30}
            color="grey"
            style={styles.icon}
          />
        </View>
      </View>
      <TextInput
        style={styles.textInput}
        value={email}
        placeholder="email"
        onChangeText={(text) => {
          setEmail(text);
        }}
      />
      <TextInput
        style={styles.textInput}
        value={username}
        placeholder="username"
        onChangeText={(text) => {
          setUsername(text);
        }}
      />
      <TextInput
        style={styles.textInputDescription}
        multiline={true}
        textAlignVertical="top"
        value={description}
        placeholder="Describe yourself in a few words"
        onChangeText={(text) => {
          setDescription(text);
        }}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
      {updateText && <Text style={styles.updateText}>{updateText}</Text>}
      {isLoadingUpdate ? (
        <View style={[styles.container, styles.horizontal]}>
          <ActivityIndicator size="large" color="#ea5a62" />
        </View>
      ) : (
        <TouchableOpacity onPress={handleUpdate} style={styles.btn}>
          <Text style={styles.btnText}>Update</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity
        onPress={() => setToken(null)}
        style={[styles.btn, styles.btnLogOut]}
      >
        <Text style={styles.btnText}>Log out</Text>
      </TouchableOpacity>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  horizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
  },
  icon: {},
  textInput: {
    borderBottomColor: "#ea5a62",
    borderBottomWidth: 2,
    marginBottom: 18,
    width: "90%",
    fontSize: 16,
    paddingVertical: 10,
  },
  textInputDescription: {
    borderColor: "#ea5a62",
    borderWidth: 2,
    marginBottom: 5,
    width: "90%",
    height: 110,
    fontSize: 16,
    padding: 10,
  },
  btn: {
    height: 70,
    width: "50%",
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#ea5a62",
    borderWidth: 3,
    borderRadius: 50,
    marginVertical: 10,
  },
  btnLogOut: { backgroundColor: "lightgrey" },
  btnText: {
    fontSize: 18,
    color: "#606060",
  },
  errorText: {
    color: "#ea5a62",
    marginVertical: 5,
  },
  updateText: {
    color: "#606060",
    fontWeight: "bold",
    marginVertical: 5,
  },
});

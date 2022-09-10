import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
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

export default function ProfileScreen({ setToken }) {
  const [username, setUsername] = useState("");
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState("");
  const [photo, setPhoto] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      // Je récupère l'id stocké en AsyncStorage
      const id = await AsyncStorage.getItem("userId");
      // Je récupère le token stocké en AsyncStorage
      const token = await AsyncStorage.getItem("userToken");

      try {
        const { data } = await axios.get(
          `https://express-airbnb-api.herokuapp.com/user/${id}`,
          {
            headers: { Authorization: "Bearer " + token },
          }
        );
        setUsername(data.username);
        setEmail(data.email);
        setDescription(data.description);
        setPhoto(data.photo);
      } catch (error) {
        console.log(error.data.error);
      }
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const handleUpdate = async () => {
    const token = await AsyncStorage.getItem("userToken");
    try {
      const { data } = await axios.put(
        "https://express-airbnb-api.herokuapp.com/user/update",
        { email, description, username },
        {
          headers: { Authorization: "Bearer " + token },
        }
      );
      console.log(data);
    } catch (error) {
      console.log(error.response);
    }
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
      <TouchableOpacity onPress={handleUpdate} style={styles.btn}>
        <Text style={styles.btnText}>Update</Text>
      </TouchableOpacity>
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
  btnsArea: {
    marginTop: 20,
    alignItems: "center",
    width: "100%",
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
  btnTextRegister: {
    color: "#606060",
    marginTop: 15,
    marginBottom: 20,
  },
  errorText: {
    color: "#ea5a62",
    marginBottom: 5,
  },
});

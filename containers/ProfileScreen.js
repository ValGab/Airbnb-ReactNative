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
import { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import axios from "axios";
import Lottie from "lottie-react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";

import CustomInput from "../components/CustomInput";

export default function ProfileScreen({ setToken, userToken, userId }) {
  const [username, setUsername] = useState("");
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState("");
  const [photo, setPhoto] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
  const [showIconsPic, setShowIconsPic] = useState(false);
  const [error, setError] = useState(null);
  const [updateText, setUpdateText] = useState(null);

  useFocusEffect(
    useCallback(() => {
      setError(null);
      setUpdateText(null);
      setShowIconsPic(false);
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
          if (data.photo) {
            setPhoto(data.photo.url);
          }
        } catch (error) {
          console.log(error.response);
        }
        setIsLoading(false);
      };
      fetchData();
    }, [])
  );

  const handleUpdate = async () => {
    setIsLoadingUpdate(true);
    setError(null);
    setUpdateText(null);
    const tab = photo.split(".");
    const extension = tab[tab.length - 1];
    const formData = new FormData();
    formData.append("photo", {
      uri: photo,
      name: `avatar-${userId}.${extension}`,
      type: `image/${extension}`,
    });
    try {
      const { data } = await axios.put(
        "https://express-airbnb-api.herokuapp.com/user/update",
        { email, description, username },
        {
          headers: { Authorization: "Bearer " + userToken },
        }
      );

      const sendPicture = await axios.put(
        "https://express-airbnb-api.herokuapp.com/user/upload_picture",
        formData,
        {
          headers: {
            Authorization: "Bearer " + userToken,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      // console.log(data);
      // console.log(sendPicture);
      setUpdateText("Profil mis à jour !");
    } catch (error) {
      if (error.response.data) {
        setError(error.response.data.error);
      }
    }
    setIsLoadingUpdate(false);
  };

  const getPermissionAndSelectPicture = async () => {
    // Je demande la permission d'accéder à la galerie
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    // Si c'est ok :
    if (status === "granted") {
      // J'ouvre la galerie si la permission est donnée
      const result = await ImagePicker.launchImageLibraryAsync();
      if (result.cancelled === false) {
        // console.log(result);
        setPhoto(result.uri);
      }
    } else {
      alert("Permission refusée");
    }
  };

  const getPermissionAndTakePicture = async () => {
    //Demander le droit d'accéder à l'appareil photo
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status === "granted") {
      // Ouvrir l'appareil photo
      const result = await ImagePicker.launchCameraAsync();
      if (result.cancelled === false) {
        setPhoto(result.uri);
      }
    } else {
      alert("Permission refusée");
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
        <TouchableOpacity
          onPress={() => {
            setShowIconsPic((prevState) => !prevState);
          }}
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
            <Image
              source={{ uri: photo }}
              resizeMode="contain"
              style={{ width: 130, height: 130, borderRadius: 140 / 2 }}
            />
          ) : (
            <FontAwesome5 name="user-alt" size={80} color="lightgrey" />
          )}
        </TouchableOpacity>
        {showIconsPic && (
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
              onPress={getPermissionAndSelectPicture}
            />
            <Ionicons
              name="camera-sharp"
              size={30}
              color="grey"
              onPress={getPermissionAndTakePicture}
            />
          </View>
        )}
      </View>
      <CustomInput
        style={styles.textInput}
        value={email}
        placeholder="e-mail"
        setState={setEmail}
      />
      <CustomInput
        style={styles.textInput}
        value={username}
        placeholder="username"
        setState={setUsername}
      />
      <TextInput
        style={styles.textInputDescription}
        selectionColor="#ea5a62"
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

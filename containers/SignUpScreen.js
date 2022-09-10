import { useState } from "react";
import axios from "axios";
import {
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import logo from "../assets/logo.png";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function SignUpScreen({ setToken, navigation }) {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [description, setDescription] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");
    if (!email || !username || !description || !password || !confirmPassword) {
      setError("Please fill all fields");
    } else if (password !== confirmPassword) {
      setError("Passwords must be the same");
    } else {
      setIsLoading(true);
      try {
        const response = await axios.post(
          "https://express-airbnb-api.herokuapp.com/user/sign_up",
          {
            email,
            username,
            description,
            password,
          }
        );
        console.log(response.data);
        const userToken = response.data.token;
        const userId = response.data.id;
        setToken(userToken, userId);
      } catch (error) {
        if (error.response.data) {
          setError(error.response.data.error);
        }
      }
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAwareScrollView
      keyboardShouldPersistTaps="always"
      contentContainerStyle={{ alignItems: "center" }}
    >
      <Image source={logo} style={styles.logo} resizeMode="contain" />
      <Text style={styles.title}>Sign up</Text>
      <TextInput
        style={styles.textInput}
        value={email}
        placeholder="e-mail"
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
      <TextInput
        style={styles.textInput}
        value={password}
        placeholder="password"
        secureTextEntry={true}
        onChangeText={(text) => {
          setPassword(text);
        }}
      />
      <TextInput
        style={styles.textInput}
        value={confirmPassword}
        placeholder="confirm password"
        secureTextEntry={true}
        onChangeText={(text) => {
          setConfirmPassword(text);
        }}
      />
      <View style={styles.btnsArea}>
        <Text style={styles.errorText}>{error}</Text>
        {isLoading ? (
          <View style={[styles.container, styles.horizontal]}>
            <ActivityIndicator size="large" color="#ea5a62" />
          </View>
        ) : (
          <TouchableOpacity onPress={handleSubmit} style={styles.btn}>
            <Text style={styles.btnText}>Sign up</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("SignIn");
          }}
        >
          <Text style={styles.btnTextRegister}>
            Already have an account ? Sign in
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  horizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
  },
  logo: {
    width: 100,
    height: 100,
    marginTop: 50,
  },
  title: {
    fontSize: 24,
    color: "#606060",
    marginTop: 20,
    marginBottom: 40,
    fontWeight: "bold",
  },
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
  },
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

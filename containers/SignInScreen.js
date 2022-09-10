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

export default function SignInScreen({ setToken, navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setError("");
    if (!email || !password) {
      setError("Please fill all fields");
    } else {
      setIsLoading(true);
      try {
        const response = await axios.post(
          "https://express-airbnb-api.herokuapp.com/user/log_in",
          {
            email,
            password,
          }
        );
        const userToken = response.data.token;
        const userId = response.data.id;
        setToken(userToken, userId);
      } catch (error) {
        setError("This account doesn't exist");
        setIsLoading(false);
      }
    }
  };

  return (
    <KeyboardAwareScrollView
      keyboardShouldPersistTaps="always"
      contentContainerStyle={{ alignItems: "center" }}
    >
      <Image source={logo} style={styles.logo} resizeMode="contain" />
      <Text style={styles.title}>Sign in</Text>
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
        value={password}
        placeholder="password"
        secureTextEntry={true}
        onChangeText={(text) => {
          setPassword(text);
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
            <Text style={styles.btnText}>Sign in</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("SignUp");
          }}
        >
          <Text style={styles.btnTextRegister}>No account ? Register</Text>
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
  btnsArea: {
    marginTop: 40,
    alignItems: "center",
    width: "100%",
  },
  btn: {
    height: 70,
    width: 180,
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
  },
  errorText: {
    color: "#ea5a62",
    marginBottom: 5,
  },
});

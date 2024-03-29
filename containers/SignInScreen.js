import { useState } from "react";
import axios from "axios";
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import logo from "../assets/logo.png";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Entypo } from "@expo/vector-icons";
import CustomInput from "../components/CustomInput.js";

export default function SignInScreen({ setToken, navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
          "https://lereacteur-bootcamp-api.herokuapp.com/api/airbnb/user/log_in",
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

      <CustomInput
        style={styles.textInput}
        value={email}
        placeholder="e-mail"
        setState={setEmail}
      />
      <View style={{ alignItems: "center", width: "100%" }}>
        <CustomInput
          secure={!showPassword ? true : false}
          style={styles.textInput}
          value={password}
          placeholder="password"
          setState={setPassword}
        />
        <Entypo
          name="eye"
          size={24}
          color="#606060"
          style={{ position: "absolute", right: "8%", top: 15 }}
          onPress={() => {
            setShowPassword((prevState) => !prevState);
          }}
        />
      </View>
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

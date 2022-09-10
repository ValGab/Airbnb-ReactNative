import { Image } from "react-native";

import logo from "../assets/logo.png";

export default function Logo() {
  return (
    <Image
      source={logo}
      style={{ width: 30, height: 30 }}
      resizeMode="contain"
    />
  );
}

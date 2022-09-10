import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const ArrowLeft = () => {
  const navigation = useNavigation();
  return (
    <AntDesign
      style={{ position: "absolute", top: 15, left: 10 }}
      onPress={() => {
        navigation.goBack();
      }}
      name="arrowleft"
      size={24}
      color="#606060"
    />
  );
};

export default ArrowLeft;

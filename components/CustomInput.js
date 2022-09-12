import { TextInput, StyleSheet } from "react-native";

const CustomInput = ({ secure, value, placeholder, setState }) => {
  return (
    <TextInput
      selectionColor="#ea5a62"
      secureTextEntry={secure ? true : false}
      style={styles.textInput}
      value={value}
      placeholder={placeholder}
      onChangeText={(text) => {
        setState(text);
      }}
    />
  );
};

const styles = StyleSheet.create({
  textInput: {
    borderBottomColor: "#ea5a62",
    borderBottomWidth: 2,
    marginBottom: 18,
    width: "90%",
    fontSize: 16,
    paddingVertical: 10,
  },
});

export default CustomInput;

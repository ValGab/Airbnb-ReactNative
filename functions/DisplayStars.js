import { Entypo } from "@expo/vector-icons";

const displayStars = (number) => {
  let tab = [];

  for (let i = 1; i <= 5; i++) {
    if (number < i) {
      tab.push(
        <Entypo
          name="star"
          size={20}
          color="#bababa"
          style={{ marginRight: 4 }}
          key={i}
        />
      );
    } else {
      tab.push(
        <Entypo
          name="star"
          size={20}
          color="#ffaf01"
          style={{ marginRight: 4 }}
          key={i}
        />
      );
    }
  }

  return tab;
};

export default displayStars;

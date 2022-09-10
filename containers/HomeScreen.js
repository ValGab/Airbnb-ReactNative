import {
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import { useEffect, useState } from "react";
import Lottie from "lottie-react-native";

import displayStars from "../functions/DisplayStars";

export default function HomeScreen({ navigation }) {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://express-airbnb-api.herokuapp.com/rooms"
        );
        setData(response.data);
      } catch (error) {
        console.log(error.response);
      }
      setIsLoading(false);
    };
    fetchData();
  }, []);

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
    <View style={{ paddingHorizontal: 15 }}>
      <FlatList
        showsVerticalScrollIndicator={false}
        style={{ marginBottom: 40 }}
        data={data}
        keyExtractor={(element) => String(element._id)}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Room", { id: item._id });
            }}
            style={styles.room}
          >
            <View>
              <Image
                source={{ uri: item.photos[0].url }}
                style={styles.pic}
                resizeMode="cover"
              />
              <Text style={styles.price}>{item.price} €</Text>
            </View>
            <View style={styles.roomInfos}>
              <View>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={styles.title}
                >
                  {item.title}
                </Text>
                <View style={styles.rating}>
                  {displayStars(item.ratingValue)}
                  <Text style={styles.ratingText}>{item.reviews} reviews</Text>
                </View>
              </View>
              <Image
                source={{ uri: item.user.account.photo.url }}
                resizeMode="cover"
                style={styles.avatar}
              />
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
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
  room: {
    paddingBottom: 20,
    position: "relative",
    borderTopColor: "#bababa",
    borderTopWidth: 2,
    paddingVertical: 10,
  },
  pic: {
    width: "100%",
    height: 200,
  },
  price: {
    position: "absolute",
    top: 140,
    backgroundColor: "black",
    color: "white",
    fontSize: 18,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  roomInfos: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 10,
  },
  title: {
    fontSize: 20,
    width: 260,
  },
  rating: {
    paddingTop: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontSize: 12,
    color: "#bababa",
    marginLeft: 5,
  },
  avatar: {
    height: 60,
    width: 60,
    borderRadius: 60 / 2,
  },
});

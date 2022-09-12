import {
  Text,
  View,
  Image,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useState, useEffect } from "react";
import axios from "axios";
import LottieView from "lottie-react-native";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import Swiper from "react-native-swiper";

import displayStars from "../functions/DisplayStars";

export default function RoomScreen({ route }) {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);
  const [displayDescription, setDisplayDescription] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `https://express-airbnb-api.herokuapp.com/rooms/${route.params.id}`
        );
        setData(data);
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
      <LottieView
        source={require(`../assets/93041-home-sweet-home-icon.json`)}
        style={{
          width: "30%",
        }}
        autoPlay
      />
    </View>
  ) : (
    <ScrollView>
      <View>
        <Swiper
          style={styles.wrapper}
          showsButtons={false}
          dotColor="salmon"
          activeDotColor="red"
          buttonColor="yellow"
        >
          {data.photos.map((slide) => {
            return (
              <View style={styles.slide} key={slide.picture_id}>
                <Image
                  source={{ uri: slide.url }}
                  style={{ height: "100%", width: "100%" }}
                />
              </View>
            );
          })}
        </Swiper>
        {/* <Image
          source={{ uri: data.photos[0].url }}
          style={styles.pic}
          resizeMode="cover"
        /> */}
        <Text style={styles.price}>{data.price} €</Text>
      </View>
      <View style={styles.roomInfos}>
        <View>
          <Text numberOfLines={1} ellipsizeMode="tail" style={styles.title}>
            {data.title}
          </Text>
          <View style={styles.rating}>
            {displayStars(data.ratingValue)}
            <Text style={styles.ratingText}>{data.reviews} reviews</Text>
          </View>
        </View>
        <Image
          source={{ uri: data.user.account.photo.url }}
          resizeMode="cover"
          style={styles.avatar}
        />
      </View>
      <Text
        onPress={() => {
          setDisplayDescription(!displayDescription);
        }}
        numberOfLines={!displayDescription ? 3 : null}
        ellipsizeMode="tail"
        style={styles.description}
      >
        {data.description}
      </Text>
      <MapView
        // Map Android
        provider={PROVIDER_GOOGLE}
        // La MapView doit obligatoirement avoir des dimensions
        style={{ height: 280, width: "100%", marginTop: 20 }}
        initialRegion={{
          latitude: data.location[1],
          longitude: data.location[0],
          latitudeDelta: 0.2,
          longitudeDelta: 0.2,
        }}
      >
        <MapView.Marker
          coordinate={{
            latitude: data.location[1],
            longitude: data.location[0],
          }}
        />
      </MapView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
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
  wrapper: {
    height: 280,
  },
  slide: {
    height: 280,
  },
  pic: {
    width: "100%",
    height: 280,
  },
  price: {
    position: "absolute",
    top: 210,
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
    paddingHorizontal: 20,
  },
  description: {
    paddingTop: 10,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 20,
    width: 250,
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

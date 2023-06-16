import { View, Text } from "react-native";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import { useEffect, useState } from "react";
import * as Location from "expo-location";
import LottieView from "lottie-react-native";
import { StyleSheet } from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

export default function AroundMeScreen() {
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const navigation = useNavigation();

  useEffect(() => {
    const getPermission = async () => {
      try {
        let response;
        // Demander la permission à l'utilisateur d'avoir accès à ses coordonnées
        const { status } = await Location.requestForegroundPermissionsAsync();
        // Soit status === "granted" donc l'utilisateur est d'accord
        if (status === "granted") {
          // On va récupérer les coordonnées
          const location = await Location.getCurrentPositionAsync();
          //   console.log(location);
          //   setLatitude(location.coords.latitude);
          //   setLongitude(location.coords.longitude);

          response = await axios.get(
            `https://lereacteur-bootcamp-api.herokuapp.com/api/airbnb/rooms/around?latitude=48.856614&longitude=2.3522219`
            // requête avec location.coords.latitude et location.coord.longitude si données de l'utilisateur actives
          );
          // Soit status === "denied" donc l'utilisateur ne veut pas
        } else {
          response = await axios.get(
            `https://lereacteur-bootcamp-api.herokuapp.com/api/airbnb/rooms/around`
          );
          setError("Permission de localisation refusée");
        }
        setData(response.data);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    getPermission();
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
  ) : error ? (
    <View style={[styles.container, styles.horizontal]}>
      <Text style={{ fontSize: 20 }}>{error}</Text>
    </View>
  ) : (
    <MapView
      // Map Android
      provider={PROVIDER_GOOGLE}
      // La MapView doit obligatoirement avoir des dimensions
      style={{ flex: 1 }}
      initialRegion={{
        // latitude et longitude avec les données de l'utilisateur contenues dans les states
        // latitude: latitude,
        // longitude: longitude,

        // latitude et longitude pour afficher sur Paris
        latitude: 48.856614,
        longitude: 2.3522219,
        latitudeDelta: 0.2,
        longitudeDelta: 0.2,
      }}
      showsUserLocation={true}
    >
      {data.map((marker) => {
        return (
          <MapView.Marker
            key={marker._id}
            coordinate={{
              latitude: marker.location[1],
              longitude: marker.location[0],
            }}
            onPress={() => navigation.navigate("Room", { id: marker._id })}
          />
        );
      })}
    </MapView>
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
});

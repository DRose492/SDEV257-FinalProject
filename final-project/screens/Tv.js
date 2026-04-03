import { useEffect, useState } from "react";
import { FlatList, Text, View, StyleSheet } from "react-native";
export default function TvShows() {
  const [tvShows, setTvShows] = useState([]);

  useEffect(() => {
    fetchTvShows();
  }, []);

  async function fetchTvShows() {
    try {
      const API_KEY = "04f9d75130f5f72bf67209e225c978f2";
      const res = await fetch(
        `https://api.themoviedb.org/3/trending/tv/week?api_key=${API_KEY}`,
      );
      const data = await res.json();
      console.log(data);
      setTvShows(data.results);
    } catch (err) {
      console.log("Failed to fetch Tv Shows", err);
    }
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={tvShows}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <Text>{item.name}</Text>}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 20,
  },
});

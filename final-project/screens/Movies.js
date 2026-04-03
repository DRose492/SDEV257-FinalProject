import { useEffect, useState } from "react";
import { FlatList, Text, StyleSheet, View } from "react-native";
export default function Movies() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    fetchMovies();
  }, []);
  async function fetchMovies() {
    try {
      const API_KEY = "04f9d75130f5f72bf67209e225c978f2";
      const res = await fetch(
        `https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}`,
      );
      const data = await res.json();
      console.log(data);
      setMovies(data.results);
    } catch (err) {
      console.log("Failed to fetch movies", err);
    }
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={movies}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <Text>{item.title}</Text>}
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

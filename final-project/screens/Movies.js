import { useEffect, useState, useRef } from "react";
import {
  FlatList,
  Text,
  StyleSheet,
  View,
  Image,
  ActivityIndicator,
  Pressable,
  Animated,
  Dimensions,
  PanResponder,
  StyleSheet as RNStyleSheet,
} from "react-native";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";

const { width, height } = Dimensions.get("window");

// ACCENT COLOR
const ACCENT = "#2ECC71"; // Emerald Green

export default function Movies() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [selectedMovie, setSelectedMovie] = useState(null);

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const scrollAnim = useRef(new Animated.Value(0)).current;

  // Parallax
  const parallaxX = useRef(new Animated.Value(0)).current;
  const parallaxY = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => {
        Animated.spring(parallaxX, {
          toValue: gesture.dx * 0.05,
          useNativeDriver: true,
        }).start();

        Animated.spring(parallaxY, {
          toValue: gesture.dy * 0.05,
          useNativeDriver: true,
        }).start();
      },
      onPanResponderRelease: () => {
        Animated.spring(parallaxX, {
          toValue: 0,
          useNativeDriver: true,
        }).start();

        Animated.spring(parallaxY, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      },
    })
  ).current;

  useEffect(() => {
    fetchMovies();
  }, []);

  async function fetchMovies() {
    try {
      const API_KEY = "04f9d75130f5f72bf67209e225c978f2";
      const res = await fetch(
        `https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}`
      );
      const data = await res.json();
      setMovies(data.results);
    } catch (err) {
      console.log("Failed to fetch movies", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (selectedMovie) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      fadeAnim.setValue(0);
      scaleAnim.setValue(0.9);
      slideAnim.setValue(40);
      scrollAnim.setValue(0);

      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        Animated.loop(
          Animated.sequence([
            Animated.timing(scrollAnim, {
              toValue: -80,
              duration: 6000,
              useNativeDriver: true,
            }),
            Animated.timing(scrollAnim, {
              toValue: 0,
              duration: 0,
              useNativeDriver: true,
            }),
          ])
        ).start();
      });
    }
  }, [selectedMovie]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={ACCENT} />
        <Text style={{ marginTop: 10, color: "#fff" }}>Loading movies...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={{ color: ACCENT }}>Failed to load movies.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* GRID */}
      <FlatList
        data={movies}
        keyExtractor={(item) => String(item.id)}
        numColumns={3}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => (
          <Pressable
            style={styles.item}
            onPress={() => setSelectedMovie(item)}
          >
            <Image
              source={{
                uri: `https://image.tmdb.org/t/p/w200${item.poster_path}`,
              }}
              style={[styles.poster, { borderColor: ACCENT }]}
            />
            <Text style={styles.title} numberOfLines={1}>
              {item.title}
            </Text>
          </Pressable>
        )}
      />

      {/* OVERLAY */}
      {selectedMovie && (
        <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
          <BlurView
            intensity={40}
            tint="dark"
            style={RNStyleSheet.absoluteFill}
          />

          <Pressable
            style={{ flex: 1, width: "100%" }}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setSelectedMovie(null);
            }}
          >
            <Pressable
              style={styles.overlayContent}
              onPress={(e) => e.stopPropagation()}
            >
              {/* PARALLAX POSTER */}
              <Animated.Image
                {...panResponder.panHandlers}
                source={{
                  uri: `https://image.tmdb.org/t/p/w500${selectedMovie.poster_path}`,
                }}
                style={[
                  styles.largePoster,
                  {
                    transform: [
                      { scale: scaleAnim },
                      { translateX: parallaxX },
                      { translateY: parallaxY },
                    ],
                    shadowColor: ACCENT,
                  },
                ]}
                resizeMode="contain"
              />

              {/* INFO PANEL */}
              <Animated.View
                style={[
                  styles.infoPanel,
                  { transform: [{ translateY: slideAnim }] },
                ]}
              >
                <Animated.View
                  style={{ transform: [{ translateY: scrollAnim }] }}
                >
                  <Text style={[styles.infoTitle, { color: ACCENT }]}>
                    {selectedMovie.title}
                  </Text>
                  <Text style={styles.infoText}>{selectedMovie.overview}</Text>
                </Animated.View>
              </Animated.View>
            </Pressable>
          </Pressable>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#111",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  row: {
    justifyContent: "space-between",
    marginBottom: 16,
  },

  item: {
    width: "30%",
    alignItems: "center",
  },

  poster: {
    width: "100%",
    height: 150,
    borderRadius: 6,
    marginBottom: 6,
    borderWidth: 1.5,
    shadowOpacity: 0.6,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },

  title: {
    fontSize: 12,
    textAlign: "center",
    color: "#fff",
  },

  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },

  overlayContent: {
    width: "90%",
    height: "85%",
    alignSelf: "center",
    alignItems: "center",
  },

  largePoster: {
    width: width * 0.85,
    height: height * 0.55,
    borderRadius: 12,
    marginBottom: 12,
    shadowOpacity: 0.8,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },

  infoPanel: {
    width: "100%",
    height: "22%",
    backgroundColor: "rgba(0,0,0,0.75)",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    overflow: "hidden",
  },

  infoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },

  infoText: {
    color: "#ddd",
    fontSize: 14,
    lineHeight: 20,
  },
});

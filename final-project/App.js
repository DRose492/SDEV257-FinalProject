import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Movies from "./screens/Movies";
import TvShows from "./screens/Tv";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Platform } from "react-native";
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Movies" component={Movies} />
      <Tab.Screen name="Tv Shows" component={TvShows} />
    </Tab.Navigator>
  );
}

function DrawerNavigator() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Movies" component={Movies} />
      <Drawer.Screen name="Tv Shows" component={TvShows} />
    </Drawer.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      {Platform.OS === "ios" ? <TabNavigator /> : <DrawerNavigator />}
    </NavigationContainer>
  );
}

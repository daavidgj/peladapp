import { Stack, Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { colors } from "../../components/ui/colors";
import { useIsFocused } from "@react-navigation/native";
import MyTabScreenView from "../../components/secundario/mytabscreenview";

export default function TabsLayout() {
    const isFocused = useIsFocused();
    console.log(isFocused);

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    position: "absolute",
                    bottom: 60,
                    left: 20,
                    right: 20,
                    borderRadius: 200,
                    borderWidth: 2,
                    borderStyle: "solid",
                    borderColor: "#e8e8e8",
                    height: 70,
                    marginHorizontal: 30,
                    paddingTop: 8,
                    paddingBottom: 0,
                    shadowColor: "#c8c8c8",
                    alignItems: "center",
                    justifyContent: "center",
                },
                tabBarActiveTintColor: colors.green,
                tabBarInactiveTintColor: "#888",
            }}
        >
            <Tabs.Screen
                name="cadastro"
                options={{
                    title: "Cadastro",
                    tabBarIcon: ({ focused }) => <MyTabScreenView icon="plus" focused={focused} />,
                }}
            />
            <Tabs.Screen
                name="index"
                options={{
                    title: "Minhas Peladas",
                    tabBarIcon: ({ focused }) => <MyTabScreenView icon="list-alt" focused={focused} />,
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    title: "Configurações",
                    tabBarIcon: ({ focused }) => <MyTabScreenView icon="cog" focused={focused} />,
                }}
            />
        </Tabs>
    );
}

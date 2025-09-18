import { Stack, Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { colors } from "../../components/ui/colors";

export default function LoginLayout() {
    return (
        <Stack
            screenOptions={{
                headerStyle: { backgroundColor: "#222" },
                headerTintColor: "#ffffff",
                tabBarActiveTintColor: colors.info,
                tabBarInactiveTintColor: "#888",
            }}
        >
            <Stack.Screen
                name="index"
                options={{ title: "Login", headerShown: false }}
            />
            <Stack.Screen
                name="cadastro"
                options={{ title: "Cadastro", headerShown: false }}
            />
            <Stack.Screen
                name="../"
                options={{ title: "Index", headerShown: false }}
            />
        </Stack>
    );
}

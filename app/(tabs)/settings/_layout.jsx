import { Stack, Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { colors } from "../../../components/ui/colors";

export default function UserConfigLayout() {
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
                options={{ title: "Configurações", headerShown: false }}
            />
            <Stack.Screen
                name="edit"
                options={{ title: "Editar Dados", headerShown: false }}
            />
            <Stack.Screen
                name="delete"
                options={{ title: "Deletar Conta", headerShown: false }}
            />
        </Stack>
    );
}

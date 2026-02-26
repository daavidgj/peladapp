import { Stack, Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { colors } from "../../components/ui/colors";
import { useIsFocused } from "@react-navigation/native";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../src/firebaseConnection";
import { router } from "expo-router";
import { useEffect } from "react";


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
                name="recuperar"
                options={{ title: "Recuperação de Senha", headerShown: false }}
            />
        </Stack>
    );
}

import { Stack, Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from "../../../components/ui/colors";
import { View } from "moti";
export default function UserConfigLayout() {
    const insets = useSafeAreaInsets();
    return (
        <View className="flex-1" style={{ marginTop: -insets.top }}>

            <Stack
                screenOptions={{
                    headerStyle: { backgroundColor: colors.primaryalt },
                    headerTintColor: "#ffffff",
                    tabBarInactiveTintColor: "#888"

                }}
            >
                <Stack.Screen
                    name="index"
                    options={{ title: "Configurações", headerShown: false }}
                />
                <Stack.Screen
                    name="edit"
                    options={{ title: "Editar Dados", headerShown: true }}
                />
                <Stack.Screen
                    name="delete"
                    options={{ title: "Deletar Conta", headerShown: true }}
                />
            </Stack>
        </View>
    );
}

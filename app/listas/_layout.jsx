import { Tabs, Stack } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { colors } from "../../components/ui/colors";
import { st } from "../../components/ui/myStyles";
import { View, Keyboard } from "react-native";
import MyTabScreenView from "../../components/secundario/mytabscreenview";
import { useEffect, useState } from "react";
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function TabsLayout() {
    /*const [keyboardVisible, setKeyboardVisible] = useState(false);
    useEffect(() => {
        const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
            setKeyboardVisible(true);
        });
        const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
            setKeyboardVisible(false);
        });

        // Limpeza
        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, []);
    console.log("Keyboard", keyboardVisible);*/
    return (
        <SafeAreaProvider>

            <Stack
                screenOptions={{
                    headerStyle: { backgroundColor: "#222" },
                    headerTintColor: "#ffffff",
                }}
            >
                <Stack.Screen name="[id]" options={{ headerShown: true, headerTitle: 'Lista' }} />
            </Stack>
        </SafeAreaProvider>
    );
}

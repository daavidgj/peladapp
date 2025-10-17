import { Tabs } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { colors } from "../../components/ui/colors";
import { st } from "../../components/ui/myStyles";
import { View, Keyboard } from "react-native";
import MyTabScreenView from "../../components/secundario/mytabscreenview";
import { useEffect, useState } from "react";
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function TabsLayout() {
    const [keyboardVisible, setKeyboardVisible] = useState(false);
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
    console.log("Keyboard", keyboardVisible);
    return (

        <Tabs
            screenOptions={{
                tabBarStyle: !keyboardVisible
                    ? {
                        position: "absolute",
                        bottom: 20,
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
                    }
                    : { opacity: 0, maxHeight: 0 },
                headerShown: false,
                tabBarActiveTintColor: colors.green,
                tabBarInactiveTintColor: "#888",
            }}
        >
            <Tabs.Screen name="partida" options={{ title: "Partida", tabBarIcon: ({ focused }) => <MyTabScreenView icon="star" focused={focused} /> }} />
            <Tabs.Screen
                name="[id]"
                options={{
                    title: "Minha Lista",
                    headerShown: false,
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

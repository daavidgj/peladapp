import { Stack, Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { colors } from "../../components/ui/colors";
import { useIsFocused } from "@react-navigation/native";
import MyTabScreenView from "../../components/secundario/mytabscreenview";
import { useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Keyboard } from "react-native";

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
    const isFocused = useIsFocused();
    console.log(isFocused);

    return (
        <Tabs
            initialRouteName="index"
            screenOptions={{
                animation: "fade", // or 'shift'
                transitionSpec: {
                    animation: "timing",
                    config: {
                        duration: 250,
                    },
                },
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
                    display: keyboardVisible ? "none" : "flex",
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

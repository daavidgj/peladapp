import { Stack, usePathname } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../components/ui/colors";
import { useEffect } from "react";
import { Redirect } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../src/firebaseConnection";
import React from "react";
import "../global.css";


import { useFonts, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins'




export default function RootLayout() {




    useEffect(() => {

        const unsubscribe = onAuthStateChanged(auth, (u) => {

            if (!u) {
                return <Redirect href="/login" />;
            }

        });

        return () => unsubscribe();
    }, []);
    const [fontsLoaded] = useFonts({
        Poppins_400Regular,
        Poppins_700Bold,
    });

    if (!fontsLoaded) {
        // Enquanto a fonte carrega, não renderiza nada (ou mostra loading)
        return null;
    } else {
        //console.log("Fonte carregada");
    }






    return (
        <>

            <StatusBar style="light" />
            <SafeAreaView style={{ flex: 1, backgroundColor: "#0A7725" }} edges={["top"]}>

                <Stack
                    screenOptions={{
                        headerStyle: { backgroundColor: colors.primaryalt },
                        headerTintColor: "#ffffff",
                    }}
                >
                    <Stack.Screen
                        name="index"
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="(tabs)"
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="listas"
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="login"
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="+not-found"
                    />
                </Stack>
            </SafeAreaView>
        </>
    );
}

import { useEffect } from "react";
import { View, Text, StyleSheet, Image, StatusBar, ActivityIndicatorComponent } from "react-native";
import { router } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../src/firebaseConnection";
import { colors } from "../components/ui/colors";
import { ActivityIndicator } from "react-native";
import { MotiView } from "moti";



export default function HomeScreen() {
    useEffect(() => {

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                console.log("Logado");
                router.replace("/(tabs)");
            } else {
                console.log("Não Logado");
                router.replace("/login");
            }
        });

        return () => unsubscribe();
    }, []);

    return (
        <View className="flex-1 items-center justify-center" style={{ backgroundColor: colors.primaryalt, position: "relative" }}>
            <MotiView
                className="flex-1 items-center justify-center"
                style={{ backgroundColor: colors.primaryalt, position: "relative" }}
                from={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ type: "timing", duration: 400 }}
            >
                <StatusBar hidden />
                <View className="h-56 w-56 items-center justify-center rounded-full overflow-hidden">

                    <Image source={require('../assets/images/Favicon logo peladapp.jpg')} className="flex-1" style={{ resizeMode: "contain" }} />
                </View>
                <ActivityIndicator size={288} color="#0A6614" style={{ position: "absolute" }} />
                <ActivityIndicator size={680} color="#0A6614" style={{ position: "absolute" }} />
            </MotiView>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});

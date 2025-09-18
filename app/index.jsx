import { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { router } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../src/firebaseConnection";

export default function HomeScreen() {
    useEffect(() => {
        console.log("Entrou na Ponte");

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                console.log("Logado");
                router.push("(tabs)");
            } else {
                console.log("Não Logado");
                router.replace("/login");
            }
        });

        return () => unsubscribe();
    }, []);

    return (
        <View style={styles.container}>
            <Text>Carregando...</Text>
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

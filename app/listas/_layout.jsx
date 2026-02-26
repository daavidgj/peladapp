import { Tabs, Stack, useLocalSearchParams } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { colors } from "../../components/ui/colors";
import { st } from "../../components/ui/myStyles";
import { View, Keyboard } from "react-native";
import MyTabScreenView from "../../components/secundario/mytabscreenview";
import { useEffect, useState } from "react";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from "expo-status-bar";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../../src/firebaseConnection";


export default function TabsLayout() {
    const [user, setUser] = useState(null);
    const { id } = useLocalSearchParams();


    const [nomePelada, setNomePelada] = useState("...");


    // Autenticação
    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, (usr) => {

            setUser(usr);
        });
        return unsubscribeAuth;
    }, []);
    // Buscar dados iniciais do Firestore
    useEffect(() => {
        if (!user || !id) return;

        async function buscarDadosIniciais() {
            try {
                const docRef = doc(db, "usuarios", user.uid, "listas", id);
                const snap = await getDoc(docRef);

                if (snap.exists()) {
                    const dados = snap.data();
                    setNomePelada(dados.nome || "");
                }
            } catch (error) {
                console.log("Erro ao buscar dados:", error);
            }
        }

        buscarDadosIniciais();
    }, [user, id]);

    const insets = useSafeAreaInsets();
    return (
        <View style={{ marginTop: -insets.top, flex: 1 }}>
            <Stack
                screenOptions={{
                    headerStyle: { backgroundColor: colors.primaryalt, paddingTop: 0 },
                    headerTintColor: "#ffffff",
                    headerShown: true,

                }}
            >
                <Stack.Screen name="[id]" options={{ headerTitle: `Lista - ${nomePelada}` }} />
            </Stack>
        </View>
    );
}

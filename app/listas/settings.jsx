import { Text, View, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Link, router } from "expo-router";
import { signOut } from "firebase/auth";
import { auth } from "../../src/firebaseConnection"; // ajuste o caminho conforme seu projeto
import { colors } from "../../components/ui/colors";
import { st } from "../../components/ui/myStyles";

export default function Settings() {
    //deslogar
    async function deslogar() {
        signOut(auth)
            .then(() => {
                console.log("Deslogou e Redirecionou");
                router.replace("../");
            })
            .catch((err) => Alert.alert("Erro", err.code + "\n" + err.message));
    }
    function test() {
        console.log("a");
    }
    return (
        <View style={st.container}>
            <Text style={st.h1}>Configurações</Text>
            <Text style={st.h2}>Página Inicial</Text>
            <Link replace href="/" asChild>
                <TouchableOpacity style={st.btn}>
                    <Text style={st.texto}>Ir para o Início</Text>
                </TouchableOpacity>
            </Link>
            <TouchableOpacity style={st.btn} onPress={deslogar}>
                <Text style={st.texto}>Deslogar</Text>
            </TouchableOpacity>
        </View>
    );
}

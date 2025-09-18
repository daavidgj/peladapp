import {
    Text,
    View,
    TouchableOpacity,
    StyleSheet,
    Alert,
    Pressable,
} from "react-native";
import { Link, router } from "expo-router";
import { signOut } from "firebase/auth";
import { auth } from "../../../src/firebaseConnection";
import { colors } from "../../../components/ui/colors";
import { st } from "../../../components/ui/myStyles";
import { Header } from "../../../components/tags/header";

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
        <View style={st.body}>
            <Header
                titulo="Configurações"
                descricao="Altere ou Edite seu perfil"
            />
            <View style={st.container}>
                <View>
                    <Text style={st.h2}>Editar</Text>
                    <Text style={st.p}>Edite seus dados</Text>
                </View>
                <Pressable
                    style={({ pressed }) => [
                        st.pressable,
                        pressed && st.pressableAtivo,
                    ]}
                    onPress={() => router.push("../settings/edit")}
                >
                    <Text style={st.pressableTexto}>Editar</Text>
                </Pressable>
                <View style={{ marginTop: 20 }}>
                    <Text style={st.h2}>Deletar Conta</Text>
                    <Text style={st.p}>
                        Apague sua conta de forma permanente
                    </Text>
                </View>
                <Pressable
                    style={({ pressed }) => [
                        st.pressable,
                        pressed && st.pressableAtivo,
                    ]}
                    onPress={() => router.push("../settings/delete")}
                >
                    <Text style={st.pressableTexto}>Deletar Conta</Text>
                </Pressable>
            </View>
        </View>
    );
}

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
import Start from "../../../components/tags/Start";
import { H1, H2, P, A, Span } from "../../../components/tipografy";
import { Feather } from "@expo/vector-icons";

import { SafeAreaView } from "react-native-safe-area-context";
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
    async function deslogar() {
        signOut(auth)
            .then(() => {
                alert("Sessão encerrada, faça login novamente");
                console.log("Deslogou e Redirecionou");
                router.replace("../");
            })
            .catch((err) => Alert.alert("Erro", err.code + "\n" + err.message));
    }
    return (

        <View className="flex-1">
            <Start typePlayer={1} />
            <View className="bg-white flex-1 px-10 py-12 w-full gap-5 items-center " style={{ borderTopLeftRadius: 25, borderTopRightRadius: 25 }}>
                <View>
                    <H1>Configurações</H1>
                    <P>Edite suas configurações</P>
                </View>
                <View className="w-full gap-5">

                    <View className="flex-row gap-5">
                        <TouchableOpacity className="gap-2 rounded-lg flex-1 bg-slate-100 p-6 " onPress={() => router.push("../settings/edit")}>
                            <Feather name="user" size={24} color="black" />

                            <P >Editar</P>

                        </TouchableOpacity>
                        <TouchableOpacity className="gap-2 rounded-lg w-36 bg-slate-100 p-6 " onPress={() => router.push("../settings/delete")}>
                            <Feather name="trash" size={24} color="black" />
                            <P >Deletar Conta</P>

                        </TouchableOpacity>
                    </View>
                    <View className="flex-row gap-5">
                        <TouchableOpacity className="gap-2 rounded-lg w-42 bg-slate-100 p-6 " onPress={() => router.push("../settings/delete")}>
                            <Feather name="star" size={24} color="black" />
                            <P >Avalie-nos</P>

                        </TouchableOpacity>
                        <TouchableOpacity className="gap-2 rounded-lg flex-1 bg-slate-100 p-6 " onPress={deslogar}>
                            <Feather name="arrow-left" size={24} color="black" />
                            <P >Sair da Conta</P>

                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );
}

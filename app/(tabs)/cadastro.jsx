import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Alert, Switch, Pressable, Image, TouchableOpacity, FlatList, ImageBackground } from "react-native";
import { auth, db } from "../../src/firebaseConnection";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { colors } from "../../components/ui/colors";
import { st } from "../../components/ui/myStyles";
import { router } from "expo-router";
import { Header } from "../../components/tags/header";
import Botao2 from "../../components/secundario/botao2";
import Botao1 from "../../components/secundario/botao1";
import MyInputText from "../../components/secundario/myInputText";
import { Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { H1, H2, P, A, Span } from "../../components/tipografy";
import Start from "../../components/tags/Start";

export default function CadastroLista() {
    const [user, setUser] = useState(null);

    const [nome, setNome] = useState("");
    const [jogadoresNaLinha, setJogadoresNaLinha] = useState(4);
    const [cronometro, setCronometro] = useState("7");

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (usr) => {
            if (!usr) {
                router.replace("/login");
            } else {
                setUser(usr);
            }
        });
        return unsubscribe;
    }, []);

    async function handleSalvar() {
        if (!nome.trim()) {
            Alert.alert("Erro", "Informe o nome da lista");
            return;
        }
        if (!user) {
            Alert.alert("Erro", "Usuário não autenticado");
            return;
        }

        try {
            await addDoc(collection(db, "usuarios", user.uid, "listas"), {
                nome,
                jogadoresNaLinha: Number(jogadoresNaLinha) || 4,
                cronometro: Number(cronometro) || 7,
                createdAt: serverTimestamp(),
                emcampo: false,

                admins: [user.uid],//Primeiro dono da Lista, Lista aceita novos donos convidados

            });
            Alert.alert("Sucesso", "Lista adicionada!");
            setNome("");
            setJogadoresNaLinha("4");
            setCronometro("7");
        } catch (error) {
            Alert.alert("Erro", "Não foi possível salvar a lista");
            console.error(error);
        }
    }

    return (
        <View style={{ flex: 1 }}>
            <Start typePlayer={1} />
            <View className="bg-white flex-1 px-10 py-12 w-full gap-5 items-center" style={{ borderTopLeftRadius: 25, borderTopRightRadius: 25 }}>
                <View className="justify-center items-center">
                    <H1>Cadastrar Pelada</H1>
                </View>

                <View className="w-full">
                    <MyInputText titulo="Nome da lista" placeholder="Digite o nome da lista" value={nome} onChangeText={setNome} keyboardType="default" />
                </View>
                <View className="flex-row justify-between gap-5 w-full">
                    <View className="gap-3">
                        <P>Jogadores na Linha</P>
                        <View className="flex-row">
                            <FlatList
                                contentContainerStyle={{ gap: 4 }}
                                data={[3, 4, 5, 6]}
                                horizontal={true}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        onPress={() => setJogadoresNaLinha(item)}
                                        className="px-3 py-2 rounded-xl border-2 border-slate-200"
                                        style={jogadoresNaLinha === item ? { backgroundColor: colors.green } : { backgroundColor: colors.primary }}
                                    >
                                        <Text style={jogadoresNaLinha === item ? { color: colors.primary } : { color: "gray" }}>{item}</Text>
                                    </TouchableOpacity>
                                )}
                            />
                        </View>
                    </View>
                    <View>
                        <MyInputText
                            titulo="Tempo da Partida"
                            placeholder="Digite o Tempo"
                            value={cronometro}
                            onChangeText={setCronometro}
                            keyboardType="default"
                        />
                    </View>
                </View>

                <View className="items-center">
                    <Botao1 cta="Salvar" onpressProp={() => handleSalvar()} />
                </View>
                <Pressable onPress={() => router.back()} style={({ pressed }) => [st.formPressable2, pressed && st.formPressable2Ativo]}>
                    <Text style={st.formPressable2Texto}>Voltaraaaaaaa</Text>
                </Pressable>
            </View>
        </View>
    );
}

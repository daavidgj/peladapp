import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Alert, Switch, Pressable, Image, TouchableOpacity, FlatList } from "react-native";
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

export default function CadastroLista() {
    const [user, setUser] = useState(null);

    const [nome, setNome] = useState("");
    const [jogadoresNaLinha, setJogadoresNaLinha] = useState(4);
    const [goleiroFixo, setGoleiroFixo] = useState(true);
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
                goleiroFixo,
                cronometro: Number(cronometro) || 7,
                createdAt: serverTimestamp(),
                emcampo: false,
            });
            Alert.alert("Sucesso", "Lista adicionada!");
            setNome("");
            setJogadoresNaLinha("4");
            setGoleiroFixo(true);
            setCronometro("7");
        } catch (error) {
            Alert.alert("Erro", "Não foi possível salvar a lista");
            console.error(error);
        }
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Header titulo="Cadastrar Pelada" descricao="Crie uma nova pelada com as configurações básicas" />
            <View className="flex-1 p-6 gap-5">
                <View className="bg-white flex-col rounded justify-center items-center py-12 px-5 gap-5">
                    <View className="w-full">
                        <MyInputText titulo="Nome da lista" placeholder="Digite o nome da lista" value={nome} onChangeText={setNome} keyboardType="default" />
                    </View>
                    <View className="flex-row justify-between gap-5 w-full">
                        <View className="gap-3">
                            <Text>Jogadores na Linha</Text>
                            <View className="flex-row">
                                <FlatList
                                    contentContainerStyle={{ gap: 4 }}
                                    data={[3, 4, 5, 6]}
                                    horizontal={true}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity
                                            onPress={() => setJogadoresNaLinha(item)}
                                            className="px-3 py-2 rounded-lg border-2 border-slate-200"
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

                    <View className="w-full items-start justify-start ">
                        <Text>Goleiro fixo?</Text>
                        <View className="flex-row items-center">
                            <Text>{goleiroFixo ? "Sim" : "Não"}</Text>
                            <Switch
                                value={goleiroFixo}
                                onValueChange={setGoleiroFixo}
                                trackColor={{
                                    false: colors.gray,
                                    true: colors.gray,
                                }}
                                thumbColor={colors.green}
                                style={{ marginLeft: 10 }}
                            />
                        </View>
                    </View>
                </View>
                <View className="items-center">
                    <Botao1 cta="Salvar" onpressProp={() => handleSalvar()} />
                </View>
                <Pressable onPress={() => router.back()} style={({ pressed }) => [st.formPressable2, pressed && st.formPressable2Ativo]}>
                    <Text style={st.formPressable2Texto}>Voltaraaaaaaa</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
}

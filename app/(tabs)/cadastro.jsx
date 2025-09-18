import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Alert, Switch, Pressable,Image, TouchableOpacity } from "react-native";
import { auth, db } from "../../src/firebaseConnection";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { colors } from "../../components/ui/colors";
import { st } from "../../components/ui/myStyles";
import { router } from "expo-router";
import { Header } from "../../components/tags/header";
import Botao2 from '../../components/secundario/botao2';
import {Feather} from '@expo/vector-icons';
import { SafeAreaView } from "react-native-safe-area-context";



export default function CadastroLista() {
    const [user, setUser] = useState(null);

    const [nome, setNome] = useState("");
    const [jogadoresNaLinha, setJogadoresNaLinha] = useState("4");
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
        <SafeAreaView style={{flex:1}}>

                       
            <Header
                titulo="Cadastrar Pelada"
                descricao="Crie uma nova pelada com as configurações básicas"
            />
            <View style={st.container}>
                <View className="bg-white flex-col rounded justify-center items-center py-12 px-5 gap-5">
                    <View className="w-full">
                    <Text>Nome da lista</Text>
                    <TextInput
                            className="bg-slate-100 w-full p-3 rounded-lg border-2 border-slate-200"
                            placeholder="Digite o nome da lista"
                            value={nome}
                            onChangeText={setNome}
                        />
                    </View>
                    <View style={{ flexDirection: "row", width: 160, gap: 10 }}>
                        <View>
                            <Text style={st.formTextLabel}>
                                Jogadores na linha
                            </Text>
                            <TextInput
                                style={st.formInput}
                                placeholder="4"
                                keyboardType="numeric"
                                value={jogadoresNaLinha}
                                onChangeText={setJogadoresNaLinha}
                            />
                        </View>
                        <View>
                            <Text style={st.formTextLabel}>
                                Cronômetro (min)
                            </Text>
                            <TextInput
                                style={st.formInput}
                                placeholder="7"
                                keyboardType="numeric"
                                value={cronometro}
                                onChangeText={setCronometro}
                            />
                        </View>
                    </View>

                    <View style={{ flexDirection: "row", width: 160, gap: 10 }}>
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                marginTop: 10,
                            }}
                        >
                            <Text style={st.formTextLabel}>Goleiro fixo?</Text>
                            <Switch
                                value={goleiroFixo}
                                onValueChange={setGoleiroFixo}
                                trackColor={{
                                    false: colors.gray,
                                    true: colors.primary,
                                }}
                                thumbColor="#fff"
                                style={{ marginLeft: 10 }}
                            />
                        </View>
                        <Pressable
                            onPress={handleSalvar}
                            style={({ pressed }) => [
                                st.formPressable,
                                pressed && st.formPressableAtivo,
                                { marginTop: 20 },
                            ]}
                        >
                            <Text style={st.formPressableTexto}>+</Text>
                        </Pressable>
                    </View>
                </View>
                <Botao2 cta="Salvar" onpress={() => handleSalvar()}/>
                <Pressable
                    onPress={() => router.back()}
                    style={({ pressed }) => [
                        st.formPressable2,
                        pressed && st.formPressable2Ativo,
                    ]}
                >
                    <Text style={st.formPressable2Texto}>Voltaraaaaaaa</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
}

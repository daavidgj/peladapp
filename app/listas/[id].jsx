import React, { useEffect, useState, useRef } from "react";
import { useLocalSearchParams, router } from "expo-router";
import { View, Text, TextInput, TouchableOpacity, Pressable, Alert, FlatList, Keyboard, Vibration, Switch } from "react-native";
import { MotiView } from "moti";
import { Easing } from "react-native-reanimated";
import { Ionicons, Feather } from "@expo/vector-icons";
import { auth, db } from "../../src/firebaseConnection";

import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";

import { colors } from "../../components/ui/colors";
import { st } from "../../components/ui/myStyles";
import MyInputText from "../../components/secundario/myInputText";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Botao1 from "../../components/secundario/botao1";

export default function CadastroJogador() {
    const [startShake, setStartShake] = useState(false);
    const [user, setUser] = useState(null);
    const { id } = useLocalSearchParams();

    const [tempo, setTempo] = useState(0);
    const [rodando, setRodando] = useState(false);
    const intervaloRef = useRef(null);

    const [nomeJogador, setNomeJogador] = useState({});
    const [jogadores, setJogadores] = useState({});
    const [jogadoresNaLinha, setJogadoresNaLinha] = useState(4);
    const [ordemFilas, setOrdemFilas] = useState([1, 2, 3]);
    const [emCampo, setEmCampo] = useState(false);
    const textoFila = {
        1: "1º Primeira",
        2: "2º Segunda",
        3: "3º Terceira",
        4: "4º Quarta",
        5: "5º Quinta",
        6: "6º Sexta",
        7: "7º Sétima",
        8: "8º Oitava",
        9: "9º Nona",
        10: "10º Décima",
        11: "11º Décima Primeira",
        12: "12º Décima Segunda",
        13: "13º Décima Terceira",
        14: "14º Décima Quarta",
        15: "15º Décima Quinta",
    };
    function mensagemProxima(a) {
        const mensagemAqui = textoFila[a];
        return mensagemAqui;
    }

    // Autenticação
    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, (usr) => {
            if (!usr) router.replace("/login");
            else setUser(usr);
        });
        return unsubscribeAuth;
    }, []);
    // Buscar dados iniciais do Firestore
    useEffect(() => {
        async function buscarDadosIniciais() {
            if (user && id) {
                const docRef = doc(db, "usuarios", user.uid, "listas", id);
                const snap = await getDoc(docRef);
                if (snap.exists()) {
                    const dados = snap.data();
                    setJogadoresNaLinha(dados.jogadoresNaLinha || 4);
                    setTempo(dados.tempoPartida || 7); // pega tempo inicial do banco
                    setJogadores(dados.jogadores || {});
                    setOrdemFilas(dados.ordemFilas || [1, 2, 3]);
                    setEmCampo(dados.emCampo || false);
                }
            }
        }
        buscarDadosIniciais();
    }, [user, id]);

    // Atualiza ordemFilas se a última fila tem jogadores
    useEffect(() => {
        if (!ordemFilas || ordemFilas.length === 0) return;

        const ultimaFila = ordemFilas[ordemFilas.length - 1];
        const jogadoresNaUltimaFila = jogadores[ultimaFila] || [];

        if (jogadoresNaUltimaFila.length > 0) {
            const novaFila = ultimaFila + 1;
            if (!ordemFilas.includes(novaFila)) {
                setOrdemFilas((prev) => [...prev, novaFila]);
            }
        }
    }, [jogadores, ordemFilas]);

    // Função para salvar jogadores e ordemFilas no banco (sem tempo)
    async function salvarDadosNoBanco() {
        if (!user || !id) return;
        try {
            const docRef = doc(db, "usuarios", user.uid, "listas", id);
            await updateDoc(docRef, {
                jogadores,
                ordemFilas,
                jogadoresNaLinha,
                emCampo,
            });
        } catch (error) {
            console.error("Erro ao salvar dados:", error);
        }
    }

    // Salva no banco jogadores, filas e jogadoresNaLinha quando mudam
    useEffect(() => {
        salvarDadosNoBanco();
    }, [jogadores, ordemFilas, jogadoresNaLinha, emCampo]);

    function adicionarJogador(fila) {
        const nome = (nomeJogador[fila] || "").trim();
        if (!nome) {
            Alert.alert("Erro", "Digite o nome do jogador.");
            return;
        }

        setJogadores((prev) => {
            const novaFila = prev[fila] ? [...prev[fila]] : [];
            if (novaFila.some((j) => j.nome === nome)) {
                Alert.alert("Aviso", "Jogador já está na fila.");
                return prev;
            }
            novaFila.push({ id: Date.now().toString(), nome });
            return { ...prev, [fila]: novaFila };
        });

        setNomeJogador((prev) => ({ ...prev, [fila]: "" }));
    }

    function removerJogador(fila, jogadorId) {
        setJogadores((prev) => {
            const novaFila = (prev[fila] || []).filter((j) => j.id !== jogadorId);
            return { ...prev, [fila]: novaFila };
        });
    }

    function moverFilaParaFim(fila) {
        setOrdemFilas((prev) => {
            const novaOrdem = prev.filter((f) => f !== fila);
            novaOrdem.push(fila);
            return novaOrdem;
        });
    }
    function moverFilaParaCima(fila) {
        setOrdemFilas((prev) => {
            const index = prev.indexOf(fila);
            Vibration.vibrate(100);
            if (index <= 0) return prev; // já está no topo
            const novaOrdem = [...prev];
            [novaOrdem[index - 1], novaOrdem[index]] = [novaOrdem[index], novaOrdem[index - 1]];
            return novaOrdem;
        });
    }

    function moverFilaParaBaixo(fila) {
        setOrdemFilas((prev) => {
            const index = prev.indexOf(fila);
            Vibration.vibrate(100);
            if (index === -1 || index === prev.length - 1) return prev; // já está no fim
            const novaOrdem = [...prev];
            [novaOrdem[index + 1], novaOrdem[index]] = [novaOrdem[index], novaOrdem[index + 1]];
            return novaOrdem;
        });
    }
    async function excluirFila(fila) {
        if (!user || !id) return;

        try {
            const docRef = doc(db, "usuarios", user.uid, "listas", id);

            // 1️⃣ Remove todos os jogadores da fila
            const novosJogadores = { ...jogadores };
            if (novosJogadores[fila]) {
                delete novosJogadores[fila];
            }

            // 2️⃣ Remove a fila da ordem
            const novaOrdemFilas = ordemFilas.filter((f) => f !== fila);

            // 3️⃣ Atualiza estado local
            setJogadores(novosJogadores);
            setOrdemFilas(novaOrdemFilas);

            // 4️⃣ Atualiza Firestore
            await updateDoc(docRef, {
                jogadores: novosJogadores,
                ordemFilas: novaOrdemFilas,
            });

            Alert.alert("Sucesso", `Equipe ${fila} entrou em campo!`);
        } catch (error) {
            console.error("Erro ao subir equipe: ", error, "em campo");
            Alert.alert("Erro", "Não foi possível subir a equipe para o campo.");
        }
    }
    function completarEquipe(fila) {
        const jogadoresFila = jogadores[fila] || [];
        const faltando = jogadoresNaLinha - jogadoresFila.length;

        if (faltando <= 0) return; // equipe já está completa

        // Pegar jogadores disponíveis das outras filas
        const novosJogadores = { ...jogadores };
        let jogadoresAdicionados = [];

        for (let f of ordemFilas) {
            if (f === fila) continue; // ignora a fila atual
            const filaAtual = novosJogadores[f] || [];

            while (filaAtual.length > 0 && jogadoresAdicionados.length < faltando) {
                const jogador = filaAtual.shift(); // pega o primeiro jogador
                jogadoresAdicionados.push(jogador);
            }

            novosJogadores[f] = filaAtual; // atualiza a fila sem os jogadores movidos
            if (jogadoresAdicionados.length === faltando) break;
        }

        // Atualiza a fila que vai para o campo
        novosJogadores[fila] = [...jogadoresFila, ...jogadoresAdicionados];
        setJogadores(novosJogadores);

        // Agora você pode seguir com o que faz no "Entrar em Campo"
        setEmCampo(true);
        salvarDadosNoBanco();
    }

    const renderFila = ({ item: fila }) => {
        const jogadoresFila = jogadores[fila] || [];
        const filaCheia = jogadoresFila.length >= jogadoresNaLinha;

        return (
            <>
                <View className="p-6 gap-5">
                    <Pressable onPress={() => moverFilaParaFim(fila)}>
                        {ordemFilas.indexOf(fila) != 0 ? (
                            <Text style={st.h2}> {mensagemProxima(ordemFilas.indexOf(fila) + 1)}</Text>
                        ) : (
                            <Text style={[st.h2, { color: colors.green }]}> {mensagemProxima(ordemFilas.indexOf(fila) + 1)}</Text>
                        )}
                    </Pressable>
                    <View className=" border-2 border-slate-100 py-5 px-4 gap-1" style={{ borderRadius: 15, backgroundColor: "#ffffff" }}>
                        <View className="justify-between flex-row mb-5">
                            <View className="items-center justify-center">
                                <Text className="text-lg font-bold" style={{ color: colors.green }}>
                                    Equipe {fila}
                                </Text>
                            </View>
                            <View className="justify-between flex-row gap-5">
                                {ordemFilas.indexOf(fila) != 0 && (
                                    <TouchableOpacity className="p-1 rounded-lg bg-slate-100" onPress={() => moverFilaParaCima(fila)}>
                                        <Ionicons name="chevron-up" size={22} color="#aaaaaa" />
                                    </TouchableOpacity>
                                )}
                                {ordemFilas.indexOf(fila) != ordemFilas.length - 1 && (
                                    <TouchableOpacity className="p-1 rounded-lg bg-slate-100 justify-center" onPress={() => moverFilaParaBaixo(fila)}>
                                        <Ionicons name="chevron-down" size={22} color="#aaaaaa" />
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>
                        <FlatList
                            data={jogadoresFila}
                            keyExtractor={(jog) => jog.id}
                            renderItem={({ item, index: i }) => (
                                <MotiView
                                    key={i}
                                    from={{ opacity: 0, translateX: -40 }}
                                    animate={{ opacity: 1, translateX: 0 }}
                                    transition={{ delay: i * 100 }}
                                    className="flex-row justify-between items-center px-2 py-1 rounded-lg mb-2"
                                    style={{ backgroundColor: "#f1f5f990" }}
                                >
                                    <View className="flex-row gap-2 items-center">
                                        <Ionicons
                                            name="person-circle-outline"
                                            size={24}
                                            color="#a8a8a8"
                                            style={{ backgroundColor: colors.white, borderRadius: 100 }}
                                        />
                                        <Text className="text-lg">{item.nome}</Text>
                                    </View>
                                    <Pressable onPress={() => removerJogador(fila, item.id)} style={{ marginLeft: 10, padding: 5 }}>
                                        <Ionicons name="trash" size={18} color={colors.secondary} />
                                    </Pressable>
                                </MotiView>
                            )}
                        />

                        {!filaCheia && (
                            <View className="flex-row items-center w-full justify-between gap-2">
                                <View className="flex-1 ">
                                    <TextInput
                                        className="bg-slate-100 w-full p-3 rounded-lg border border-slate-200"
                                        placeholder="Digite o Nome do jogador"
                                        placeholderTextColor={"gray"}
                                        value={nomeJogador[fila] || ""}
                                        onChangeText={(text) => setNomeJogador((prev) => ({ ...prev, [fila]: text }))}
                                    />
                                </View>
                                <Text></Text>
                                <TouchableOpacity
                                    className="p-2 rounded-full"
                                    style={nomeJogador[fila] != false ? { backgroundColor: colors.green } : { backgroundColor: colors.gray }}
                                    onPress={() => adicionarJogador(fila)}
                                >
                                    <Ionicons name="add" size={24} color="white" />
                                </TouchableOpacity>
                            </View>
                        )}
                        {ordemFilas.indexOf(fila) === 0 && (
                            <View className="gap-2 items-center mt-5">
                                {jogadoresFila.length < jogadoresNaLinha ? (
                                    <View style={{ marginBottom: "-65" }}>
                                        <TouchableOpacity className={"p-3 rounded-full  mx-auto bg-slate-500"} onPress={() => completarEquipe(fila)}>
                                            <Text className="text-white text-center">Preencher Lista</Text>
                                        </TouchableOpacity>
                                        <Text className="text-center text-red-500">Preencha a Equipe</Text>
                                    </View>
                                ) : (
                                    <View style={{ marginBottom: "-60" }}>
                                        <Botao1
                                            cta={"Subir Equipe"}
                                            onpressProp={() =>
                                                Alert.alert("Confirmar", "Deseja realmente subir a equipe?", [
                                                    { text: "Cancelar", style: "cancel" },
                                                    { text: "Entrar", style: "destructive", onPress: () => excluirFila(fila) },
                                                ])
                                            }
                                        />
                                    </View>
                                )}
                            </View>
                        )}
                    </View>
                </View>
                {ordemFilas.indexOf(fila) + 1 != ordemFilas.length ? (
                    <View
                        className="bg-zinc-200 h-1 w-72 mx-auto mt-6 mb-2"
                        style={ordemFilas.indexOf(fila) != 0 ? { marginTop: "15" } : { marginTop: "35" }}
                    ></View>
                ) : (
                    <View className="justify-center items-center mx-auto mt-6 px-6">
                        <Text className="text-center">Fim da Lista, adicione um nome nas equipes completamente vazias para criar uma nova equipe.</Text>
                    </View>
                )}
            </>
        );
    };

    return (
        <SafeAreaProvider style={{}}>
            <View className="flex-1 px-3">
                <FlatList
                    data={ordemFilas}
                    contentContainerStyle={{ paddingBottom: 110, paddingTop: 30 }}
                    keyExtractor={(item) => item.toString()}
                    renderItem={renderFila}
                    extraData={{ jogadores, nomeJogador, jogadoresNaLinha }}
                    nestedScrollEnabled
                />
            </View>
        </SafeAreaProvider>
    );
}

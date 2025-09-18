import React, { useEffect, useState, useRef } from "react";
import { useLocalSearchParams, router } from "expo-router";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Pressable,
    Alert,
    FlatList,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { auth, db } from "../../src/firebaseConnection";

import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";

import { colors } from "../../components/ui/colors";
import { st } from "../../components/ui/myStyles";

export default function CadastroJogador() {
    const [user, setUser] = useState(null);
    const { id } = useLocalSearchParams();

    const [tempo, setTempo] = useState(0);
    const [rodando, setRodando] = useState(false);
    const intervaloRef = useRef(null);

    const [nomeJogador, setNomeJogador] = useState({});
    const [jogadores, setJogadores] = useState({});
    const [jogadoresNaLinha, setJogadoresNaLinha] = useState(4);
    const [ordemFilas, setOrdemFilas] = useState([1, 2, 3]);

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
                    setTempo(dados.tempoPartida || 0); // pega tempo inicial do banco
                    setJogadores(dados.jogadores || {});
                    setOrdemFilas(dados.ordemFilas || [1, 2, 3]);
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

    // Controle do cronômetro local
    useEffect(() => {
        if (rodando) {
            if (!intervaloRef.current) {
                intervaloRef.current = setInterval(() => {
                    setTempo((t) => t + 1); // incrementa 1 segundo
                }, 1000);
            }
        } else {
            if (intervaloRef.current) {
                clearInterval(intervaloRef.current);
                intervaloRef.current = null;
            }
        }
        return () => {
            if (intervaloRef.current) {
                clearInterval(intervaloRef.current);
                intervaloRef.current = null;
            }
        };
    }, [rodando]);

    // Função para salvar jogadores e ordemFilas no banco (sem tempo)
    async function salvarDadosNoBanco() {
        if (!user || !id) return;
        try {
            const docRef = doc(db, "usuarios", user.uid, "listas", id);
            await updateDoc(docRef, {
                jogadores,
                ordemFilas,
                jogadoresNaLinha,
            });
        } catch (error) {
            console.error("Erro ao salvar dados:", error);
        }
    }

    // Salva no banco jogadores, filas e jogadoresNaLinha quando mudam
    useEffect(() => {
        salvarDadosNoBanco();
    }, [jogadores, ordemFilas, jogadoresNaLinha]);

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
            const novaFila = (prev[fila] || []).filter(
                (j) => j.id !== jogadorId
            );
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

    function formatarTempo(segundos) {
        const min = Math.floor(segundos / 60);
        const seg = segundos % 60;
        return `${min.toString().padStart(2, "0")}:${seg
            .toString()
            .padStart(2, "0")}`;
    }

    const renderFila = ({ item: fila }) => {
        const jogadoresFila = jogadores[fila] || [];
        const filaCheia = jogadoresFila.length >= jogadoresNaLinha;

        return (
            <View>
                <Pressable onPress={() => moverFilaParaFim(fila)}>
                    <Text style={st.h2}>Fila {fila} </Text>
                </Pressable>
                <View
                    style={{
                        backgroundColor: "#111111",
                        borderWidth: 3,
                        borderColor: colors.dark,
                        padding: 5,
                        borderRadius: 10,
                        marginVertical: 30,
                    }}
                >
                    <FlatList
                        data={jogadoresFila}
                        keyExtractor={(jog) => jog.id}
                        renderItem={({ item }) => (
                            <View style={st.jogadorcard1}>
                                <Ionicons
                                    name="person-circle-outline"
                                    size={24}
                                    color="#ffffff"
                                />
                                <Text style={st.jogadorNome}>{item.nome}</Text>
                                <Pressable
                                    onPress={() =>
                                        removerJogador(fila, item.id)
                                    }
                                    style={{ marginLeft: 10 }}
                                >
                                    <Text
                                        style={{ color: "red", fontSize: 18 }}
                                    >
                                        🗑️
                                    </Text>
                                </Pressable>
                            </View>
                        )}
                        style={{
                            flexGrow: 1,
                            padding: 5,
                            marginTop: 30,
                        }}
                        nestedScrollEnabled
                    />

                    {!filaCheia && (
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "center",
                                alignItems: "center",
                                marginTop: 10,
                            }}
                        >
                            <TextInput
                                style={[
                                    st.formInput,
                                    {
                                        flex: 1,
                                        color: colors.white,
                                        height: 70,
                                    },
                                ]}
                                placeholder={`Nome jogador fila ${fila}`}
                                placeholderTextColor={"#777777"}
                                value={nomeJogador[fila] || ""}
                                onChangeText={(text) =>
                                    setNomeJogador((prev) => ({
                                        ...prev,
                                        [fila]: text,
                                    }))
                                }
                            />
                            <TouchableOpacity
                                style={[
                                    st.btn,
                                    {
                                        marginLeft: 8,
                                        height: 60,
                                        marginTop: "2",
                                    },
                                ]}
                                onPress={() => adicionarJogador(fila)}
                            >
                                <Text style={st.texto}>+</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </View>
        );
    };

    return (
        <View style={st.container}>
            <Pressable
                style={{
                    alignSelf: "center",
                    backgroundColor: colors.primary,
                    padding: 10,
                    borderRadius: 8,
                    marginBottom: 20,
                }}
                onPress={() => setRodando((r) => !r)}
            >
                <Text
                    style={{ color: "#fff", fontSize: 20, fontWeight: "bold" }}
                >
                    {rodando ? "⏸️ " : "▶️ "} {formatarTempo(tempo)}
                </Text>
            </Pressable>

            <Text style={st.h1}>Gerenciar Jogadores</Text>

            <FlatList
                data={ordemFilas}
                keyExtractor={(item) => item.toString()}
                renderItem={renderFila}
                extraData={{ jogadores, nomeJogador, jogadoresNaLinha }}
                nestedScrollEnabled
            />
        </View>
    );
}

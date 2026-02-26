import React, { useEffect, useState, useRef } from "react";
import { useLocalSearchParams, router } from "expo-router";
import { View, Text, TextInput, TouchableOpacity, Pressable, Alert, FlatList, Keyboard, Vibration, Switch, ToastAndroid, KeyboardAvoidingView, Platform, ImageBackground } from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { auth, db } from "../../../src/firebaseConnection";

import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc, deleteDoc, serverTimestamp } from "firebase/firestore";

import { colors } from "../../../components/ui/colors";
import { st } from "../../../components/ui/myStyles";
import MyInputText from "../../../components/secundario/myInputText";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Botao1 from "../../../components/secundario/botao1";
import ShapeLoading from "../../../components/secundario/shapeLoading";
import { H1, H2, P, P2, A, Span } from "../../../components/tipografy";
import JogadorItem from "../../../components/tags/jogadorItem";
import Botao2 from "../../../components/secundario/botao2";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Animated, { Layout, Easing } from "react-native-reanimated";
import { showToast } from "../../../components/functions/toast";
import useKeyboard from "../../../components/functions/keyboardContext";
import scrollToInput from "../../../components/functions/scrollDirection";
import { ScrollView } from 'react-native';
import { MotiView } from "moti";

function garantirUnico(array) {
    return [...new Set(array)];
}

export default function CadastroJogador() {

    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState(null);
    const { id } = useLocalSearchParams();

    const [direcaoAnimacao, setDirecaoAnimacao] = useState(0);
    const [direcaoAnimacaoY, setDirecaoAnimacaoY] = useState(0);
    const [shake, setShake] = useState(false);
    const longPressAtivado = useRef(false);
    const inputRef = useRef({});
    const scrollRef = useRef(null);
    const { keyboardVisible, keyboardHeight } = useKeyboard();

    const [nomeJogador, setNomeJogador] = useState({});
    const [jogadores, setJogadores] = useState({});
    const [jogadoresNaLinha, setJogadoresNaLinha] = useState(4);
    const [ordemFilas, setOrdemFilas] = useState([1, 2, 3]);
    const [emCampo, setEmCampo] = useState(false);
    const [dadosCarregados, setDadosCarregados] = useState(false);
    const [equipesEmCampo, setEquipesEmCampo] = useState([null, null]);

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
    // Em campo
    function subirEquipeManual() {
        const primeiraFila = ordemFilas[0];
        const timePrimeira = jogadores[primeiraFila] || [];

        if (timePrimeira.length < jogadoresNaLinha) {
            Alert.alert(
                "Equipe incompleta",
                "A primeira equipe da fila precisa estar completa."
            );
            return;
        }

        if (!primeiraFila) {
            Alert.alert("Sem equipe válida", "Nenhuma equipe completa na próxima.");
            return;
        }

        const indexVazio = equipesEmCampo.findIndex(id => id === null);

        if (indexVazio === -1) {
            Alert.alert("Campo cheio", "Já existem 2 equipes em campo.");
            return;
        }

        const novoCampo = [...equipesEmCampo];
        novoCampo[indexVazio] = primeiraFila;

        setEquipesEmCampo(novoCampo);
        setOrdemFilas(prev => prev.filter(id => id !== primeiraFila));
    }
    function handlePerdeu(equipeId) {
        const indexCampo = equipesEmCampo.indexOf(equipeId);
        if (indexCampo === -1) return;

        const primeiraFila = ordemFilas[0];

        if (!primeiraFila) {
            Alert.alert("Sem equipe disponível", "Não há equipe na fila.");
            return;
        }

        const jogadoresPrimeira = jogadores[primeiraFila] || [];

        // 🚨 BLOQUEIA se estiver vazia
        if (jogadoresPrimeira.length === 0) {
            Alert.alert(
                "Fila vazia",
                "A primeira equipe da fila está vazia."
            );
            return;
        }

        // 🚨 BLOQUEIA se estiver incompleta
        if (jogadoresPrimeira.length < jogadoresNaLinha) {
            Alert.alert(
                "Equipe incompleta",
                "Complete a primeira equipe antes de subir."
            );
            return;
        }

        // ✅ Verifica se está completa
        if (jogadoresPrimeira.length < jogadoresNaLinha) {
            Alert.alert(
                "Equipe incompleta",
                "Complete a primeira equipe antes de subir."
            );
            return;
        }

        // ✅ Sobe mantendo posição fixa no campo
        const novoCampo = [...equipesEmCampo];
        novoCampo[indexCampo] = primeiraFila;
        setEquipesEmCampo(novoCampo);

        // ✅ Remove quem subiu da fila
        let novasFilas = ordemFilas.slice(1);

        // ✅ Perdedor volta pro fim (se não estiver vazio)
        const perdeuEstaVazio = (jogadores[equipeId] || []).length === 0;

        if (!perdeuEstaVazio) {
            novasFilas.push(equipeId);
        }

        setOrdemFilas(garantirUnico(novasFilas));
    }// Autenticação
    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, (usr) => {
            setUser(usr);
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
                    setJogadores(dados.jogadores || {});
                    setOrdemFilas(dados.ordemFilas || [1, 2, 3]);
                    setEmCampo(dados.emCampo || false);
                    setEquipesEmCampo(dados.equipesEmCampo || [null, null]);

                    setDadosCarregados(true); // 👈 aqui
                    setIsLoading(false);
                }
            }
        }
        buscarDadosIniciais();
    }, [user, id]);
    useEffect(() => {
        console.log("ordemFilas:", ordemFilas);
    }, [ordemFilas]);
    // Atualiza ordemFilas se a última fila tem jogadores
    useEffect(() => {
        if (!ordemFilas.length) return;

        setOrdemFilas(prev => {
            let novaOrdem = [...prev];

            // 1️⃣ Separar vazias
            const naoVazias = novaOrdem.filter(id => {
                const time = jogadores[id] || [];
                return time.length > 0;
            });

            const vazias = novaOrdem.filter(id => {
                const time = jogadores[id] || [];
                return time.length === 0;
            });

            novaOrdem = [...naoVazias, ...vazias];

            // 2️⃣ Criar nova fila se a última NÃO estiver vazia
            const ultimaFila = novaOrdem[novaOrdem.length - 1];
            const jogadoresUltima = jogadores[ultimaFila] || [];

            if (jogadoresUltima.length > 0) {
                const novaFilaId = Math.max(...novaOrdem) + 1;

                if (!novaOrdem.includes(novaFilaId)) {
                    novaOrdem.push(novaFilaId);
                }
            }

            // 3️⃣ Evitar render desnecessário
            const mudou =
                novaOrdem.length !== prev.length ||
                novaOrdem.some((v, i) => v !== prev[i]);

            return mudou ? novaOrdem : prev;
        });

    }, [jogadores, ordemFilas]);
    useEffect(() => {
        setOrdemFilas(prev => garantirUnico(prev));
    }, []);


    // Função para salvar jogadores e ordemFilas no banco (sem tempo)
    async function salvarDadosNoBanco() {
        if (!user || !id) return;
        try {
            const docRef = doc(db, "usuarios", user.uid, "listas", id);
            await updateDoc(docRef, {
                jogadores,
                ordemFilas,
                equipesEmCampo,
                jogadoresNaLinha,
                emCampo,
                updatedAt: serverTimestamp(),
            });
        } catch (error) {
            console.error("Erro ao salvar dados:", error);
        }
    }

    // Salva no banco jogadores, filas e jogadoresNaLinha quando mudam
    useEffect(() => {
        if (isLoading) return;

        const timeout = setTimeout(() => {
            salvarDadosNoBanco();
        }, 500);

        return () => clearTimeout(timeout);
    }, [jogadores, ordemFilas, jogadoresNaLinha, emCampo, equipesEmCampo]);

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
            novaFila.push({ id: `${Date.now()}-${Math.random()}`, nome });


            return { ...prev, [fila]: novaFila };
        });

        setNomeJogador((prev) => ({ ...prev, [fila]: "" }));
        setTimeout(() => {
            inputRef.current[fila]?.focus();
        }, 0);
    }

    function removerJogador(fila, jogadorId) {
        setJogadores((prev) => {
            const novaFila = (prev[fila] || []).filter((j) => j.id !== jogadorId);
            return { ...prev, [fila]: novaFila };
        });
    }


    function moverFilaParaCima(fila) {
        setOrdemFilas((prev) => {
            const index = prev.indexOf(fila);
            Vibration.vibrate(100);
            if (index <= 0) return prev;
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
    //Deletar Pelada
    async function deletarPelada() {
        if (!user || !id) return;

        try {
            const docRef = doc(db, "usuarios", user.uid, "listas", id);

            await deleteDoc(docRef);

            Alert.alert("Pelada excluída", "A pelada foi deletada com sucesso.");

            router.back();
            // ou router.replace("/home") se quiser mandar pra tela principal

        } catch (error) {
            console.error("Erro ao deletar pelada:", error);
            Alert.alert("Erro", "Não foi possível deletar a pelada.");
        }
    }

    const renderFila = ({ item: fila }) => {
        const jogadoresFila = jogadores[fila] || [];
        const filaCheia = jogadoresFila.length >= jogadoresNaLinha;

        return (
            <>
                <View className="p-3 my-3">
                    <Animated.View className=" py-5 px-4 gap-1 bg-white" style={{ borderRadius: 15 }} layout={Layout.springify().duration(250)}
                    >
                        <View className="justify-between flex-row mb-5">
                            <View className="items-center justify-center">
                                <Text className="text-md" style={{ color: colors.lightdark, fontFamily: 'Poppins_700Bold' }}>
                                    {ordemFilas.indexOf(fila) != 0 ?
                                        mensagemProxima(ordemFilas.indexOf(fila) + 1)
                                        :
                                        mensagemProxima(ordemFilas.indexOf(fila) + 1)
                                    }
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
                        {jogadoresFila.map((item, i) => (
                            <JogadorItem
                                key={item.id}
                                item={item}
                                fila={fila}
                                removerJogador={removerJogador}
                            />
                        ))}


                        {!filaCheia && (
                            <View className="flex-row items-center w-full justify-between gap-2">
                                <View className="flex-1 ">
                                    <TextInput
                                        ref={(ref) => {
                                            if (ref) {
                                                inputRef.current[fila] = ref;
                                            }
                                        }}
                                        style={{ color: colors.lightdark }}
                                        className="bg-slate-50 w-full p-3 rounded-lg"
                                        placeholder="Digite o Nome do jogador"
                                        placeholderTextColor="gray"
                                        value={nomeJogador[fila] || ""}
                                        returnKeyType="done"
                                        blurOnSubmit={false}
                                        onFocus={() =>
                                            scrollToInput(
                                                { current: inputRef.current[fila] },
                                                scrollRef
                                            )
                                        }
                                        onSubmitEditing={() => adicionarJogador(fila)}
                                        onChangeText={(text) =>
                                            setNomeJogador((prev) => ({ ...prev, [fila]: text }))
                                        }
                                    />

                                </View>
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
                                            onpressProp={() => subirEquipeManual()}
                                        />
                                    </View>
                                )}
                            </View>
                        )}

                    </Animated.View>

                </View >

            </>
        );
    };

    return (
        <View className="flex-1 bg-slate-50">
            {isLoading ? (<View className="p-5 pt-8 gap-6">
                {[1, 2, 3].map((num) => (
                    <>
                        <View style={{ width: '40%', height: 30 }}>
                            <ShapeLoading />
                        </View>
                        <View style={{ width: '100%', height: 120, marginBottom: 20 }}>
                            <ShapeLoading />
                        </View>
                    </>
                ))}



            </View>) : (
                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    keyboardVerticalOffset={0}
                >

                    <ScrollView keyboardShouldPersistTaps="always"
                        contentContainerClassName=" px-8 w-full gap-5 items-center"
                        style={{ paddingVertical: 40 }}
                        ref={scrollRef}
                        contentContainerStyle={{
                            paddingBottom: keyboardHeight + 260,
                        }}

                    >


                        <View className="flex-col justify-center items-center gap-4">

                            <View className="">
                                <H1>Em Campo</H1>
                                {equipesEmCampo.every(e => !e) && (<P>Adicione os jogadores nas listas e em seguida suba 2 equipes em campo para começar.</P>)}
                            </View> ↓ 2

                            <View className="flex-row flex-wrap gap-1 ">


                                <MotiView animate={{
                                    translateX: shake ? [12, -12, 8, -8, 4, -4, 0] : direcaoAnimacao * 20,
                                    translateY: direcaoAnimacaoY * 10,
                                    scale: direcaoAnimacao != 0 ? 0.92 : 1,
                                    rotate: `${direcaoAnimacao * 10}deg`,
                                }}
                                    transition={{
                                        type: "timing",
                                        duration: shake ? 60 : 120,
                                        easing: Easing.elastic(1.5),
                                    }}
                                    onDidAnimate={(key) => {
                                        if (key === 'translateX' && shake) {
                                            setShake(false);

                                        }
                                    }}
                                    className="flex-1 rounded-xl "
                                >


                                    <ImageBackground source={require("../../../assets/images/PeladappBackground1.jpg")} resizeMode="cover" imageStyle={{ borderRadius: 10 }} className="flex-1 gap-4 items-center justify-center flex-row relative p-3 py-6"  >
                                        <Feather name="x" size={24} color="white" style={{ position: "absolute" }} />
                                        {equipesEmCampo.map((id, index) => {
                                            const jogadoresEquipe = jogadores[id] || [];

                                            return (


                                                <View className="flex-1 gap-4">
                                                    <View className="flex-row justify-center items-center gap-2 absolute mx-auto" style={{ top: -20, left: index == 0 ? 0 : 'auto', right: index != 0 ? 0 : 'auto' }}>

                                                        {jogadoresEquipe.length > 1 &&
                                                            <TouchableOpacity
                                                                delayLongPress={1000}

                                                                onPressIn={() => {
                                                                    longPressAtivado.current = false;
                                                                    setDirecaoAnimacao(index == 0 ? -1 : 1);
                                                                    setDirecaoAnimacaoY(-1);
                                                                }}

                                                                onPressOut={() => {
                                                                    if (!longPressAtivado.current) {
                                                                        Vibration.vibrate(200);
                                                                        setShake(true);
                                                                        setDirecaoAnimacao(0);
                                                                        setDirecaoAnimacaoY(0);
                                                                        showToast("Segure para retirar a equipe do campo");
                                                                    }
                                                                }}

                                                                onLongPress={() => {
                                                                    longPressAtivado.current = true;

                                                                    handlePerdeu(id);

                                                                    // força reset imediato
                                                                    setDirecaoAnimacao(0);
                                                                    setDirecaoAnimacaoY(0);
                                                                    showToast("Equipe em campo voltou para a fila");
                                                                }}
                                                                className="mt-2 p-1 px-2 rounded-xl items-center justify-center gap-1"
                                                                style={{ flexDirection: index == 0 ? 'row' : 'row-reverse', backgroundColor: colors.lightdark }}
                                                            >
                                                                <Feather name={index == 0 ? "arrow-left" : "arrow-right"} size={16} color="white" />
                                                                <Feather name="" size={16} color="red" style={{ backgroundColor: "red" }} />
                                                                <View className="bg-red-500 flex-1 rounded" style={{ height: 14, maxWidth: 10 }} />
                                                                <Span colorWhite={true}>Perdeu</Span>
                                                            </TouchableOpacity>
                                                        }
                                                    </View>
                                                    <View key={`campo-${id ?? "vazio"}-${index}`} className="flex-1 rounded-xl my-2" >

                                                        <View className="flex-col items-center justify-center gap-1 flex-1 p-4">

                                                            {jogadoresEquipe.map(j => jogadoresEquipe.length > 0 ? (

                                                                <P2 colorWhite={true} key={j.id}>{j.nome}</P2>

                                                            ) : (<P colorWhite={true}>...aaa</P>))}
                                                        </View>
                                                        <View className=" flex-1 gap-2" style={{ marginBottom: 20 }}>

                                                            {jogadoresEquipe.length < 1 &&
                                                                <View className=" gap-2 p-2 flex-1">
                                                                    <TouchableOpacity
                                                                        onPress={() => handlePerdeu(id)}
                                                                        className=" p-2 rounded items-center justify-center  mx-auto" style={{ backgroundColor: colors.primaryalt }}
                                                                    >
                                                                        <View className="flex-row">
                                                                            <Feather name="user-plus" size={16} color="white" />
                                                                            <Feather name="arrow-up" size={16} color="white" />

                                                                        </View>
                                                                        <Span colorWhite={true}>Subir Equipe</Span>
                                                                    </TouchableOpacity>
                                                                </View>
                                                            }
                                                        </View>

                                                    </View>
                                                </View>

                                            );
                                        })}
                                    </ImageBackground>
                                </MotiView>
                            </View>
                        </View>
                        {ordemFilas.map((item) => (
                            <View key={item.toString()} className=" w-full">
                                {renderFila({ item })}
                            </View>
                        ))}

                        <View className="justify-center items-center mx-auto mt-16 px-6">
                            <Text className="text-center">Fim da Lista, adicione um nome nas equipes completamente vazias para criar uma nova equipe.</Text>

                            <View className="flex-row justify-center pt-5">
                                <Botao2 cta="Excluir Pelada" type={3} onpress={() =>
                                    Alert.alert(
                                        "Excluir Pelada",
                                        "Tem certeza que deseja excluir essa pelada? Essa ação não pode ser desfeita.",
                                        [
                                            {
                                                text: "Cancelar",
                                                style: "cancel",
                                            },
                                            {
                                                text: "Excluir",
                                                style: "destructive",
                                                onPress: () => deletarPelada(),
                                            },
                                        ]
                                    )} />
                            </View>
                        </View>

                    </ScrollView>
                </KeyboardAvoidingView >
            )
            }

        </View >
    );
}

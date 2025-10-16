import { Ionicons } from "@expo/vector-icons";
import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../../components/ui/colors";
import { useLocalSearchParams } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "../../src/firebaseConnection";

const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60)
        .toString()
        .padStart(2, "0");
    const seconds = (totalSeconds % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
};
export default function Partida() {
    const { id } = useLocalSearchParams(); // Pega o ID da lista pela URL
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Estados para os dados da partida
    const [equipesEmCampo, setEquipesEmCampo] = useState([]);

    const [proximasEquipes, setProximasEquipes] = useState([]);
    const [config, setConfig] = useState({ tempoPartida: 7 });

    const [cronometroRodando, setCronometroRodando] = useState(false);
    const [tempoRestante, setTempoRestante] = useState(config.tempoPartida * 60);

    // Autenticação do usuário
    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, (usr) => setUser(usr));
        return unsubscribeAuth;
    }, []);

    // Busca e escuta os dados da lista no Firestore
    useEffect(() => {
        // Só prossegue se tivermos o usuário e o ID da partida
        if (!user || !id) {
            // Se um deles ainda não chegou, não faz nada e espera a próxima renderização
            return;
        }

        const listaId = Array.isArray(id) ? id[0] : id; // Garante que o ID seja uma string

        if (!listaId) {
            // Se o ID for inválido, para o loading
            setLoading(false);
            Alert.alert("Erro", "ID da partida não encontrado.");
            return;
        }

        const docRef = doc(db, "usuarios", user.uid, "listas", listaId);

        const unsubscribe = onSnapshot(
            docRef,
            (snap) => {
                if (snap.exists()) {
                    const dados = snap.data();
                    const tempoPartidaEmMinutos = dados.cronometro || 7;

                    setConfig({ tempoPartida: tempoPartidaEmMinutos });
                    // Só atualiza o tempo se o cronômetro não estiver rodando
                    if (!cronometroRodando) setTempoRestante(tempoPartidaEmMinutos * 60);

                    const jogadoresPorEquipe = dados.jogadores || {};
                    const ordemDasFilas = dados.ordemFilas || [];

                    // As 2 primeiras equipes da fila estão "em campo"
                    const idsEquipesEmCampo = ordemDasFilas.slice(0, 2);
                    const emCampo = idsEquipesEmCampo.map((numFila) => ({
                        id: numFila,
                        nome: `Equipe ${numFila}`,
                        jogadores: jogadoresPorEquipe[numFila] || [],
                    }));
                    setEquipesEmCampo(emCampo);

                    // O restante da fila são as "próximas"
                    const idsProximasEquipes = ordemDasFilas.slice(2);
                    const proximas = idsProximasEquipes.map((numFila) => ({
                        id: numFila,
                        nome: `Equipe ${numFila}`,
                    }));
                    setProximasEquipes(proximas);
                } else {
                    // Documento não existe, podemos parar o loading e talvez mostrar um erro
                    Alert.alert("Erro", "Não foi possível encontrar os dados desta partida.");
                }
                // Garante que o loading seja desativado após a primeira busca (sucesso ou falha)
                setLoading(false);
            },
            (error) => {
                // Lida com erros de permissão ou outros problemas do Firestore
                console.error("Erro ao buscar dados da partida:", error);
                Alert.alert("Erro de Conexão", "Não foi possível carregar os dados da partida.");
                setLoading(false);
            }
        );

        return () => unsubscribe(); // Limpa o listener ao desmontar o componente
    }, [user, id]);

    const renderEquipe = (equipe, corFundo) => (
        <View className="w-1/2 rounded-lg border-2 border-slate-200 overflow-hidden">
            <View className={`p-3 ${corFundo}`}>
                <Text className="text-white font-bold text-lg text-center">{equipe.nome}</Text>
            </View>
            <View className="bg-white">
                <FlatList
                    data={equipe.jogadores}
                    keyExtractor={(j) => j.id}
                    renderItem={({ item, index }) => (
                        <View className={`flex-row justify-center items-center p-2 ${index % 2 === 0 ? "bg-slate-50" : "bg-white"}`}>
                            <Text className="text-base">{item.nome}</Text>
                        </View>
                    )}
                    ListEmptyComponent={<Text className="text-center p-2 text-gray-500">Sem jogadores</Text>}
                />
            </View>
        </View>
    );

    if (loading) {
        return (
            <SafeAreaView className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color={colors.green} />
                <Text>Carregando dados da partida...</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View className="flex-1 justify-between items-center p-6 pb-28">
                <View className="w-full justify-center items-center">
                    <View>
                        <Text style={{ fontSize: 50, fontWeight: "bold" }}>{formatTime(tempoRestante)}</Text>
                    </View>
                    <View className="justify-between  items-center flex-row w-56">
                        <TouchableOpacity className="bg-slate-200 border-2 border-slate-300 rounded-full p-1" onPress={() => {}}>
                            <Ionicons name="time-outline" size={28} color="#333333" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setCronometroRodando(!cronometroRodando)} className="">
                            <Ionicons name={cronometroRodando ? "pause" : "play"} size={50} color={colors.green} />
                        </TouchableOpacity>
                        <TouchableOpacity className="bg-slate-200 border-2 border-slate-300 rounded-full p-1" onPress={() => {}}>
                            <Ionicons name="refresh-outline" size={28} color="#333333" />
                        </TouchableOpacity>
                    </View>
                </View>
                <View className="flex-row justify-center items-start gap-4 w-full">
                    {equipesEmCampo[0] ? renderEquipe(equipesEmCampo[0], "bg-blue-500") : <View className="w-1/2" />}
                    {equipesEmCampo[1] ? renderEquipe(equipesEmCampo[1], "bg-red-500") : <View className="w-1/2" />}
                </View>
                <View>
                    <Text className="text-lg font-bold">Próximas equipes:</Text>
                    {proximasEquipes.length > 0 ? proximasEquipes.map((eq) => <Text key={eq.id}>{eq.nome}</Text>) : <Text>Nenhuma equipe na fila.</Text>}
                </View>
            </View>
        </SafeAreaView>
    );
}

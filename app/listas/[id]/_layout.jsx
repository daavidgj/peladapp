import { Tabs, Stack, useLocalSearchParams } from "expo-router";
import { colors } from "../../../components/ui/colors";
import { useState, useEffect, useRef } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../../../src/firebaseConnection";

export default function TabsLayout() {

    const [user, setUser] = useState(null);
    const { id } = useLocalSearchParams();

    const [tempo, setTempo] = useState(0);
    const [rodando, setRodando] = useState(false);

    const [nomeJogador, setNomeJogador] = useState({});
    const [jogadores, setJogadores] = useState({});
    const [jogadoresNaLinha, setJogadoresNaLinha] = useState(4);
    const [ordemFilas, setOrdemFilas] = useState([1, 2, 3]);
    const [emCampo, setEmCampo] = useState(false);
    const [nomePelada, setNomePelada] = useState("11");
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
                    console.log("Dados:", dados);
                    setJogadoresNaLinha(dados.jogadoresNaLinha || 4);
                    setTempo(dados.tempoPartida || 7); // pega tempo inicial do banco
                    setJogadores(dados.jogadores || {});
                    setOrdemFilas(dados.ordemFilas || [1, 2, 3]);
                    setEmCampo(dados.emCampo || false);
                    setNomePelada(dados.nome || "");
                    console.log("Nome:", dados.nome);
                }
            }
        }
        buscarDadosIniciais();
    }, [user, id]);
    return (

        <Stack
            screenOptions={{
                headerStyle: { backgroundColor: colors.primaryalt },
                headerTintColor: "#ffffff",
                headerShown: false,
            }}
        >

            <Stack.Screen name="index" options={{ headerTitle: nomePelada }} />
            <Stack.Screen name="cronometro" options={{ headerTitle: 'Cronometro' }} />
        </Stack>
    );
}

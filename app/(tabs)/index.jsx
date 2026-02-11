import { View, Text, TouchableOpacity, FlatList, Alert, Pressable, Image, ImageBackground } from "react-native";
import { useEffect, useState } from "react";

import { auth, db } from "../../src/firebaseConnection";
import { collection, addDoc, onSnapshot } from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { colors } from "../../components/ui/colors";
import { st } from "../../components/ui/myStyles";
import { router } from "expo-router";
import { Header } from "../../components/tags/header";
import Divider from "../../components/secundario/divider";
import Botao2 from "../../components/secundario/botao2";
import { Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { MotiView } from "moti";
import ShapeLoading from "../../components/secundario/shapeLoading";
import { H1, H2, P, A, Span } from "../../components/tipografy";
export default function ListagemListas() {
    const [listas, setListas] = useState([]);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, (userAtual) => {
            console.log("Verificando login...");
            if (userAtual) {
                console.log("Usuário logado:", userAtual.uid);
                setUser(userAtual);
            } else {
                console.log("Usuário deslogado");
                router.push("../login");
            }
        });

        return () => unsubscribeAuth();
    }, []);

    useEffect(() => {
        if (!user) return;

        console.log("Escutando listas do usuário:", user.uid);
        const unsub = onSnapshot(collection(db, "usuarios", user.uid, "listas"), (snapshot) => {
            const dados = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            console.log("Listas atualizadas:", dados);
            setListas(dados);
            setIsLoading(false);
        });

        return () => unsub();
    }, [user]);


    {
        return isLoading ? (
            <View className="flex-1 gap-5" style={{ paddingTop: 120, paddingLeft: 20 }}>
                <View style={{ width: 140, height: 30 }}>
                    <ShapeLoading />
                </View>
                <View className="gap-5 flex-row h-32">
                    <FlatList
                        data={[1, 2, 3]}
                        contentContainerStyle={{ gap: 20 }}
                        showsHorizontalScrollIndicator={false}
                        horizontal={true}
                        renderItem={() => (
                            <View className="w-32">
                                <ShapeLoading />
                            </View>
                        )}
                    />
                </View>
                <View style={{ width: "90%", height: "120", marginTop: 20 }}>
                    <ShapeLoading />
                </View>
                <View style={{ width: "90%", height: "120" }}>
                    <ShapeLoading />
                </View>
                <View style={{ width: "90%", height: "60" }}>
                    <ShapeLoading />
                </View>
            </View>
        ) : (
            <View style={st.container}>
                <Header titulo="Peladas" descricao="Listas da sua pelada" />
                <View className="flex-1 justify-start px-6 pt-2 gap-12">
                    <View className="gap-3">

                        <View>
                            <H2 >Peladas Cadastradas:</H2>
                        </View>
                        <View style={{ flexDirection: "row", marginHorizontal: "-20" }}>
                            <FlatList
                                data={listas}
                                contentContainerStyle={{ gap: 20, paddingHorizontal: 20 }}
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}
                                keyExtractor={(item) => item.id}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        className="bg-white p-5 px-8 rounded-lg border-2 border-slate-100 gap-2"
                                        onPress={() => router.push(`../listas/${item.id}`)}
                                    >
                                        <View className="flex-row gap-2 items-center">
                                            <Feather name="map-pin" size={14} color="gray" />
                                            <Text className="text-md">{item.nome}</Text>
                                        </View>
                                        <Divider />
                                        <View className="flex-row gap-2 items-center">
                                            <Feather name="users" size={14} color="gray" />
                                            <Text className="text-md">{item.jogadoresNaLinha} na Linha</Text>
                                        </View>
                                        <Divider />
                                        <View className="flex-row gap-2 items-center">
                                            <Feather name="clock" size={14} color="gray" />
                                            <Text className="text-md">{item.cronometro} min</Text>
                                        </View>
                                        <Botao2 cta="Entrar" onpress={() => router.push(`../listas/${item.id}`)} />
                                    </TouchableOpacity>
                                )}
                                ListEmptyComponent={<Text style={st.vazio}>Nenhuma lista ainda.</Text>}
                            />
                        </View>
                    </View>
                    <View className="flex-row w-full gap-2 items-center bg-slate-200 rounded-lg">

                        <View className="flex-1 justify-center items-center" >
                            <Image source={require("../../assets/images/Peladapp Player 3d 012.png")} className="h-48" style={{ resizeMode: 'contain' }} />
                        </View>
                        <View className="flex-col w-60 p-4">
                            <H2>Crie uma Lista</H2>
                            <Span>Comece a organizar sua pelada com facilidade em poucos cliques</Span>
                            <View className="w-36">
                                <Botao2 cta="Criar Lista" onpress={() => router.push(`../cadastro`)} />

                            </View>
                        </View>
                    </View>
                </View>
            </View>
        );
    }
}

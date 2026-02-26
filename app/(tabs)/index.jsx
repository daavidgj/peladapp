import { View, Text, TouchableOpacity, FlatList, Alert, Pressable, Image, ImageBackground, Touchable } from "react-native";
import { useEffect, useState } from "react";

import { auth, db } from "../../src/firebaseConnection";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";


import { onAuthStateChanged, signOut } from "firebase/auth";
import { colors } from "../../components/ui/colors";
import { st } from "../../components/ui/myStyles";
import { router } from "expo-router";
import { Header } from "../../components/tags/header";
import Divider from "../../components/secundario/divider";
import Botao2 from "../../components/secundario/botao2";
import { Feather } from "@expo/vector-icons";
import ShapeLoading from "../../components/secundario/shapeLoading";
import { H1, H2, P, A, Span } from "../../components/tipografy";
import PagerView from "react-native-pager-view";
import { showToast } from "../../components/functions/toast";

export default function ListagemListas() {
    const [listas, setListas] = useState([]);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const buscarDadosIniciais = onAuthStateChanged(auth, (userAtual) => {
            if (userAtual) {
                console.log("Usuário logado:", userAtual.uid);
                setUser(userAtual);
            }
        });

        return () => buscarDadosIniciais();
    }, []);

    useEffect(() => {
        if (!user) return;

        console.log("Escutando listas do usuário:", user.uid);
        const q = query(
            collection(db, "usuarios", user.uid, "listas"),
            orderBy("updatedAt", "desc")
        );

        const unsub = onSnapshot(q, (snapshot) => {

            const dados = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            //console.log("Listas atualizadas:", dados);
            setListas(dados);
            setIsLoading(false);
        });

        return () => unsub();
    }, [user]);


    {
        return isLoading ? (
            <View className="flex-1 gap-5" style={{ paddingTop: 60, paddingLeft: 20 }}>
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
            <View className="flex-1 justify-center items-center bg-slate-50">
                <View className="flex-1 justify-start px-6 pt-10 gap-12">
                    <View className="gap-3">

                        <View>
                            <H1 >Peladas Cadastradas:</H1>

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
                                        className="bg-white  p-5 px-8 rounded-lg  gap-2"
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
                                ListEmptyComponent={<Text style={st.vazio}>Nenhuma lista cadastrada ainda.</Text>}
                            />
                        </View>
                    </View>
                    <PagerView
                        style={{ height: 200, marginHorizontal: "-21" }}


                        initialPage={0}



                    >

                        <View
                            key="1"
                            style={{ justifyContent: "center", alignItems: "center", backgroundColor: "#0f0", borderRadius: 10, overflow: 'hidden', marginHorizontal: "21" }}
                        >
                            <ImageBackground source={require("../../assets/images/PeladappBackground1.jpg")} resizeMode="cover" className=" flex-row flex-1 gap-2 items-center"  >
                                <View className="flex-col w-56 p-4">
                                    <H2 colorWhite={true}>Crie uma Lista</H2>
                                    <Span colorWhite={true}>Comece a organizar sua pelada com facilidade em poucos cliques</Span>
                                    <View className="w-36">
                                        <Botao2 cta="Criar Lista" onpress={() => router.push(`../cadastro`)} />

                                    </View>
                                </View>

                                <View className="flex-1 justify-center items-center px-10  " >
                                    <Image source={require("../../assets/images/Peladapp Player 3d 013.png")} className="flex-1" style={{ resizeMode: 'contain' }} />
                                </View>
                            </ImageBackground>
                        </View>

                        <View
                            key="2"
                            style={{ justifyContent: "center", alignItems: "center", backgroundColor: "#0f0", borderRadius: 10, overflow: 'hidden', marginHorizontal: "21" }}
                        >
                            <ImageBackground source={require("../../assets/images/PeladappBackground1.jpg")} resizeMode="cover" className="p-10 flex-row flex-1 gap-2 items-center justify-center"  >

                                <View className=" flex-1 items-center justify-center " >
                                    <Image source={require("../../assets/images/peladaapplogo.png")} className="flex-1" style={{ resizeMode: 'contain' }} />
                                </View>
                                <View className="flex-col w-56 pl-8">
                                    <H2 colorWhite={true}>Avalie nosso App</H2>
                                    <Span colorWhite={true}>Nos ajude a tornar o aplicativo melhor.</Span>

                                </View>
                            </ImageBackground>
                        </View>
                        <View
                            key="3"
                            style={{ justifyContent: "center", alignItems: "center", backgroundColor: "#0f0", borderRadius: 10, overflow: 'hidden', marginHorizontal: "21" }}
                        >
                            <ImageBackground source={require("../../assets/images/PeladappBackground1.jpg")} resizeMode="cover" className=" flex-row flex-1 gap-2 items-center"  >

                                <View className="flex-1 justify-center items-center px-10 justify-center " >
                                    <Image source={require("../../assets/images/Peladapp Player 3d 012.png")} className="flex-1" style={{ resizeMode: 'contain' }} />
                                </View>
                                <View className="flex-col w-60 p-4 pl-10 justify-center">
                                    <H2 colorWhite={true}>Editar Dados</H2>
                                    <Span colorWhite={true}>Edita seu nome, email e senha aqui.</Span>
                                    <View className="w-36">
                                        <Botao2 cta="Editar" onpress={() => router.push(`../settings`)} />

                                    </View>
                                </View>
                            </ImageBackground>
                        </View>
                    </PagerView>
                    <View className="flex-row w-full rounded-lg overflow-hidden">

                    </View>
                </View >
            </View >
        );
    }
}

import React, { useState } from "react";
import { Header } from "../../components/tags/header";
import { addDoc, collection } from "firebase/firestore";
import { View, Text, Pressable, Image, Alert, TextInput, ImageBackground } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "../../src/firebaseConnection"; // ajuste se necessário
import { Link, router } from "expo-router";
import { st } from "../../components/ui/myStyles";
import MyInputText from "../../components/secundario/myInputText";
import Botao1 from "../../components/secundario/botao1";
import Botao2 from "../../components/secundario/botao2";
import { Feather } from "@expo/vector-icons";
import MyInput from "../../components/secundario/myInput";
import { H1, H2, P, A, Span } from "../../components/tipografy";
import { colors } from "../../components/ui/colors";


export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    function sigIn() {
        signInWithEmailAndPassword(auth, email, password)
            .then(({ user }) => {
                alert("Sucesso", "Usuário Logado");
                console.log("Logou e Redirecionou");
                router.replace("/"); // Redirecionar corretamente
            })
            .catch((err) => Alert.alert("Erro", err.code + "\n" + err.message));
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View className="flex-1 justify-center items-center">
                <ImageBackground source={require("../../assets/images/PeladappBackground1.jpg")} resizeMode="cover" style={{ height: 240, width: '100%', marginBottom: '-10', justifyContent: 'flex-end', alignItems: 'center' }}  >
                    <Image source={require("../../assets/images/Peladapp Player 3d 011.png")} className="h-64" style={{ resizeMode: 'contain' }} />

                </ImageBackground>

                <View className="bg-white flex-1 px-10 py-12 w-full gap-5 items-center" style={{ borderTopLeftRadius: 25, borderTopRightRadius: 25 }}>
                    <View className="gap-3 items-center">
                        <H1>FAÇA O LOGIN</H1>
                        <P>Para acessar a tela de listas da sua pelada</P>
                    </View>
                    <MyInput icon="mail" placeholder="Digite o email" value={email} onChangeText={setEmail} keyboardType="email-address" />

                    <MyInput icon="lock" placeholder="Digite a Senha" value={password} onChangeText={setPassword} senha={1} />
                    <View className="w-full items-center py-5 ">
                        <Botao1 cta="Entrar" onpressProp={sigIn} />
                    </View>
                    <View className="flex-row ">
                        <Span>Não possui uma conta? </Span>
                        <Pressable onPress={() => router.push("../login/cadastro")} >
                            <Span><A style={{ color: colors.primaryalt }}>Cadastre-se!</A></Span>

                        </Pressable>
                    </View>
                </View>

            </View>
        </SafeAreaView>
    );
}

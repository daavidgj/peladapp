import React, { useState } from "react";
import { Header } from "../../components/tags/header";
import { addDoc, collection } from "firebase/firestore";
import { View, Text, TextInput, Button, Alert, ImageBackground, Image, Pressable } from "react-native";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { router } from "expo-router";
import { colors } from "../../components/ui/colors";
import { st } from "../../components/ui/myStyles";
import { auth, db } from "../../src/firebaseConnection";
import MyInputText from "../../components/secundario/myInputText";
import Botao1 from "../../components/secundario/botao1";
import Botao2 from "../../components/secundario/botao2";
import { SafeAreaView } from "react-native-safe-area-context";
import MyInput from "../../components/secundario/myInput";

import { H1, H2, P, A, Span } from "../../components/tipografy";

export default function Cadastro() {
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");




    // Função de cadastro
    function signUp() {

        if (nome.trim().length < 3) {
            Alert.alert("Erro", "Informe um nome válido.");
            return;
        }
        if (password.length < 6) {
            Alert.alert("Erro", "A senha deve ter pelo menos 6 caracteres.");
            return;
        }

        createUserWithEmailAndPassword(auth, email, password)
            .then(async ({ user }) => {
                await addDoc(collection(db, "usuarios"), {
                    uid: user.uid,
                    email,
                });
                updateProfile(user, {
                    displayName: nome,
                });
                Alert.alert("Sucesso", "Usuário cadastrado com sucesso!");
                router.back();
            })
            .catch((err) => {
                if (err.code === "auth/invalid-email") {
                    Alert.alert("E-mail inválido", "Por favor, insira um e-mail válido.");
                    return;
                }
                if (err.code === "auth/email-already-in-use") {
                    Alert.alert("E-mail em uso", "Este e-mail já está cadastrado.");
                    return;
                }
                Alert.alert("Erro inesperado", err.message);
            });
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>

            <View className="flex-1 justify-center items-center">

                <ImageBackground source={require("../../assets/images/PeladappBackground1.jpg")} resizeMode="cover" style={{ height: 240, width: '100%', marginBottom: '-10', justifyContent: 'flex-end', alignItems: 'center' }}  >
                    <Image source={require("../../assets/images/Peladapp Player 3d 012.png")} className="h-64" style={{ resizeMode: 'contain' }} />

                </ImageBackground>
                <View className="bg-white flex-1 px-10 py-12 w-full gap-5 items-center" style={{ borderTopLeftRadius: 25, borderTopRightRadius: 25 }}>
                    <View className="justify-center items-center">
                        <H1>Cadastro</H1>
                        <P> Para continuar, informe seus dados:</P>
                    </View>
                    <View className="bg-white rounded-lg  w-full gap-5">


                        <MyInput icon="user" placeholder="Digite o nome" value={nome} onChangeText={setNome} keyboardType="default" />
                        <MyInput icon="mail" placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
                        <MyInput icon="lock" placeholder="Senha" value={password} onChangeText={setPassword} senha={true} />





                    </View>

                    <View className="justify-between w-full items-center">
                        <View className="w-full flex-col justify-center gap-5 items-center" style={{ paddingTop: 8 }}>

                            <Botao1 cta="Cadastrar" onpressProp={signUp} />

                            <View className="flex-row ">
                                <Span>Já possui uma conta? </Span>
                                <Pressable onPress={() => router.back()} >
                                    <Span><A style={{ color: colors.primaryalt }}>Fazer Login</A></Span>

                                </Pressable>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}

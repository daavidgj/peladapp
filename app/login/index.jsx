import React, { useState } from "react";
import { Header } from "../../components/tags/header";
import { addDoc, collection } from "firebase/firestore";
import { View, Text, Pressable, Image,Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "../../src/firebaseConnection"; // ajuste se necessário
import { Link, router } from "expo-router";
import { st } from "../../components/ui/myStyles";
import MyInputText from "../../components/secundario/myInputText";
import Botao1 from "../../components/secundario/botao1";
import Botao2 from "../../components/secundario/botao2";

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
            <View className="flex-1 justify-center items-center p-6">
                <Image source={require("../../assets/images/peladaapplogo.png")} className="h-36 w-36" style={{ marginTop: "-30" }} />
                <View className="bg-white rounded-lg flex px-5 py-12 w-full gap-5 " style={{ marginTop: 0 }}>
                    <View className="gap-3 items-center">
                        <Text className="text-xl font-bold">FAÇA O LOGIN</Text>
                        <Text>Para acessar a tela de listas da sua pelada</Text>
                    </View>
                    <View>
                        <MyInputText titulo="E-mail" placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
                    </View>
                    <View>
                        <MyInputText titulo="Senha" placeholder="Senha" value={password} onChangeText={setPassword} />
                    </View>
                </View>
                <View className="w-full items-center py-5 ">
                    <Botao1 cta="Entrar" onpressProp={sigIn} />
                </View>
                <View className="">
                    <Botao2 cta="Cadastrar" onpress={() => router.push("../login/cadastro")} type={2} />
                </View>
            </View>
        </SafeAreaView>
    );
}

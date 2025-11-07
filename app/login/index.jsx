import React, { useState } from "react";
import { Header } from "../../components/tags/header";
import { addDoc, collection } from "firebase/firestore";
import { View, Text, Pressable, Image, Alert, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "../../src/firebaseConnection"; // ajuste se necessário
import { Link, router } from "expo-router";
import { st } from "../../components/ui/myStyles";
import MyInputText from "../../components/secundario/myInputText";
import Botao1 from "../../components/secundario/botao1";
import Botao2 from "../../components/secundario/botao2";
import { Feather } from "@expo/vector-icons";

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
            <View className="flex-1 justify-center items-center bg-green-300">
                <View style={{ height: 240 }} className="justify-center items-center">
                    <Image source={require("../../assets/images/peladaapplogo.png")} className="h-36 w-36" />

                </View>
                <View className="bg-white flex-1 px-10 py-12 w-full gap-5 " style={{ borderTopLeftRadius: 25, borderTopRightRadius: 25 }}>
                    <View className="gap-3 items-center">
                        <Text className="text-xl font-bold">FAÇA O LOGIN</Text>
                        <Text>Para acessar a tela de listas da sua pelada</Text>
                    </View>
                    <View className="bg-slate-100 rounded-full py-2 px-6 flex-row gap-2  items-center border border-slate-200">
                        <Feather name='user' color='#b8b8b8' size={24}></Feather>
                        <TextInput className="flex-1" placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
                    </View>
                    <View className="bg-slate-100 rounded-full py-2 px-6 flex-row gap-2  items-center border border-slate-200">
                        <Feather name='lock' color='#b8b8b8' size={24}></Feather>
                        <TextInput className="flex-1" placeholder="Senha" value={password} onChangeText={setPassword} />
                    </View>
                    <View className="w-full items-center py-5 ">
                        <Botao1 cta="Entrar" onpressProp={sigIn} />
                    </View>
                    <View className="">
                        <Botao2 cta="Cadastrar" onpress={() => router.push("../login/cadastro")} type={2} />
                    </View>
                </View>

            </View>
        </SafeAreaView>
    );
}

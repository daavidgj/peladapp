import React, { useState, useRef, useContext } from "react";
import { Header } from "../../components/tags/header";
import { addDoc, collection } from "firebase/firestore";
import { View, Text, TextInput, Button, Alert, ImageBackground, Image, Pressable, Keyboard, KeyboardAvoidingView, Platform } from 'react-native';
import { ScrollView } from 'react-native';
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
import Start from "../../components/tags/Start";
import { ActivityIndicator } from "react-native";
import { showToast } from "../../components/functions/toast";
import { ShapeLoading } from "../../components/secundario/shapeLoading";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import scrollToInput from "../../components/functions/scrollDirection";
import useKeyboard from "../../components/functions/keyboardContext";
import Animated from "react-native-reanimated";
import { Layout } from "react-native-reanimated";




export default function Cadastro() {
    const { keyboardVisible, keyboardHeight } = useKeyboard();
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const scrollRef = useRef(null);

    const nomeRef = useRef(null);
    const emailRef = useRef(null);
    const senhaRef = useRef(null);





    // Função de cadastro
    async function signUp() {

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
                setLoading(true);
                await addDoc(collection(db, "usuarios"), {
                    uid: user.uid,
                    email,
                });
                updateProfile(user, {
                    displayName: nome,
                });
                setLoading(false);
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
            })
    }

    return loading ? (

        <View className="flex-1">


            <Start typePlayer={1} />

            <View className="bg-slate-50 flex-1 px-10 py-12 w-full gap-5 items-center" style={{ borderTopLeftRadius: 25, borderTopRightRadius: 25 }}>
                <View className="justify-center items-center">
                    <H1>Cadastro</H1>
                    <P> Para continuar, informe seus dados:</P>
                </View>
                <View style={{ width: "90%", height: 60, marginTop: 60 }}>
                    <ActivityIndicator size={120} color={colors.primaryalt} />

                </View>
            </View>
        </View>
    ) : (
        <View style={{ flex: 1 }}>
            <Start typePlayer={1} />


            <View
                className="bg-white flex-1"
                style={{ borderTopLeftRadius: 25, borderTopRightRadius: 25 }}
            >

                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    keyboardVerticalOffset={0}
                >

                    <ScrollView keyboardShouldPersistTaps="handled"
                        contentContainerClassName=" px-10  w-full gap-5 items-center "
                        style={{ paddingVertical: 40 }}
                        ref={scrollRef}
                        contentContainerStyle={{
                            paddingBottom: keyboardHeight + 60,
                        }}

                    >


                        <View className="justify-center items-center">
                            <H1>Cadastro</H1>
                            <P> Para continuar, informe seus dados:</P>
                        </View>

                        <View className="bg-white rounded-lg w-full gap-5">
                            <MyInput
                                icon={1}
                                placeholder="Digite o nome"
                                value={nome}
                                onChangeText={setNome}

                                ref={nomeRef}
                                onFocus={() => scrollToInput(nomeRef, scrollRef)}
                                onSubmitEditing={() => emailRef.current.focus()}
                            />

                            <MyInput
                                icon={2}
                                placeholder="Digite o email"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                ref={emailRef}
                                onFocus={() => scrollToInput(emailRef, scrollRef)}
                                onSubmitEditing={() => senhaRef.current.focus()}
                            />

                            <MyInput
                                icon={3}
                                placeholder="Digite a senha"
                                value={password}
                                onChangeText={setPassword}
                                senha={1}
                                ref={senhaRef}
                                returnKeyType="done"

                                onFocus={() => scrollToInput(senhaRef, scrollRef)}
                                onSubmitEditing={() => Keyboard.dismiss()}
                            />
                        </View>

                        <Botao1 cta="Cadastrar" onpressProp={signUp} />
                        <View className="flex-row "> <Span>Já possui uma conta? </Span> <Pressable onPress={() => router.back()} > <A>Fazer Login</A> </Pressable> </View>

                    </ScrollView>

                </KeyboardAvoidingView>
            </View>
        </View>
    );
}

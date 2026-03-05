import React, { useState, useRef } from "react";
import { View, Text, Pressable, Alert, Keyboard, KeyboardAvoidingView, Platform } from "react-native";
import { ScrollView } from 'react-native';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "../../src/firebaseConnection"; // ajuste se necessário
import { Link, router } from "expo-router";
import Botao1 from "../../components/secundario/botao1";
import MyInput from "../../components/secundario/myInput";
import { H1, H2, P, A, Span } from "../../components/tipografy";
import { colors } from "../../components/ui/colors";
import Start from "../../components/tags/Start";
import useKeyboard from "../../components/functions/keyboardContext";
import scrollToInput from "../../components/functions/scrollDirection";
import { ActivityIndicator } from "react-native";
import Schema from "../../components/functions/schema";


export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailValido, setEmailValido] = useState(false);
    const [senhaValido, setSenhaValido] = useState(false);
    const [loading, setLoading] = useState(false);

    const emailRef = useRef(null);
    const senhaRef = useRef(null);
    const { keyboardVisible, keyboardHeight } = useKeyboard();
    const scrollRef = useRef(null);
    const [errorMessage, setErrorMessage] = useState();




    async function sigIn() {
        setLoading(true);
        await Schema
            .pick(["email", "senha"])
            .validate(
                { email, senha: password },
                { abortEarly: false }
            );
        if (!emailValido || !senhaValido) {
            setLoading(false);
            return;
        }
        signInWithEmailAndPassword(auth, email, password)

            .then(({ user }) => {
                console.log("Logou e Redirecionou");
                router.replace("/"); // Redirecionar corretamente

            }).catch((err) => {
                Alert.alert("Erro", err.code + "\n" + err.message);
                setErrorMessage(err.message);
                console.log('error', err.message);


                setLoading(false);
            });
    }

    return loading ? (


        <View className="flex-1 justify-center items-center">


            <Start typePlayer={3} />

            <View className="bg-slate-50 flex-1 w-full" style={{ borderTopLeftRadius: 25, borderTopRightRadius: 25 }}>
                <View className=" px-10  w-full gap-5 items-center">

                    <View className="justify-center items-center py-12">
                        <H1>FAÇA O LOGIN</H1>
                        <P> Para acessar a tela de listas </P>
                    </View>
                    <View style={{ width: "90%", height: 60, marginTop: 60 }}>
                        <ActivityIndicator size={120} color={colors.primaryalt} />

                    </View>
                </View>
            </View>
        </View>
    ) : (


        <View className="flex-1 justify-center items-center">
            <Start typePlayer={3} />

            <View className="bg-slate-50 flex-1" style={{ borderTopLeftRadius: 25, borderTopRightRadius: 25 }}>
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
                            <H1>FAÇA O LOGIN</H1>
                            <P>Para acessar a tela de listas </P>
                        </View>
                        <MyInput
                            icon={2} // mail
                            placeholder="Digite o email"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            ref={emailRef}
                            onFocus={() => scrollToInput(emailRef, scrollRef)}
                            onSubmitEditing={() => senhaRef.current.focus()} // vai pro próximo input
                            errMessage={errorMessage}
                            onValidate={(validation) => setEmailValido(validation)}
                        />
                        <MyInput
                            icon={3} // senha
                            placeholder="Digite a senha"
                            value={password}
                            onChangeText={setPassword}
                            senha={1}
                            ref={senhaRef}
                            returnKeyType="done"
                            onFocus={() => scrollToInput(senhaRef, scrollRef)}
                            onSubmitEditing={() => Keyboard.dismiss()} // fecha teclado
                            onValidate={(validation) => setSenhaValido(validation)}
                        />
                        <View className="items-center py-5 gap-5">
                            <Botao1 cta="Entrar" onpressProp={sigIn} errMessage={errorMessage} disabled={!emailValido || !senhaValido} />
                        </View>
                        <View className="flex-row justify-between items-between w-full px-4 pt-10">
                            <Pressable onPress={() => router.push("../login/recuperar")} >
                                <Span><A style={{ color: colors.primaryalt }}>Recuperar senha</A></Span>

                            </Pressable>
                            <Pressable onPress={() => router.push("../login/cadastro")} >
                                <Span><A style={{ color: colors.primaryalt }}>Cadastrar conta</A></Span>

                            </Pressable>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </View>

        </View>
    );
}
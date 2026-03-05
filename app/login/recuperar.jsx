import React, { useState } from "react";
import { View, Alert, Pressable } from "react-native";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../src/firebaseConnection";
import { router } from "expo-router";

import { H1, P, Span, A } from "../../components/tipografy";
import MyInput from "../../components/secundario/myInput";
import Botao1 from "../../components/secundario/botao1";
import { colors } from "../../components/ui/colors";
import Start from "../../components/tags/Start";


export default function RecuperarSenha() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [emailValido, setEmailValido] = useState(false);

    async function handleResetPassword() {
        if (!email) {
            Alert.alert("Atenção", "Digite seu email.");
            return;
        }

        try {
            setLoading(true);

            await sendPasswordResetEmail(auth, email);

            Alert.alert(
                "Email enviado",
                "Verifique sua caixa de entrada para redefinir sua senha."
            );

            router.back(); // volta para login
        } catch (error) {
            Alert.alert("Erro", error.code + "\n" + error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <View className="flex-1 justify-center items-center">
            <Start typePlayer={2} />

            <View className="bg-white flex-1 px-10 py-12 w-full gap-5 items-center" style={{ borderTopLeftRadius: 25, borderTopRightRadius: 25 }}>

                <View className="items-center">
                    <H1>Recuperar Senha</H1>
                    <P>Digite seu email para receber o link </P>
                    <P>para redefinir sua senha.</P>
                </View>

                <MyInput
                    icon={2} // mail
                    placeholder="Digite o email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    onValidate={(validation) => setEmailValido(validation)}
                />
                <View className="px-12 items-center  ">
                    <Botao1
                        cta={loading ? "Enviando..." : "Enviar link"}
                        disabled={!emailValido}
                        onpressProp={handleResetPassword}
                    />

                </View>

                <Pressable onPress={() => router.back()}>
                    <Span>
                        <A style={{ color: colors.primaryalt }}>
                            Voltar para Login
                        </A>
                    </Span>
                </Pressable>
            </View>
        </View>
    );
}

import React, { useState } from "react";
import { Header } from "../../components/tags/header";
import { addDoc, collection } from "firebase/firestore";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { router } from "expo-router";
import { colors } from "../../components/ui/colors";
import { st } from "../../components/ui/myStyles";
import { auth, db } from "../../src/firebaseConnection";
import MyInputText from "../../components/secundario/myInputText";
import Botao1 from "../../components/secundario/botao1";
import Botao2 from "../../components/secundario/botao2";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Cadastro() {
    const [step, setStep] = useState(1);
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [cpf, setCpf] = useState("");
    const [telefone, setTelefone] = useState("");
    const [password, setPassword] = useState("");

    function proximo() {
        if (step < 2) setStep(step + 1);
    }

    function voltar() {
        console.log("voltar");
        if (step > 1) setStep(step - 1);
    }

    // Validação CPF (usa o CPF limpo)
    function validarCPF(cpf) {
        cpf = cpf.replace(/\D/g, "");
        if (cpf.length !== 11) return false;
        if (/^(\d)\1{10}$/.test(cpf)) return false;

        let soma = 0;
        for (let i = 0; i < 9; i++) {
            soma += parseInt(cpf.charAt(i)) * (10 - i);
        }
        let resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) resto = 0;
        if (resto !== parseInt(cpf.charAt(9))) return false;

        soma = 0;
        for (let i = 0; i < 10; i++) {
            soma += parseInt(cpf.charAt(i)) * (11 - i);
        }
        resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) resto = 0;
        if (resto !== parseInt(cpf.charAt(10))) return false;

        return true;
    }

    // Máscara CPF
    function formatarCPF(valor) {
        return valor
            .replace(/\D/g, "")
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    }

    // Máscara telefone
    function formatarTelefone(text) {
        return text
            .replace(/\D/g, "") // Remove tudo que não for número
            .replace(/^(\d{2})(\d)/, "($1) $2") // Adiciona parênteses no DDD
            .replace(/(\d{5})(\d)/, "$1-$2") // Adiciona traço depois dos 5 dígitos do número
            .slice(0, 15); // Limita a 15 caracteres formatados
    }

    // Função de cadastro
    function signUp() {
        const cpfLimpo = cpf.replace(/\D/g, "");
        const telefoneLimpo = telefone.replace(/\D/g, "");

        if (nome.trim().length < 3) {
            Alert.alert("Erro", "Informe um nome válido.");
            setStep(1);
            return;
        }
        if (!validarCPF(cpfLimpo)) {
            Alert.alert("Erro", "Informe um CPF válido.");
            setStep(2);
            return;
        }
        if (telefoneLimpo.length < 11) {
            Alert.alert("Erro", "Informe um telefone válido com DDD.");
            setStep(2);
            return;
        }
        if (password.length < 6) {
            Alert.alert("Erro", "A senha deve ter pelo menos 6 caracteres.");
            setStep(2);
            return;
        }

        createUserWithEmailAndPassword(auth, email, password)
            .then(async ({ user }) => {
                await addDoc(collection(db, "usuarios"), {
                    uid: user.uid,
                    cpf, // salva com máscara
                    telefone, // salva formatado
                    email,
                });
                updateProfile(user, {
                    displayName: nome,
                });
                Alert.alert("Sucesso", "Usuário cadastrado com sucesso!");
                router.replace("/login");
            })
            .catch((err) => {
                if (err.code === "auth/invalid-email") {
                    Alert.alert("E-mail inválido", "Por favor, insira um e-mail válido.");
                    setStep(1);
                    return;
                }
                if (err.code === "auth/email-already-in-use") {
                    Alert.alert("E-mail em uso", "Este e-mail já está cadastrado.");
                    setStep(1);
                    return;
                }
                Alert.alert("Erro inesperado", err.message);
            });
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Header titulo="Cadastro" descricao={`Etapa ${step} de 2`} />
            <View className="w-full flex-1 justify-center items-center p-6">
                <View className="bg-white rounded-lg px-5 py-12 w-full gap-5">
                    {step === 1 && (
                        <>
                            <View>
                                <MyInputText titulo="Nome Completo" placeholder="Digite o nome" value={nome} onChangeText={setNome} keyboardType="default" />
                            </View>
                            <View>
                                <MyInputText titulo="E-mail" placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
                            </View>
                        </>
                    )}

                    {step === 2 && (
                        <>
                            <View>
                                <MyInputText
                                    maxlength={14}
                                    titulo="CPF"
                                    placeholder="CPF"
                                    value={cpf}
                                    onChangeText={(i) => setCpf(formatarCPF(i))}
                                    keyboardType="numeric"
                                />
                            </View>
                            <View>
                                <MyInputText
                                    titulo="Telefone"
                                    placeholder="Telefone"
                                    value={telefone}
                                    onChangeText={(i) => setTelefone(formatarTelefone(i))}
                                    keyboardType="phone-pad"
                                    maxlength={15}
                                />
                            </View>
                            <View>
                                <MyInputText titulo="Senha" placeholder="Senha" value={password} onChangeText={setPassword} senha={true} />
                            </View>
                        </>
                    )}
                </View>

                <View className="justify-between w-full items-center">
                    {step > 1 && (
                        <View className="w-full flex-col justify-center gap-2 items-center" style={{ paddingTop: 8 }}>
                            <Botao1 cta="Cadastrar" onpressProp={signUp} />
                            <Botao2 cta="Voltar" onpress={voltar} type={2} />
                        </View>
                    )}
                    {step < 2 && (
                        <View className="flex-row gap-5 items-center justify-between">
                            <Botao2 cta="Voltar para Login" onpress={() => router.push("../login")} type={2} />
                            <Botao2 cta="Próximo" onpress={proximo} />
                        </View>
                    )}
                </View>
            </View>
        </SafeAreaView>
    );
}

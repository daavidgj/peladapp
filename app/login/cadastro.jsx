import React, { useState } from "react";
import { Header } from "../../components/tags/header";
import { addDoc, collection } from "firebase/firestore";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { router } from "expo-router";
import { colors } from "../../components/ui/colors";
import { st } from "../../components/ui/myStyles";
import { auth, db } from "../../src/firebaseConnection";

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
                    Alert.alert(
                        "E-mail inválido",
                        "Por favor, insira um e-mail válido."
                    );
                    setStep(1);
                    return;
                }
                if (err.code === "auth/email-already-in-use") {
                    Alert.alert(
                        "E-mail em uso",
                        "Este e-mail já está cadastrado."
                    );
                    setStep(1);
                    return;
                }
                Alert.alert("Erro inesperado", err.message);
            });
    }

    return (
        <View style={st.body}>
            <Header titulo="Cadastro" descricao={`Etapa ${step} de 3`} />

            <View style={st.container}>
                <View style={st.form}>
                    {step === 1 && (
                        <>
                            <Text style={st.formTextLabel}>Nome</Text>
                            <TextInput
                                style={st.formInput}
                                placeholder="Digite seu nome"
                                value={nome}
                                onChangeText={setNome}
                            />

                            <Text style={st.formTextLabel}>Email</Text>
                            <TextInput
                                style={st.formInput}
                                placeholder="Digite seu email"
                                value={email}
                                onChangeText={setEmail}
                                autoCapitalize="none"
                                keyboardType="email-address"
                            />
                        </>
                    )}

                    {step === 2 && (
                        <>
                            <Text style={st.formTextLabel}>CPF</Text>
                            <TextInput
                                style={st.formInput}
                                placeholder="Digite seu CPF"
                                value={cpf}
                                maxLength={14}
                                onChangeText={(text) =>
                                    setCpf(formatarCPF(text))
                                }
                                keyboardType="numeric"
                            />

                            <Text style={st.formTextLabel}>Telefone</Text>
                            <TextInput
                                style={st.formInput}
                                placeholder="Digite seu telefone"
                                value={telefone}
                                maxLength={15}
                                onChangeText={(text) =>
                                    setTelefone(formatarTelefone(text))
                                }
                                keyboardType="phone-pad"
                            />

                            <Text style={st.formTextLabel}>Senha</Text>
                            <TextInput
                                style={st.formInput}
                                placeholder="Crie uma senha"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                            />
                        </>
                    )}
                </View>

                <View style={{ gap: 10, marginTop: 10 }}>
                    {step > 1 && <Button title="Voltar" onPress={voltar} />}
                    {step < 2 && <Button title="Próximo" onPress={proximo} />}
                    {step === 2 && (
                        <>
                            <Button title="Cadastrar" onPress={signUp} />
                            <Button
                                title="Ir para Login"
                                onPress={() => router.push("../login")}
                                color={colors.gray}
                            />
                        </>
                    )}
                </View>
            </View>
        </View>
    );
}

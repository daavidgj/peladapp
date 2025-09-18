import React, { useState } from "react";
import { Header } from "../../components/tags/header";
import { addDoc, collection } from "firebase/firestore";
import '../../global.css';
import {
    View,
    Text,
    TextInput,
    Button,
    StyleSheet,
    Alert,
    Pressable,
} from "react-native";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile,
} from "firebase/auth";
import { auth, db } from "../../src/firebaseConnection"; // ajuste se necessário
import { Link, router } from "expo-router";
import { colors } from "../../components/ui/colors";
import { st } from "../../components/ui/myStyles";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    function sigIn() {
        signInWithEmailAndPassword(auth, email, password)
            .then(({ user }) => {
                Alert.alert("Sucesso", "Usuário Logado");
                console.log("Logou e Redirecionou");
                router.replace("/"); // Redirecionar corretamente
            })
            .catch((err) => Alert.alert("Erro", err.code + "\n" + err.message));
    }

    return (
        <View style={st.body}>
            <Header
                titulo="Login"
                descricao="Faça o login para acessar a tela de listas da sua pelada"
            />
            <View style={st.container} >
                <View style={st.form}>
                    <View>
                        <Text style={st.formTextLabel}>E-mail</Text>
                        <TextInput
                            style={st.formInput}
                            placeholder="Email"
                            autoCapitalize="none"
                            value={email}
                            onChangeText={setEmail}
                        />
                    </View>
                    <View>
                        <Text style={st.formTextLabel}>E-mail</Text>
                        <TextInput
                            style={st.formInput}
                            placeholder="Senha"
                            secureTextEntry
                            value={password}
                            onChangeText={setPassword}
                        />
                    </View>
                </View>

                <Pressable
                    style={({ pressed }) => [
                        st.formPressable,
                        pressed && st.formPressableAtivo,
                    ]}
                    onPress={sigIn}
                >
                    <Text style={st.formPressableTexto}>Entrar</Text>
                </Pressable>
                <Pressable
                    style={({ pressed }) => [
                        st.formPressable2,
                        pressed && st.formPressable2Ativo,
                    ]}
                    onPress={() => router.push("../login/cadastro")}
                >
                    <Text style={st.formPressable2Texto}>Cadastre-se</Text>
                </Pressable>
            </View>
        </View>
    );
}

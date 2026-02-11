import { useEffect, useState } from "react";
import { View, Text, TextInput, Alert, Pressable } from "react-native";
import { onAuthStateChanged, updatePassword, updateEmail, updateProfile, signOut } from "firebase/auth";
import { auth } from "../../../src/firebaseConnection";
import { router } from "expo-router";
import { st } from "../../../components/ui/myStyles";
import MyInput from "../../../components/secundario/myInput";
import { H1, H2, P, A, Span } from "../../../components/tipografy";
import Botao1 from "../../../components/secundario/botao1";


export default function EditUser() {
    const [novaSenha, setNovaSenha] = useState("");
    const [novoNome, setNovoNome] = useState("");
    const [novoEmail, setNovoEmail] = useState("");
    const [carregando, setCarregando] = useState(true);

    useEffect(() => {

        const user = auth.currentUser;
        const unsubscribe = onAuthStateChanged(auth, (u) => {
            if (!u) {
                router.replace("/login");
                return;
            }
            setNovoNome(user.displayName || "");
            setNovoEmail(user.email || "");
            setCarregando(false);
        });

        return () => unsubscribe();
    }, []);

    async function alterarSenha() {
        if (novaSenha.length < 6) {
            Alert.alert("Erro", "A senha deve ter pelo menos 6 caracteres.");
            return;
        }

        try {
            await updatePassword(auth.currentUser, novaSenha);
            Alert.alert("Sucesso", "Senha atualizada com sucesso.");
            setNovaSenha("");
            router.back();
        } catch (error) {
            if (error.code === "auth/requires-recent-login") {
                Alert.alert(
                    "Sessão expirada",
                    "Faça login novamente para alterar sua senha."
                );
                router.replace("/login");
            } else {
                Alert.alert("Erro", error.message);
            }
        }
    }
    async function alterarPerfil() {

        const user = auth.currentUser;
        if (!user) return;

        try {
            if (novoNome !== user.displayName) {
                await updateProfile(user, { displayName: novoNome });
            }
            if (novoEmail !== user.email) {
                await updateEmail(user, novoEmail);
            }
            if (novaSenha.length > 0) {
                if (novaSenha.length < 6) {
                    Alert.alert("Erro", "A senha deve ter pelo menos 6 caracteres.");
                    return;
                }
                await updatePassword(auth.currentUser, novaSenha);
                Alert.alert("Sucesso", "Senha atualizada com sucesso! Faça Login novamente usando a nova senha");

                setNovaSenha("");
                router.replace("../login");
                signOut(auth);

            }

            Alert.alert("Sucesso", "Dados atualizados com sucesso.");
            router.back();
        } catch (error) {
            if (error.code === "auth/requires-recent-login") {
                Alert.alert("Sessão expirada", "Faça login novamente para alterar seus dados.");
                router.replace("/login");
            } else {
                Alert.alert("Erro", error.message);
            }
        }
    }




    return (
        <View style={{ flex: 1 }} className="px-10 py-12 gap-5 ">

            <View >
                <H1>Editar Informações</H1>
                <Text>Nova Senha</Text>
                <View className="gap-5 py-10">

                    <MyInput placeholder="Digite o novo nome" value={novoNome} onChangeText={setNovoNome} icon="user" />
                    <MyInput placeholder="Digite o novo Email" value={novoEmail} onChangeText={setNovoEmail} icon="mail" />
                    <MyInput placeholder="Digite a nova senha" secureTextEntry value={novaSenha} onChangeText={setNovaSenha} icon="lock" />
                </View>
                <View className="w-full items-center py-5 ">
                    <Botao1 onpressProp={alterarPerfil} cta="Salvar">Salvar</Botao1>
                </View>
            </View>

        </View>
    );
}

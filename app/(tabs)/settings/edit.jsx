import { useEffect, useState } from "react";
import { View, Text, TextInput, Alert, Pressable } from "react-native";
import { onAuthStateChanged, updatePassword } from "firebase/auth";
import { auth } from "../../../src/firebaseConnection";
import { router } from "expo-router";
import { Header } from "../../../components/tags/header";
import { st } from "../../../components/ui/myStyles";

export default function EditUser() {
    const [novaSenha, setNovaSenha] = useState("");
    const [carregando, setCarregando] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (userAtual) => {
            if (!userAtual) {
                router.replace("/login");
                return;
            }
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

    if (carregando) {
        return (
            <View style={st.body}>
                <Header titulo="Editar Senha" descricao="Carregando dados..." />
            </View>
        );
    }

    return (
        <View style={st.body}>
            <Header titulo="Editar Senha" descricao="Atualize sua senha" />

            <View style={st.container}>
                <View style={st.form}>
                    <Text style={st.formTextLabel}>Nova Senha</Text>
                    <TextInput
                        style={st.formInput}
                        placeholder="Digite a nova senha"
                        secureTextEntry
                        value={novaSenha}
                        onChangeText={setNovaSenha}
                    />

                    <Pressable
                        style={({ pressed }) => [
                            st.pressable,
                            pressed && st.pressableAtivo,
                            { marginTop: 20 },
                        ]}
                        onPress={alterarSenha}
                    >
                        <Text style={st.pressableTexto}>Alterar Senha</Text>
                    </Pressable>
                </View>

                <Pressable
                    style={({ pressed }) => [
                        st.formPressable2,
                        pressed && st.formPressable2Ativo,
                        { marginTop: 20 },
                    ]}
                    onPress={() => router.back()}
                >
                    <Text style={st.formPressable2Texto}>Voltar</Text>
                </Pressable>
            </View>
        </View>
    );
}

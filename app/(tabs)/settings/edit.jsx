import { useEffect, useState } from "react";
import { View, Text, TextInput, Alert, Pressable, FlatList } from "react-native";
import { onAuthStateChanged, updatePassword, updateEmail, updateProfile, signOut } from "firebase/auth";
import { auth } from "../../../src/firebaseConnection";
import { router } from "expo-router";
import { st } from "../../../components/ui/myStyles";
import MyInput from "../../../components/secundario/myInput";
import { H1, H2, P, A, Span } from "../../../components/tipografy";
import Botao1 from "../../../components/secundario/botao1";
import ShapeLoading from "../../../components/secundario/shapeLoading";
import Schema from "../../../components/functions/schema";


export default function EditUser() {
    const [novaSenha, setNovaSenha] = useState("");
    const [novoNome, setNovoNome] = useState("");
    const [novoEmail, setNovoEmail] = useState("");
    const [carregando, setCarregando] = useState(true);

    const [novoNomeValido, setNovoNomeValido] = useState(false);
    const [novoEmailValido, setNovoEmailValido] = useState(false);
    const [novaSenhaValido, setNovaSenhaValido] = useState(false);

    useEffect(() => {

        const user = auth.currentUser;
        const carregarInfo = onAuthStateChanged(auth, (u) => {

            setNovoNome(user.displayName || "");
            setNovoEmail(user.email || "");
            setCarregando(false);
        });

        return () => carregarInfo();
    }, []);

    async function alterarSenha() {
        await Schema.validate({ nome: novoNome, email: novoEmail, senha: novaSenha }, { abortEarly: false });
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




    return carregando ? (
        <View className="flex-1 gap-5" style={{ paddingTop: 60, paddingLeft: 20 }}>
            <View style={{ width: 140, height: 30 }}>
                <ShapeLoading />
            </View>
            <View style={{ width: "90%", height: "60", marginTop: 20 }}>
                <ShapeLoading />
            </View>
            <View style={{ width: "90%", height: "60" }}>
                <ShapeLoading />
            </View>
            <View style={{ width: "90%", height: "60" }}>
                <ShapeLoading />
            </View>
        </View>
    ) : (
        <View style={{ flex: 1 }} className="px-10 py-12 gap-5 bg-white">

            <View className="flex-1 gap-5" >
                <View className="">

                    <H1>Editar Informações</H1>
                    <P>Alterar suas informações</P>
                </View>
                <View className="gap-5">


                    <MyInput
                        icon={1}
                        placeholder="Digite o novo Nome"
                        value={novoNome}
                        onChangeText={setNovoNome}
                        validar={false}
                        onValidate={(validation) => setNovoNomeValido(validation)}
                    />
                    <MyInput
                        icon={2}
                        placeholder="Digite o novo Email"
                        value={novoEmail}
                        editable={false}
                    />
                    <MyInput
                        icon={3}
                        placeholder="Digite a nova senha"
                        secureTextEntry
                        value={novaSenha}
                        onChangeText={setNovaSenha}
                        onValidate={(validation) => setNovaSenhaValido(validation)}
                    />

                </View>
                <View className="px-14 items-center py-5 ">
                    <Botao1 onpressProp={alterarPerfil} cta="Salvar" disabled={!novoNomeValido || !novaSenhaValido} />
                </View>
            </View>

        </View>
    );
}

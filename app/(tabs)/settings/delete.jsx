import { useEffect, useState } from "react";
import { View, Text, TextInput, Alert, Pressable } from "react-native";
import { onAuthStateChanged, deleteUser, signOut, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { auth, db } from "../../../src/firebaseConnection";
import { router } from "expo-router";
import { st } from "../../../components/ui/myStyles";
import MyInput from "../../../components/secundario/myInput";
import { H1, H2, P, A, Span } from "../../../components/tipografy";
import Botao1 from "../../../components/secundario/botao1";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import Schema from "../../../components/functions/schema";




export default function DeleteUser() {
    const [novaSenha, setNovaSenha] = useState("");
    const [novaSenhaValido, setNovaSenhaValido] = useState(false);

    useEffect(() => {

        const unsubscribe = onAuthStateChanged(auth, (u) => {
            if (!u) {
                router.replace("/login");
                return;
            }
        });

        return () => unsubscribe();
    }, []);

    async function deletarConta() {

        if (novaSenha.length < 6) return;
        const user = auth.currentUser;

        if (!user) return;

        try {

            // 🔥 1 - Criar credencial
            const credential = EmailAuthProvider.credential(
                user.email,
                novaSenha // senha digitada pelo usuário
            );

            // 🔥 2 - Reautenticar
            await reauthenticateWithCredential(user, credential);

            // 🔥 3 - Agora sim pode deletar
            try {
                await deleteUser(user);
                Alert.alert("Sucesso", "Conta deletada com sucesso.");
                router.replace("/login");
            } catch (error) {
                console.log("Erro:", error.code);
                Alert.alert("Erro", "Senha incorreta ou login expirado.");
            }


        } catch (error) {
            console.log("Erro:", error.code);
            Alert.alert("Erro", "Senha incorreta ou login expirado.");
        }
    }



    return (
        <View style={{ flex: 1 }} className="px-10 py-12 bg-white">

            <View className="flex-1 gap-5">
                <View>

                    <H1>Deletar Conta</H1>
                    <P>Tem certeza que deseja excluir sua conta antes de prosseguir. </P>
                    <P>Essa ação não pode ser desfeita.</P>
                </View>
                <MyInput
                    icon={3}
                    placeholder="Digite a sua senha"
                    secureTextEntry
                    value={novaSenha}
                    onChangeText={setNovaSenha}
                    onValidate={(validation) => setNovaSenhaValido(validation)}
                />
                <View className="gap-5" style={{ minHeight: 160 }}>


                    <View className="px-12 items-center py-5 ">
                        <Botao1 onpressProp={deletarConta} cta="Deletar Conta" disabled={!novaSenhaValido} />
                    </View>
                </View>
            </View>

        </View>
    );
}

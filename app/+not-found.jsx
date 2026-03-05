import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import { Link } from "expo-router";
import { colors } from "../components/ui/colors";
import { st } from "../components/ui/myStyles";
import { router } from "expo-router";


export default function App() {
    return (
        <View style={st.container}>
            <Text style={st.h1}>Erro 404</Text>
            <Text style={st.h2}>Página Inicial</Text>
            <TouchableOpacity style={st.btn} onPress={() => router.replace("/")}>
                <Text style={st.texto}>Ir para Configurações</Text>
            </TouchableOpacity>
        </View>
    );
}

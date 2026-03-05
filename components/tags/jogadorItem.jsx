import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { MotiView } from "moti";
import { colors } from "../ui/colors";
import { st } from "../ui/myStyles";
import { useState } from "react";
import { H1, H2, P, A, Span } from "../tipografy";


export default function JogadorItem({ item, fila, removerJogador }) {

    const [backgroundPressed, setBackgroundPressed] = useState(false);

    return (
        <MotiView
            from={{ opacity: 0, translateX: -40, backgroundColor: backgroundPressed ? "red" : "#f1f5f990" }}
            animate={{ opacity: 1, translateX: backgroundPressed ? [-20] : 0, backgroundColor: backgroundPressed ? "#8B0000" : "#f1f5f990" }}
            transition={{ delay: 0, type: "timing", duration: 100 }}
            className="flex-row justify-between items-center px-2 py-1 rounded-lg mb-2"
            style={{ backgroundColor: backgroundPressed ? "red" : "#f1f5f990" }}
        >
            <View className="flex-row flex-1 gap-2 items-center">
                <Ionicons
                    name="person-circle-outline"
                    size={24}
                    color="#a8a8a8"
                    style={{ backgroundColor: colors.white, borderRadius: 100 }}
                />
                <P className="flex-1" colorWhite={backgroundPressed ? 1 : 2} ellipsizeMode="tail" oneLine={true}>{item.nome}</P>
            </View>

            <Pressable
                onPressIn={() => setBackgroundPressed(true)}
                onPressOut={() => setBackgroundPressed(false)}
                onPress={() => removerJogador(fila, item.id)}
                style={{ marginLeft: 10, padding: 5 }}
            >
                <Ionicons name="trash" size={18} color={colors.secondary} />
            </Pressable>
        </MotiView>
    );
}

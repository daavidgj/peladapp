import React from "react";
import { Text, Pressable, Vibration, Alert } from "react-native";
import { MotiView } from "moti";
import { Easing } from "react-native-reanimated";
import { colors } from "../../ui/colors";
import { useState } from "react";

export default function Botao1({ cta, onpressProp }) {
    const [startShake, setStartShake] = useState(false);
    const [isLongPress, setIsLongPress] = useState(false);
    const [alertaMensagem, setAlertaMensagem] = useState(false);
    const timerRef = React.useRef(null);

    const handlePressIn = () => {
        if (timerRef.current) clearTimeout(timerRef.current);
        setStartShake(false);
        setIsLongPress(false);

        timerRef.current = setTimeout(() => {
            setIsLongPress(true);
            setStartShake(true);
            Vibration.vibrate(300);
        }, 1500);
    };

    const handlePressOut = () => {
        clearTimeout(timerRef.current);

        if (!isLongPress) {
            setAlertaMensagem(true);
        } else {
            console.log("Botão executado");
            onpressProp();
            alertaMensagem && setAlertaMensagem(false);
            setStartShake(false);
        }
    };

    return (
        <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut}>
            {({ pressed }) => (
                <>
                    <MotiView
                        from={{ translateX: 0 }}
                        animate={startShake ? { translateX: [-15, 15, -8, 8, 0] } : { translateX: 0 }}
                        exit={{ translateX: 0 }}
                        transition={{
                            type: "timing",
                            duration: 80,
                            easing: Easing.elastic(1.5),
                        }}
                        style={{
                            backgroundColor: pressed ? colors.darkgreen : colors.green,
                            minWidth: "70%",
                        }}
                        className="p-3 px-6 rounded-full justify-center items-center relative overflow-hidden"
                    >
                        {/* Seus efeitos de pulsação mantidos exatamente iguais */}
                        <MotiView
                            from={{ opacity: 0, scale: 0 }}
                            animate={pressed ? { opacity: 0.5, scale: 3 } : { opacity: 0, scale: 0 }}
                            transition={{ type: "timing", duration: 400, easing: Easing.ease }}
                            className="absolute h-full w-full rounded-full bg-orange-600"
                            style={{ left: -300, bottom: 0 }}
                        />
                        <MotiView
                            from={{ opacity: 0, scale: 0 }}
                            animate={pressed ? { opacity: 0.7, scale: 4 } : { opacity: 0, scale: 0 }}
                            transition={{ type: "timing", duration: 900, easing: Easing.ease }}
                            className="absolute bottom-0 h-full w-full rounded-full bg-orange-600"
                            style={{ left: -300, bottom: 0 }}
                        />
                        <MotiView
                            from={{ opacity: 0, scale: 0 }}
                            animate={pressed ? { opacity: 0.9, scale: 5 } : { opacity: 0, scale: 0 }}
                            transition={{ type: "timing", duration: 1500, easing: Easing.ease }}
                            className="absolute h-full w-full rounded-full bg-orange-600"
                            style={{ left: -300, bottom: 0 }}
                        />
                        <MotiView
                            from={{ opacity: 0, scale: 0 }}
                            animate={pressed ? { opacity: 1, scale: 5 } : { opacity: 0, scale: 0 }}
                            transition={{ type: "timing", duration: 300, easing: Easing.ease, delay: pressed ? 1500 : 0 }}
                            className="absolute h-full w-full rounded-full bg-orange-600"
                            style={{ left: -300, bottom: 0 }}
                        />

                        <Text className="text-white text-center text-lg">{cta || "Entrar em Campo"}</Text>
                    </MotiView>

                    <Text className="text-center text-red-700 ">{alertaMensagem ? "Segure para confirmar" : ""}</Text>
                </>
            )}
        </Pressable>
    );
}

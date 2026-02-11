import React from "react";
import { Text, View, TextInput } from "react-native";
import { MotiView } from "moti";
import { Easing } from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";
export default function MyInput({ icon, placeholder, value, onChangeText, keyboardType, senha }) {
    return (

        <MotiView className="bg-slate-100 rounded-full py-2 px-6 flex-row gap-2  items-center border border-slate-200">

            <Feather name={icon ?? 'info'} color='#b8b8b8' size={24}></Feather>
            <TextInput className="flex-1" placeholder={placeholder} value={value} onChangeText={onChangeText} keyboardType={keyboardType} secureTextEntry={senha ? true : false} />
        </MotiView>
    )
}
/***
 * 
 * 
                         <MotiView
                             from={{ opacity: 0, scale: 0 }}
                             animate={pressed ? { opacity: 1, scale: 5 } : { opacity: 0, scale: 0 }}
                             transition={{ type: "timing", duration: 300, easing: Easing.ease, delay: pressed ? 1500 : 0 }}
                             className="absolute h-full w-full rounded-full bg-orange-600"
                             style={{ left: -300, bottom: 0 }}
                         />
 
                         <Text className="text-white text-center text-lg">{cta || "Entrar em Campo"}</Text>
                     </MotiView>
 */
import React from "react";
import { StyleSheet, Text, View, TextInput } from "react-native";

export default function MyInputText({ titulo, placeholder, value, onChangeText, keyboardType, maxlength, senha }) {
    return (
        <View className="gap-3 w-full">
            {/*
                        <MyInputText titulo="Nome da lista" placeholder="Digite o nome da lista" value={nome} onChangeText={setNome} keyboardType="default" />
            
            
            
            */}
            {titulo ? <Text className="text-md">{titulo}</Text> : null}

            <TextInput
                className="bg-slate-100 w-full p-3 rounded-lg border-2 border-slate-200"
                placeholder={placeholder}
                placeholderTextColor={"gray"}
                value={value}
                onChangeText={onChangeText}
                keyboardType={keyboardType}
                maxLength={maxlength}
                secureTextEntry={senha ? true : false}
            />
        </View>
    );
}

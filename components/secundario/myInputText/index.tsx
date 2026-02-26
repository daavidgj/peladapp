import React from "react";
import { StyleSheet, Text, View, TextInput } from "react-native";
import { Span } from "../../tipografy";

export default function MyInputText({ titulo, placeholder, value, onChangeText, keyboardType, maxlength, senha }) {
    return (
        <View className="gap-3 w-full">
            {/*
                        <MyInputText titulo="Nome da lista" placeholder="Digite o nome da lista" value={nome} onChangeText={setNome} keyboardType="default" />
            
            
            
            */}
            {titulo ? <Span>{titulo}</Span> : null}

            <TextInput
                className="bg-white w-full p-3 rounded-xl border-2  border-slate-100"
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

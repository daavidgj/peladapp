import React from 'react';
import { StyleSheet, Text, View,TouchableOpacity } from 'react-native';
import { colors } from '../../ui/colors';


export default function Botao2({cta,onpress}){
    return(
        <TouchableOpacity onPress={onpress} className="rounded-full p-2 justify-center items-center mt-2" style={{ backgroundColor: colors.green }}>
            <Text className="text-md text-white">{cta}</Text>
        </TouchableOpacity>
    )
}
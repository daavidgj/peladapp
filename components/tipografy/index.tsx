import React from "react";
import { Text } from "react-native";
import { colors } from "../ui/colors";

export function H1({ children }) {
    return (
        <Text className="" style={{ color: colors.primaryalt, fontFamily: "Poppins_700Bold", fontSize: 25 }}>
            {children}
        </Text>
    )
}

export function H2({ children, colorWhite }) {
    const color = colorWhite == true ? colors.white : colors.text;
    return (
        <Text className="text-xl" style={{ color: color, fontFamily: "Poppins_700Bold" }}>
            {children}
        </Text>
    )
}

export function H3({ children }) {
    return (
        <Text className="text-lg font-bold" style={{ color: colors.text }}>
            {children}
        </Text>
    )
}

export function P({ children, colorWhite }) {

    const color = colorWhite == true ? colors.white : colors.text;
    return (
        <Text style={{ color: color, fontFamily: "Poppins_400Regular", fontSize: 16 }}>
            {children}
        </Text>
    )
}
export function P2({ children, colorWhite }) {

    const color = colorWhite == true ? colors.white : colors.text;
    return (
        <Text style={{ color: color, fontFamily: "Poppins_400Regular", fontSize: 14 }}>
            {children}
        </Text>
    )
}
export function Pbutton({ children, colorWhite }) {
    const color = colorWhite == true ? colors.white : colors.text;
    return (
        <Text style={{ textAlign: "center", color: color, fontFamily: "Poppins_400Regular", fontSize: 14, letterSpacing: 0.7 }}>
            {children}
        </Text>
    )
}
export function Span({ children, colorWhite }) {
    const color = colorWhite == true ? colors.lightwhite : colors.text;
    return (
        <Text style={{ color: color, fontFamily: "Poppins_400Regular", fontSize: 12 }}>
            {children}
        </Text>
    )
}
export function A({ children }) {
    return (
        <Text style={{ color: colors.info, fontFamily: "Poppins_400Regular", fontSize: 12 }}>
            {children}
        </Text>
    )
}
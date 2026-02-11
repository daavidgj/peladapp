import React from "react";
import { Text } from "react-native";
import { colors } from "../ui/colors";

export function H1({ children }) {
    return (
        <Text className="text-2xl font-bold uppercase w-full" style={{ color: colors.primaryalt }}>
            {children}
        </Text>
    )
}

export function H2({ children }) {
    return (
        <Text className="text-xl font-bold">
            {children}
        </Text>
    )
}

export function H3({ children }) {
    return (
        <Text className="text-lg font-bold">
            {children}
        </Text>
    )
}

export function P({ children }) {
    return (
        <Text className="">
            {children}
        </Text>
    )
}
export function Span({ children }) {
    return (
        <Text className="text-sm">
            {children}
        </Text>
    )
}
export function A({ children }) {
    return (
        <Text style={{ color: colors.info }}>
            {children}
        </Text>
    )
}
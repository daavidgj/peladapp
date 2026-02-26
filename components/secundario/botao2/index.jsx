import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { colors } from "../../ui/colors";
import { Pbutton } from "../../tipografy";

export default function Botao2({ cta, onpress, type }) {
    let backcolortype;
    switch (type) {
        case 1:
            backcolortype = colors.green;
            break;
        case 2:
            backcolortype = "#6f6f6f";
            break;
        case 3:
            backcolortype = colors.error;
            break;
        default:
            backcolortype = colors.green;
    }
    return (
        <TouchableOpacity onPress={onpress} className="rounded-full px-4 py-2 justify-center items-center mt-2" style={{ backgroundColor: backcolortype }}>
            <Pbutton colorWhite={1}>{cta}</Pbutton>

        </TouchableOpacity>
    );
}

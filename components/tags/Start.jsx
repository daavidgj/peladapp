import { View, Text, TouchableOpacity, Pressable, Image, ImageBackground } from "react-native";
import { useEffect, useState } from "react";

export default function Start({ typePlayer }) {
    const typeP = typePlayer || 1;
    let source;

    switch (typeP) {
        case 1: source = require("../../assets/images/Peladapp Player 3d 011.png"); break;
        case 2: source = require("../../assets/images/Peladapp Player 3d 012.png"); break;
    }

    return (


        <ImageBackground source={require("../../assets/images/PeladappBackground1.jpg")} resizeMode="cover" style={{ height: 240, width: '100%', marginBottom: '-10', justifyContent: 'flex-end', alignItems: 'center' }}  >
            <Image source={source} className="h-64" style={{ resizeMode: 'contain' }} />

        </ImageBackground>
    )
}
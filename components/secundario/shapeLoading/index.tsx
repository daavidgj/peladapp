import React, { useState, useEffect } from "react";
import { View, Text, Pressable, Vibration, Dimensions } from "react-native";
import { MotiView } from "moti";
import { Easing } from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "react-native-gradients";

import { colors } from "../../ui/colors";
import { st } from "../../ui/myStyles";

export default function ShapeLoading() {
    const colorList = [
        { offset: "0%", color: "#e8e8e8", opacity: "1" },
        { offset: "25%", color: "#d8d8d8", opacity: "1" },
        { offset: "45%", color: "#e8e8e8", opacity: "1" },
        { offset: "50%", color: "#ffffff", opacity: "1" },
        { offset: "55%", color: "#e8e8e8", opacity: "1" },
        { offset: "65%", color: "#e8e8e8", opacity: "1" },
        { offset: "70%", color: "#ffffff", opacity: "1" },
        { offset: "75%", color: "#d8d8d8", opacity: "1" },
    ];

    const { width, height } = Dimensions.get("window");

    return (
        <View className=" overflow-hidden rounded-lg " style={{ height: "100%", width: "100%" }}>
            <MotiView
                style={{ width: width * 3, height: "100%" }}
                from={{ translateX: -width * 2 }}
                animate={{ translateX: 0 }}
                transition={{
                    type: "timing",
                    duration: 1000,
                    loop: true,
                    repeatReverse: true,
                    easing: Easing.ease,
                }}
            >
                <LinearGradient colorList={colorList} angle={135} style={{ width: "100%", height: "100%" }} />
            </MotiView>
        </View>
    );
}

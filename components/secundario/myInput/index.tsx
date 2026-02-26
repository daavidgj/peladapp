import React, { useState, forwardRef } from "react";
import { View, TextInput } from "react-native";
import Animated, { Layout } from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";
import { colors } from "../../ui/colors";

const MyInput = forwardRef(
    ({ icon, placeholder, value, onChangeText, keyboardType, senha, onSubmitEditing, returnKeyType = "next", onFocus }, ref) => {
        const [inputPressed, setInputPressed] = useState(false);

        switch (icon) {
            case 1: icon = "user"; break;
            case 2: icon = "mail"; break;
            case 3: icon = "lock"; break;
        }

        return (
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    borderRadius: 100,
                    height: 64,
                    marginVertical: 4,
                    overflow: "hidden",
                }}
                className="bg-slate-100"
            >
                <Animated.View
                    layout={Layout.springify().damping(15).stiffness(60).duration(600)}
                    style={{ width: inputPressed ? 0 : 60, alignItems: "center", justifyContent: "center" }}
                >
                    <Feather name={icon} color="#b8b8b8" size={24} />
                </Animated.View>

                <Animated.View
                    layout={Layout.springify().damping(15).stiffness(60).duration(400)}
                    style={{ flex: 1 }}
                >
                    <TextInput
                        className="bg-slate-100"
                        ref={ref} // 🔑 O ref vem do pai
                        placeholder={placeholder}
                        value={value}
                        onChangeText={onChangeText}
                        keyboardType={keyboardType}
                        secureTextEntry={!!senha}
                        onFocus={() => {
                            setInputPressed(true);

                            setTimeout(() => {
                                onFocus?.();
                            }, 80);
                        }}
                        onPress={() => {
                            setInputPressed(true);

                            setTimeout(() => {
                                onFocus?.();
                            }, 80);
                        }}

                        onBlur={() => setInputPressed(false)}
                        returnKeyType={returnKeyType}
                        onSubmitEditing={onSubmitEditing}
                        blurOnSubmit={returnKeyType === "done"}
                        style={{ color: colors.text, paddingLeft: inputPressed ? 20 : 0 }}
                        placeholderTextColor={colors.text2}
                    />
                </Animated.View>
            </View>
        );
    }
);

export default MyInput;

import React, { useState, forwardRef } from "react";
import { View, TextInput, Text } from "react-native";
import Animated, { Layout } from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";
import { colors } from "../../ui/colors";
import Schema from "../../functions/schema";
import { useEffect } from "react";



const MyInput = forwardRef(
    ({ icon, placeholder, value, onChangeText, keyboardType, senha, onSubmitEditing, returnKeyType = "next", onFocus, onValidate, editable = true }, ref) => {
        const [inputPressed, setInputPressed] = useState(false);
        const [error, setError] = useState("");
        const [validation, setValidation] = useState(false);
        useEffect(() => {
            if (value.length != 0) {
                handleValidation(value);
            }
        }, []);



        let fieldName = "";

        switch (icon) {
            case 1:
                icon = "user";
                fieldName = "nome";
                break;
            case 2:
                icon = "mail";
                fieldName = "email";
                break;
            case 3:
                icon = "lock";
                fieldName = "senha";
                break;
        }

        const handleValidation = async (text) => {
            let isValid = false;

            try {
                await Schema.validateAt(fieldName, {
                    [fieldName]: text,
                });

                isValid = true;
                setError("");

            } catch (err) {
                isValid = false;
                setError(err.errors);
            }

            setValidation(isValid);
            onValidate?.(isValid);
        };

        return (
            <View className=" items-center justify-center relative">
                {/* 🔥 erro abaixo do input */}
                {error ? (
                    <Text style={{ color: colors.error, fontSize: 10, position: "absolute", top: -4, left: 40, zIndex: 2 }} className="bg-red-100 rounded-lg py-1 px-2">
                        {error}
                    </Text>
                ) : null}
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
                        <Feather name={icon} color={validation ? colors.primaryalt : value.length == 0 ? "#b8b8b8" : editable ? colors.error : "#b8b8b8"} size={24} />
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
                            onChangeText={(text) => {
                                onChangeText?.(text);
                                handleValidation(text); // 🔥 valida ao digitar
                            }}
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
                            editable={editable}

                            onBlur={() => setInputPressed(false)}
                            returnKeyType={returnKeyType}
                            onSubmitEditing={onSubmitEditing}
                            blurOnSubmit={returnKeyType === "done"}
                            style={{ color: colors.text, paddingLeft: inputPressed ? 20 : 0 }}
                            placeholderTextColor={colors.text2}
                        />
                    </Animated.View>
                </View>

            </View>

        );
    }
);

export default MyInput;

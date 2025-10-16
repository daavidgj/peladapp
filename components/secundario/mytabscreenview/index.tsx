import React from "react";
import { View, Text } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { FontAwesome } from "@expo/vector-icons";
import { colors } from "../../ui/colors";

export default function MyTabScreenView({ icon, focused }) {
    return (
        <View>
            <FontAwesome
                style={
                    focused
                        ? {
                              borderRadius: 200,
                              backgroundColor: focused ? colors.green : colors.gray,
                              borderStyle: "solid",
                              borderWidth: 5,
                              borderColor: colors.primary,
                              position: "absolute",
                              bottom: -10,
                              justifyContent: "center",
                              alignItems: "center",
                              height: 70,
                              width: 70,
                              alignSelf: "center",
                              marginHorizontal: "auto",
                              textAlign: "center",
                              textAlignVertical: "center",
                          }
                        : {}
                }
                size={28}
                name={icon}
                color={focused ? colors.white : "#22222290"}
            />
        </View>
    );
}

import { useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../ui/colors";
import { st } from "../ui/myStyles";

export function Task({ inome, icompleted }) {
  const [completed, setCompleted] = useState(icompleted);
  return (
    <View style={st.formCampo}>
      <Pressable
        placeholder="Nova Tarefa"
        style={({ pressed }) => [
          completed ? st.taskItem : st.taskItemInativo,
          pressed && st.taskItemHover,
        ]}
        onPress={() => {
          setCompleted(!completed);
        }}
      >
        <Ionicons
          name="checkmark-circle"
          size={32}
          color={completed ? colors.info : colors.gray}
        />
        <Text styles={st.p}>{inome}</Text>
      </Pressable>
    </View>
  );
}

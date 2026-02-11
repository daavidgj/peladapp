import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../components/ui/colors";

export default function RootLayout() {
    return (
        <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
            <StatusBar style="light" backgroundColor={colors.primaryalt} />
            <Stack
                screenOptions={{
                    headerStyle: { backgroundColor: colors.primaryalt },
                    headerTintColor: "#ffffff",
                }}
            >
                <Stack.Screen name="(tabs)" options={{ headerTitle: "Tabs", headerShown: false }} />
                <Stack.Screen name="listas" options={{ headerTitle: "Lista", headerShown: false }} />
                <Stack.Screen name="index" options={{ headerShown: false }} />
                <Stack.Screen name="login" options={{ headerTitle: "Login", headerShown: false }} />
                <Stack.Screen name="+not-found" options={{ headerTitle: "Página 404" }} />
            </Stack>
        </SafeAreaView>
    );
}

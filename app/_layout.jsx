import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
    return (
        <>
            <StatusBar style="light" backgroundColor="#222" />
            <Stack
                screenOptions={{
                    headerStyle: { backgroundColor: "#222" },
                    headerTintColor: "#ffffff",
                }}
            >
                <Stack.Screen name="index" options={{ headerShown: false }} />
                <Stack.Screen name="(tabs)" options={{ headerTitle: "Tabs", headerShown: false }} />
                <Stack.Screen name="login" options={{ headerTitle: "Login", headerShown: false }} />
                <Stack.Screen name="listas" options={{ headerTitle: "Lista", headerShown: false }} />
                <Stack.Screen name="+not-found" options={{ headerTitle: "Página 404" }} />
            </Stack>
        </>
    );
}

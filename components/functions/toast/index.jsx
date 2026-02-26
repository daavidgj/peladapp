import { ToastAndroid, Platform } from "react-native";

export function showToast(message, duration = "SHORT") {
    // Só roda no Android
    if (Platform.OS !== "android") {
        console.log("Toast:", message); // fallback para iOS
        return;
    }

    // Define duração
    const dur = duration === "LONG" ? ToastAndroid.LONG : ToastAndroid.SHORT;


    // Mostra o toast
    console.log("Toast:", message);
    ToastAndroid.show(message, dur);
}

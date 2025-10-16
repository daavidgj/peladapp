import { StyleSheet } from "react-native";
import { colors } from "./colors";

export const st = StyleSheet.create({
    body: { backgroundColor: colors.primary, flex: 1 },
    container: {
        flex: 1,
        flexDirection: "column",
        gap: 10,
        justifyContent: "flex-start",
    },

    tarefa: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 10,
        borderRadius: 10,
        backgroundColor: "#c8c8c8",
    },
    tarefaCol1: {
        width: "10%",
        flexDirection: "row",
        alignContent: "center",
        justifyContent: "center",
        alignItems: "flex-start",
    },
    tarefaCol2: {
        flexDirection: "row",
        width: "90%",
        alignContent: "center",
        justifyContent: "center",
    },
    texto: {
        fontSize: 18,
        color: "#fff",
    },
    titulo: {
        fontSize: 24,
        color: "#fff",
    },
    btn: {
        backgroundColor: colors.info,
        padding: 15,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
        marginTop: "20",
    },
    pressableFormCampo: {
        backgroundColor: colors.info,
        display: "flex",
        height: 40,
        width: 40,
        borderRadius: 20,
        textAlign: "center",
        justifyContent: "center",
    },
    pressableFormCampoAtivo: {
        backgroundColor: "#1769aa", // Um tom mais escuro do azul original
        transform: [{ scale: 1.25 }], // Leve efeito de "pressionado"
    },
    pressableFormCampoTextoTasks: {
        backgroundColor: colors.sucess,
        display: "flex",
        height: 40,
        width: 40,
        borderRadius: 20,
        textAlign: "center",
        justifyContent: "center",
    },
    pressableFormCampoTasks: {
        backgroundColor: colors.sucess,
        display: "flex",
        height: 40,
        width: 40,
        borderRadius: 20,
        textAlign: "center",
        justifyContent: "center",
    },
    pressableFormCampoTasksNo: {
        backgroundColor: colors.danger,
        display: "flex",
        height: 40,
        width: 40,
        borderRadius: 20,
        textAlign: "center",
        justifyContent: "center",
    },
    pressableFormCampoTexto: {
        textAlign: "center",
        color: "#fff",
        fontWeight: "600",
        fontSize: 18,
    },
    textInput: {
        width: 300,
        padding: 10,
        marginTop: 10,
        marginBottom: 10,
        backgroundColor: "#e8e8e8",
        borderRadius: 5,
    },
    //
    textInputListTasks: {
        width: 300,
        padding: 10,
        marginTop: 10,
        marginBottom: 10,
        backgroundColor: "#e8e8e8",
        borderRadius: 5,
    },
    //Pressable Botão
    pressable: {
        backgroundColor: colors.primary,
        padding: 10,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 10,
        width: "50%",
        borderRadius: 100,
    },
    pressableAtivo: {
        backgroundColor: colors.primaryalt,
        padding: 10,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 10,
        width: "50%",
        borderRadius: 100,
    },
    pressableTexto: { color: colors.white, fontSize: 16 },
    //---------------------------------------------
    //form
    form: {
        paddingBottom: 60,
        gap: 30, // espaço entre os elementos do formulário (caso esteja usando RN >= 0.71 ou um wrapper que aceite)
    },
    formTextLabel: {
        fontSize: 16,
        letterSpacing: 2,
        marginBottom: 10,

        color: colors.text2, // espaço entre os elementos do formulário (caso esteja usando RN >= 0.71 ou um wrapper que aceite)
    },

    formInput: {
        backgroundColor: colors.dark,
        borderWidth: 2,
        borderColor: "#444444",
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
        width: "100%",
        color: colors.white,
    },

    formPressable: {
        marginTop: -35,
        marginHorizontal: "auto",
        backgroundColor: colors.sucess,
        paddingVertical: 12,
        borderRadius: 118,
        width: "60%",
        alignItems: "center",
    },
    formInput2: {
        backgroundColor: colors.dark,
        borderWidth: 2,
        borderColor: "#444444",
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
        width: "50%",
        color: colors.white,
    },

    formPressableAtivo: {
        backgroundColor: colors.info,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: "center",
    },

    formPressableTexto: {
        color: colors.white,
        fontWeight: "bold",
        fontSize: 16,
    },
    formPressable2: {
        borderBottomWidth: 1,
        borderBottomColor: colors.dark,
        padding: 10,
        borderRadius: 10,
        justifyContent: "center",
        marginTop: 60,
        width: "120",
    },
    formPressable2Ativo: {
        borderBottomWidth: 3,
        borderBottomColor: colors.sucess,
        padding: 10,
        borderRadius: 10,
        justifyContent: "center",
        marginTop: 60,
        width: "120",
    },
    formPressable2Texto: {
        color: colors.white,
        textAlign: "left",
        fontSize: 16,
    },

    /////////////////////////////////////////////////////////////////////////////////////////////////////
    //Listas->
    //Jogador
    jogadorAddInput: {},
    jogadorcard1: {
        backgroundColor: colors.dark,
        marginVertical: 10,
        padding: 15,
        borderRadius: 10,
        display: "flex",
        flexDirection: "row",
        gap: 10,
    },
    jogadorNome: {
        color: colors.white,
        fontSize: 14,
        letterSpacing: 2,
        fontWeight: 600,
    },
    //ListagemListas
    listaBusca: {
        flex: 1,
        padding: 10,
        marginLeft: -20,
        width: "110%",
    },
    listaCube: {
        backgroundColor: colors.dark,
        borderLeftWidth: 15,
        borderColor: colors.sucess,
        justifyContent: "center",
        flex: 1,
        maxWidth: "48%",
        margin: 10,
        padding: "15",
        borderRadius: 10,
    },
    listaCubeTexto: { color: colors.white, fontWeight: 600, letterSpacing: 1 },
    listaCubeTexto1: {},
    //
    flatList: {
        width: "115%",
        marginLeft: -23,
    },
    //tasks
    taskItem: {
        width: 350,
        padding: 10,
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        marginTop: 10,
        marginBottom: 10,
        backgroundColor: "#e8e8e8",
        borderRadius: 5,
        gap: 10,
    },
    taskItemInativo: {
        width: 350,
        padding: 10,
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        marginTop: 10,
        marginBottom: 10,
        backgroundColor: "#ffffff89",
        borderRadius: 5,
        gap: 10,
    },
    taskItemHover: {},
    /////////////////////////////////////////////////////////////////////////////////////////////////
    //Tipografia
    h1: {
        fontSize: 24,
        color: colors.text,
        letterSpacing: 1,
        fontWeight: 600,
    },
    h2: {
        fontSize: 20,
        color: colors.text2,
        letterSpacing: 1,
        fontWeight: 500,
    },
    p: {
        fontSize: 16,
        color: colors.text,
        letterSpacing: 1.5,
        fontWeight: 400,
    },
});

import * as yup from "yup";

const Schema = yup.object().shape({
    nome: yup
        .string()
        .required("Nome é obrigatório")
        .min(3, "Mínimo 3 caracteres"),

    email: yup
        .string()
        .email("Email inválido")
        .required("Email é obrigatório"),

    senha: yup
        .string()
        .min(6, "Mínimo 6 caracteres")
        .required("Senha obrigatória"),
});

export default Schema;
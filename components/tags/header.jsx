import { View, Text } from "react-native";
import { st } from "../ui/myStyles";
import { colors } from "../ui/colors";

import { Feather } from '@expo/vector-icons';
import { Image, TouchableOpacity } from "react-native";
import "../../global.css";

export function Header({ titulo, descricao }) {
    return (
        <View className="justify-between items-center py-5 flex-row px-5  w-full">
                        <View>
                            <Image source={require('../../assets/images/peladaapplogo.png')} className="h-16 w-16" style={{marginTop:'-12'}} />
                        </View>
                        <View>
                        <Text className="text-lg font-bold uppercase">
                            {titulo}
                        </Text>
                        </View>
                        <View className="">
                            <TouchableOpacity className="p-2 bg-slate-300 rounded-full">
                                <Feather name="user" size={24} color="black" />
                            </TouchableOpacity>
                        </View>
                    </View> 
    )
}

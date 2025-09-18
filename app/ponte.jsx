import { Text, View,TouchableOpacity,StyleSheet} from 'react-native';
import { Link } from 'expo-router';
import {colors} from '../components/ui/colors';
import {st} from '../components/ui/myStyles';

export default function Home() {
  return (
    <View style={st.container}>
      <Text style={st.h1}>Página Inicial</Text>
      <Text style={st.h2}>Página Inicial</Text>
      <Link replace  href="/settings" asChild>
        <TouchableOpacity style={st.btn}>
        <Text style={st.texto}>Ir para Configurações</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}



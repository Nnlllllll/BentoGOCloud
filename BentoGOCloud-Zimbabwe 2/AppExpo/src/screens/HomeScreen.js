import React from "react";
import { View, Text, Button, Image } from "react-native";
import styles from "../styles/styles";

import { get } from "../servers/Crud"; 

import logo from "../../assets/logo-Bento-Quirino-sem-fundo-branco.png";

export default function HomeScreen({ navigation }) {
  
  async function testarBanco() {
    const data = await get();
    console.log("Dados do db.json:", data);
  }

  return (
    <View style={styles.container}>
      {/* Aplicando a fonte DaysOne aqui via array de estilos */}
      <Text style={[styles.title, { fontFamily: 'DaysOne' }]}>
        BentoGo
      </Text>
      
      <Image 
        source={logo} 
        style={{ 
          width: 150, 
          height: 150, 
          resizeMode: 'contain', 
          alignSelf: 'center', 
          marginVertical: 20 
        }} 
      />
      <Button
        title="Ir para Configuracoes"
        onPress={() => navigation.navigate("Settings")}
        color="#4F5A66"
      />
      <br/>
      <Button
        title="Abrir Mapa 3D"
        onPress={() => navigation.navigate("Main")}
      />
      <View style={{ marginTop: 20 }}>
        <Button
          title="Testar Conexão com Servidor"
          color="#841584"
          onPress={testarBanco}
        />
      </View>
    </View>
  );
}
import React from "react";
import { View, Text, Button, Image } from "react-native";
import styles from "../styles/styles";

import { get } from "../servers/Crud"; 

import logo from "../../assets/logo-Bento-Quirino-sem-fundo-branco.png";

export default function SettingsScreen({ navigation }) {

  return (
    <View style={styles.container}>
      {/* Aplicando a fonte DaysOne aqui via array de estilos */}
      <Text style={[styles.title, { fontFamily: 'DaysOne' }]}>
        Configs
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
      <br/>
      <Button
        title="Voltar para a homescreen"
        onPress={() => navigation.navigate("Home")}
      />
      <View style={{ marginTop: 20 }}>
      </View>
    </View>
  );
}
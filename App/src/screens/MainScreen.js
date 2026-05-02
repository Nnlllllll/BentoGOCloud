import React, { Suspense } from "react";
import { View, } from "react-native";
import { Canvas } from "@react-three/fiber/native";
import { OrbitControls, useGLTF } from "@react-three/drei/native";
import { useAssets } from "expo-asset";

import styles from "../styles/styles";

// Importa o modelo Bentao diretamente dos assets
const modelFile = require("../../assets/Bentao.glb");

function Modelo() {
  const { scene } = useGLTF(modelFile);
  // Escala e posição focadas apenas na visualização do objeto
  return <primitive object={scene} scale={[8, 8, 8]} position={[0, -2, 0]} />;
}

export default function MainScreen() {
  const [assets] = useAssets([modelFile]);

  // Se os arquivos 3D ainda não carregaram, não renderiza nada
  if (!assets) return null;

  return (
    <View style={styles.container}>
      <Canvas camera={{ position: [0, 0, 15] }}>
        <ambientLight intensity={1.5} />
        <Suspense fallback={null}>
          <Modelo />
        </Suspense>
        <OrbitControls enableZoom={true} enablePan={true} makeDefault />
      </Canvas>
    </View>
  );
}
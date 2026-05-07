import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import styles from "../styles/Main.module.css";

import modelPath from "../assets/Bentao.glb";

function Modelo() {
  const { scene } = useGLTF(modelPath);
  return <primitive object={scene} scale={[8, 8, 8]} position={[0, -2, 0]} />;
}

export default function MainPage() {
  return (
    <div className={styles.container} style={{ width: '100vw', height: '100vh' }}>
      <Canvas camera={{ position: [0, 0, 15] }}>
        <ambientLight intensity={1.5} />
        <pointLight position={[10, 10, 10]} />
        <Suspense fallback={<div style={{color: 'white'}}>Carregando Mapa...</div>}>
          <Modelo />
        </Suspense>
        <OrbitControls enableZoom={true} enablePan={true} />
      </Canvas>
    </div>
  );
}
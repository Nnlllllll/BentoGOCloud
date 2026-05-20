import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Bounds } from "@react-three/drei"; 
import styles from "../styles/Main.module.css";

import modelPath from "../assets/Bentao.glb";

function Modelo() {
  const { scene } = useGLTF(modelPath);
  return <primitive object={scene} />;
}

export default function MainPage() {
  return (
    <div className={styles.container} style={{ width: '100vw', height: '100vh', display: 'block' }}>
      <Canvas camera={{ position: [0, 15, 20], far: 10000 }}>
        <ambientLight intensity={1.5} />
        <pointLight position={[10, 10, 10]} />
        
        <Suspense fallback={<div style={{color: 'white'}}>Carregando Mapa...</div>}>
          <Bounds fit clip observe margin={0.8}>
            <Modelo />
          </Bounds>
        </Suspense>
        
        <OrbitControls makeDefault enableZoom={true} enablePan={true} />
      </Canvas>
    </div>
  );
}

useGLTF.preload(modelPath);
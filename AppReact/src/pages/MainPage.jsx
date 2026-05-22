import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Bounds } from "@react-three/drei"; 
import settings from "../assets/settings.png";
import voltar from "../assets/voltar.png";
import info from "../assets/info.png";
import styles from "../styles/Main.module.css";
import { useNavigate } from "react-router-dom";

import modelPath from "../assets/Bentao.glb";

function Modelo() {
  const { scene } = useGLTF(modelPath);
  return <primitive object={scene} />;
}

export default function MainPage() {
  const navigate = useNavigate();
  return (
    <div className={styles.container}>
       <div className={styles.containerVoltar}>
        <button
          className={styles.buttonVoltar}
          onClick={() => navigate("/")}
          >
            <img 
              src={voltar} 
              style={{ 
                width: '50px', 
                height: '50px', 
                objectFit: 'contain', 
                display: 'block',
                margin: '20px auto' 
                     }} 
                   />  
        </button> 
       </div>
       <h1 className={styles.title} style={{ fontFamily: 'DaysOne'}}>
               Localização
        </h1>
       <div className={styles.containerSettings}>

        <button
          className={styles.buttonInfo}
          onClick={() => navigate("/info")}
          >
          <img 
            src={info} 
            style={{ 
              width: '50px', 
              height: '50px', 
              objectFit: 'contain', 
              display: 'block',
              margin: '20px auto' 
                  }} 
           /> 
        </button> 

        <button
          className={styles.buttonSettings}
          onClick={() => navigate("/settings")}
          >
            <img 
              src={settings} 
              style={{ 
                width: '50px', 
                height: '50px', 
                objectFit: 'contain', 
                display: 'block',
                margin: '20px auto' 
                     }} 
                   />  
        </button>        
       </div>
       <div style={{ 
        position: 'absolute', 
        top: '120px', 
        left: '15px', 
        width: 'calc(100% - 30px)', 
        height: 'calc(100% - 135px)', 
        zIndex: 0 
        }}>
        <Canvas camera={{ position: [0, 15, 20], far: 10000 }}>
          <ambientLight intensity={1.5} />
          <pointLight position={[10, 10, 10]} />
          
          <Suspense fallback={<div style={{color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%'}}>Carregando Mapa...</div>}>
            <Bounds fit clip observe margin={0.8}>
              <Modelo />
            </Bounds>
          </Suspense>
          
          <OrbitControls makeDefault enableZoom={true} enablePan={true} />
        </Canvas>  
      </div>

      
    </div>
  );
}

useGLTF.preload(modelPath);
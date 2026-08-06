import React, { Suspense, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Bounds } from "@react-three/drei"; 
import * as THREE from "three";
import settings from "../assets/settings.png";
import voltar from "../assets/voltar.png";
import info from "../assets/info.png";
import styles from "../styles/Main.module.css";
import { useNavigate } from "react-router-dom";

import modelPath from "../assets/Bentao.glb";

import PersonagemAnimado from "../assets/PersonagemAnimado";

// Coordenadas de referência (Entrada da Escola)
const ANCHOR_LAT = -22.9068; 
const ANCHOR_LNG = -47.0616; 

function latLngToVector3(lat, lng) {
  const latRad = (ANCHOR_LAT * Math.PI) / 180;
  const deltaLat = lat - ANCHOR_LAT;
  const deltaLng = lng - ANCHOR_LNG;

  const z = -deltaLat * 111320;
  const x = deltaLng * 111320 * Math.cos(latRad);

  return new THREE.Vector3(x, 0, z);
}

function Modelo() {
  const { scene } = useGLTF(modelPath);
  return (

    <group 
      onClick={(e) => {
        e.stopPropagation();
        console.log("Coordenada 3D do clique:", e.point);
      }}
    >
      <primitive object={scene} />
    </group>
  );
  }

export default function MainPage() {
  const navigate = useNavigate();
  const [targetPos, setTargetPos] = useState(new THREE.Vector3(0, 0, 0));

  // Escuta a localização GPS do celular
  useEffect(() => {
    if (!navigator.geolocation) return;

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const new3DPos = latLngToVector3(latitude, longitude);
        setTargetPos(new3DPos);
      },
      (err) => console.error(err),
      { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  return (
    <div className={styles.container}>
       <div className={styles.containerVoltar}>
        <button className={styles.buttonVoltar} onClick={() => navigate("/")}>
          <img src={voltar} style={{ width: '50px', height: '50px', objectFit: 'contain', display: 'block', margin: '20px auto' }} />  
        </button> 
       </div>

       <h1 className={styles.title} style={{ fontFamily: 'DaysOne'}}>
         Localização
       </h1>

       <div className={styles.containerSettings}>
        <button className={styles.buttonInfo} onClick={() => navigate("/info")}>
          <img src={info} style={{ width: '50px', height: '50px', objectFit: 'contain', display: 'block', margin: '20px auto' }} /> 
        </button> 

        <button className={styles.buttonSettings} onClick={() => navigate("/settings")}>
          <img src={settings} style={{ width: '50px', height: '50px', objectFit: 'contain', display: 'block', margin: '20px auto' }} />  
        </button>        
       </div>

       <div style={{ position: 'absolute', top: '120px', left: '15px', width: 'calc(100% - 30px)', height: 'calc(100% - 135px)', zIndex: 0 }}>
        <Canvas camera={{ position: [0, 15, 20], far: 10000 }}>
          <ambientLight intensity={1.5} />
          <pointLight position={[10, 10, 10]} />
          
          <Suspense fallback={<div style={{color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%'}}>Carregando Mapa...</div>}>
            
            <Bounds fit clip observe margin={0.8}>
              <Modelo />
            </Bounds>

            <PersonagemAnimado targetPosition={targetPos} />

          </Suspense>
          
          <OrbitControls makeDefault enableZoom={true} enablePan={true} />
        </Canvas>  
      </div>
    </div>
  );
}

useGLTF.preload(modelPath);
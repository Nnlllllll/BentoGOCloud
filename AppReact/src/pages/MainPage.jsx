import React, { Suspense, useState, useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei"; 
import * as THREE from "three";
import settings from "../assets/settings.png";
import voltar from "../assets/voltar.png";
import info from "../assets/info.png";
import styles from "../styles/Main.module.css";
import { useNavigate } from "react-router-dom";

import modelPath from "../assets/Bentao.glb";
import PersonagemAnimado from "../assets/PersonagemAnimado";

// Coordenadas GPS da entrada da escola.
// Usamos esse ponto real como o centro (0,0,0) do nosso mundo 3D.
const ANCHOR_LAT = -22.9068; 
const ANCHOR_LNG = -47.0616; 

// Converte a Latitude e Longitude do celular para coordenadas X, Y, Z em metros dentro do mapa 3D
function latLngToVector3(lat, lng) {
  const latRad = (ANCHOR_LAT * Math.PI) / 180;
  const deltaLat = lat - ANCHOR_LAT;
  const deltaLng = lng - ANCHOR_LNG;

  // Cada 1 grau equivale a cerca de 111.320 metros na Terra
  const z = -deltaLat * 111320 * 1000;
  const x = deltaLng * 111320 * Math.cos(latRad) * 1000;

  return new THREE.Vector3(x, 0, z);
}

// Componente responsável por movimentar e focar a câmera em 3ª pessoa acompanhando o boneco
function CameraController({ targetPos }) {
  const controlsRef = useRef();

  // Executado continuamente a cada quadro renderizado na tela (fps)
  useFrame((state) => {
    if (controlsRef.current) {
      // Posição onde o boneco está no chão (pés)
      const characterPos = new THREE.Vector3(targetPos.x, targetPos.y, targetPos.z);
      
      // O ponto original do boneco fica nos pés. Para a câmera não olhar pro chão e cortar a cabeça,
      // criamos um ponto de foco elevando o alvo em +1.8 metros (altura do peito/cabeça).
      const targetLookAt = new THREE.Vector3(
        characterPos.x,
        characterPos.y + 1.8, 
        characterPos.z
      );

      // Define a distância fixa da câmera em relação ao boneco:
      // Y = 3.2 (altura da visão) e Z = -4 (valor negativo posiciona a câmera atrás do boneco)
      const cameraOffset = new THREE.Vector3(0, 3.2, -4); 
      
      // Posiciona a câmera no espaço 3D acompanhando o deslocamento do personagem
      state.camera.position.set(
        characterPos.x + cameraOffset.x,
        characterPos.y + cameraOffset.y,
        characterPos.z + cameraOffset.z
      );
      
      // Aponta o foco do OrbitControls diretamente para a cabeça do personagem
      controlsRef.current.target.copy(targetLookAt);
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enableZoom={true} // Permite aproximar ou afastar a visão com pinça/scroll
      enablePan={false} // Desativa o pan (arrastar) para o usuário não perder o boneco de vista no mapa
      maxPolarAngle={Math.PI / 2 - 0.05} // Impede que a câmera gire para debaixo do chão
      minDistance={1}   // Limite mínimo de aproximação
      maxDistance={10}  // Limite máximo de afastamento
    />
  );
}

// Componente que carrega e exibe o modelo 3D da escola (.glb)
function Modelo() {
  const { scene } = useGLTF(modelPath);
  return (
    <group
      scale={[1000, 1000, 1000]}
      position={[
        -54.8837811357049,
        -3.00000002607705,
        64.7137628134997
      ]}
      rotation={[-Math.PI / 2, 0, Math.PI]}
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

  // Hook que lê o sensor de GPS do dispositivo em tempo real
  useEffect(() => {
    if (!navigator.geolocation) return;

    // watchPosition escuta as atualizações de localização conforme a pessoa anda
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        // Converte as coordenadas do mundo real para posições dentro do mapa 3D
        const new3DPos = latLngToVector3(latitude, longitude);
        setTargetPos(new3DPos);
      },
      (err) => console.error("Erro ao obter GPS:", err),
      { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
    );

    // Limpa o monitoramento do GPS ao fechar a tela para não gastar bateria do celular
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

       {/* Container onde a viewport 3D do WebGL é renderizada */}
       <div style={{ position: 'absolute', top: '120px', left: '15px', width: 'calc(100% - 30px)', height: 'calc(100% - 135px)', zIndex: 0 }}>
        <Canvas camera={{ position: [0, 3.2, -4], far: 10000 }}>
          <ambientLight intensity={1.5} />
          <pointLight position={[10, 10, 10]} />
          
          {/* Suspense exibe a mensagem de carregamento enquanto os arquivos 3D baixam */}
          <Suspense fallback={<div style={{color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%'}}>Carregando Mapa...</div>}>
            
            {/* Cenário da escola */}
            <Modelo />

            {/* Boneco animado controlado pela posição do GPS */}
            <PersonagemAnimado targetPosition={targetPos} />
            
            {/* Sistema de câmera em terceira pessoa */}
            <CameraController targetPos={targetPos} />

          </Suspense>
        </Canvas>  
      </div>
    </div>
  );
}

// Carrega o arquivo do mapa em segundo plano para não travar a navegação
useGLTF.preload(modelPath);
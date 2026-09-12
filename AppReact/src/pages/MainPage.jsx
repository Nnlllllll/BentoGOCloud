import React, { Suspense, useState, useEffect, useRef, useCallback } from "react"; 
import { Canvas, useFrame } from "@react-three/fiber"; 
import { OrbitControls, useGLTF, Html } from "@react-three/drei";  
import * as THREE from "three"; 
import settings from "../assets/settings.png"; 
import voltar from "../assets/voltar.png"; 
import info from "../assets/info.png"; 
import mapa from "../assets/mapa.png";
import styles from "../styles/Main.module.css"; 
import { useNavigate } from "react-router-dom"; 

import modelPath from "../assets/Bentao.glb"; 
import PersonagemAnimado from "../assets/PersonagemAnimado"; 


// ponto usado como referência para converter o GPS para a cena 3D
const ANCHOR_LAT = -22.9068;  
const ANCHOR_LNG = -47.0616;  

// controla a suavização da movimentação da câmera
const CAMERA_POS_DAMPING = 4;


// converte latitude e longitude para uma posição X/Z no espaço 3D
// o ponto de referência funciona como origem da cena
function latLngToVector3(lat, lng) { 
  const latRad = (ANCHOR_LAT * Math.PI) / 180; 
  const deltaLat = lat - ANCHOR_LAT; 
  const deltaLng = lng - ANCHOR_LNG; 
 
  // 1 grau de latitude corresponde a 111320 metros
  const z = -deltaLat * 111320 * 1000; 
  const x = deltaLng * 111320 * Math.cos(latRad) * 1000; 
 
  return new THREE.Vector3(x, 0, z); 
} 


// controla a posição da câmera em relação ao personagem
function CameraController({
  targetPos,
  topView,
  mapCenter,
  mapSize,
  characterRotationRef
}) {
  const controlsRef = useRef();
  const smoothedCamPosRef = useRef(new THREE.Vector3());
  const smoothedTargetRef = useRef(new THREE.Vector3());
  const initializedRef = useRef(false);

  useFrame((state, delta) => {
    if (!controlsRef.current) return;

    const characterPos = new THREE.Vector3(
      targetPos.x,
      targetPos.y,
      targetPos.z
    );


    // visão de cima usada para visualizar o mapa
    if (topView) {
      const center = mapCenter || new THREE.Vector3(0, 0, 0);
      const size = mapSize || new THREE.Vector3(100, 0, 100);
      const camera = state.camera;
      const fovRadians = (camera.fov * Math.PI) / 180;
      const aspect = camera.aspect || 1;

      // calcula uma altura aproximada para manter o mapa dentro da tela
      const widthNeeded = size.x / aspect;
      const depthNeeded = size.z;
      const largestDimension = Math.max(widthNeeded, depthNeeded);

      let cameraHeight =
        largestDimension / (2 * Math.tan(fovRadians / 2));

      cameraHeight *= 1.25;
      cameraHeight = Math.max(cameraHeight, 50);

      state.camera.position.set(
        center.x,
        center.y + cameraHeight,
        center.z
      );

      controlsRef.current.target.set(
        center.x,
        center.y,
        center.z
      );

      controlsRef.current.minDistance = 1;
      controlsRef.current.maxDistance = cameraHeight * 3;
      controlsRef.current.minPolarAngle = 0;
      controlsRef.current.maxPolarAngle = 0.05;

      return;
    }


    // usa a rotação atual do personagem para posicionar a câmera
    const characterRotationY =
      characterRotationRef?.current ?? 0;

    const targetLookAt = new THREE.Vector3(
      characterPos.x,
      characterPos.y + 1.8,
      characterPos.z
    );

    // posição inicial da câmera em relação ao personagem
    const cameraOffset = new THREE.Vector3(0, 3.2, -4);

    // aplica a rotação do personagem nesse deslocamento
    cameraOffset.applyAxisAngle(
      new THREE.Vector3(0, 1, 0),
      characterRotationY
    );

    const desiredCamPos = new THREE.Vector3(
      characterPos.x + cameraOffset.x,
      characterPos.y + cameraOffset.y,
      characterPos.z + cameraOffset.z
    );


    // define a posição inicial da câmera
    if (!initializedRef.current) {
      smoothedCamPosRef.current.copy(desiredCamPos);
      smoothedTargetRef.current.copy(targetLookAt);
      initializedRef.current = true;
    } else {
      // suaviza a movimentação da câmera entre uma posição e outra
      const posLerp = 1 - Math.exp(-CAMERA_POS_DAMPING * delta);

      smoothedCamPosRef.current.lerp(
        desiredCamPos,
        posLerp
      );

      smoothedTargetRef.current.lerp(
        targetLookAt,
        posLerp
      );
    }

    state.camera.position.copy(
      smoothedCamPosRef.current
    );

    controlsRef.current.target.copy(
      smoothedTargetRef.current
    );

    controlsRef.current.minDistance = 1;
    controlsRef.current.maxDistance = 10;
    controlsRef.current.minPolarAngle = 0;
    controlsRef.current.maxPolarAngle =
      Math.PI / 2 - 0.05;
  });

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enableZoom={true}
      enablePan={false}
      maxPolarAngle={Math.PI / 2 - 0.05}
      minDistance={1}
      maxDistance={10}
    />
  );
}


// icone de localização na visão de cima
function PlayerMarker({ targetPos, topView }) {
  if (!topView) return null;

  return (
    <Html
      position={[
        targetPos.x - 4,
        targetPos.y + 15,
        targetPos.z
      ]}
      center
      zIndexRange={[10, 20]}
      style={{
        pointerEvents: "none",
        width: "10px",
        height: "10px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <div
        style={{
          position: "relative",
          width: "10px",
          height: "10px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <div
          style={{
            position: "absolute",
            width: "85px",
            height: "85px",
            borderRadius: "50%",
            backgroundColor: "rgba(66, 133, 244, 0.30)",
            animation: "locationPulse 1.5s infinite"
          }}
        />

        <div
          style={{
            position: "relative",
            width: "20px",
            height: "20px",
            borderRadius: "50% 50% 50% 0",
            backgroundColor: "#4285F4",
            border: "5px solid white",
            transform: "rotate(-45deg)",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <div
            style={{
              width: "20px",
              height: "20px",
              borderRadius: "50%",
              backgroundColor: "#4285F4",
              transform: "rotate(45deg)"
            }}
          />
        </div>
      </div>

      <style>
        {`
          @keyframes locationPulse {
            0% {
              transform: scale(0.7);
              opacity: 0.8;
            }

            70% {
              transform: scale(1.4);
              opacity: 0;
            }

            100% {
              transform: scale(1.4);
              opacity: 0;
            }
          }
        `}
      </style>
    </Html>
  );
}


// carrega o modelo do mapa e obtém suas dimensões
// essas dimensões são usadas para ajustar a visão de cima
function Modelo({ onBoundsReady }) { 
  const { scene } = useGLTF(modelPath); 
  const groupRef = useRef();

  useEffect(() => {
    if (!groupRef.current) return;

    groupRef.current.updateWorldMatrix(true, true);

    const box = new THREE.Box3().setFromObject(
      groupRef.current
    );

    const center = new THREE.Vector3();
    const size = new THREE.Vector3();

    box.getCenter(center);
    box.getSize(size);

    if (onBoundsReady) {
      onBoundsReady({ center, size });
    }
  }, [scene, onBoundsReady]);

  return ( 
    <group 
    //O Mapa foi refeito errado e ai tivemos que aplicar algumas rotações e translações para ele ficar no lugar certo
      ref={groupRef}
      scale={[1000, 1000, 1000]} 
      position={[ 
        -54.8837811357049, 
        -3.00000002607705, 
        64.7137628134997 
      ]} 
      rotation={[-Math.PI / 2, 0, Math.PI]} 
      onClick={(e) => { 
        e.stopPropagation(); 

        // mostra no console a posição 3D do ponto clicado para eu conseguir conseguir ajustar a posição do mapa
        console.log("Coordenada 3D do clique:", e.point); 
      }} 
    > 
      <primitive object={scene} /> 
    </group> 
  ); 
} 


export default function MainPage() { 
  const navigate = useNavigate();

  // posição atual do personagem na cena 3D
  const [targetPos, setTargetPos] =
    useState(new THREE.Vector3(0, 0, 0)); 

  // controla a troca entre a visão normal e a visão de cima
  const [topView, setTopView] = useState(false);

  // informações usadas para ajustar a câmera ao mapa
  const [mapCenter, setMapCenter] =
    useState(new THREE.Vector3(0, 0, 0));

  const [mapSize, setMapSize] =
    useState(new THREE.Vector3(100, 0, 100));

  // rotação do personagem compartilhada com a câmera
  const characterRotationRef = useRef(0);


  // leitura da posição atual pelo GPS
  useEffect(() => {
    if (!navigator.geolocation) return;

    let lastPos = null;

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const {
          latitude,
          longitude,
          accuracy
        } = position.coords;

        // ignora leituras com precisão acima de 30 metros
        if (accuracy && accuracy > 30) return;

        // transforma a coordenada do GPS em posição dentro da cena
        const new3DPos =
          latLngToVector3(latitude, longitude);

        // ignora mudanças pequenas de posição ou ruidos
        if (
          lastPos &&
          lastPos.distanceTo(new3DPos) < 1.5
        ) {
          return;
        }

        lastPos = new3DPos;
        setTargetPos(new3DPos);
      },
      (err) =>
        console.error("Erro ao obter GPS:", err),
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 10000
      }
    );

    return () =>
      navigator.geolocation.clearWatch(watchId);
  }, []);


  // recebe o centro e o tamanho do modelo do mapa
  const handleBoundsReady = useCallback(
    ({ center, size }) => {
      setMapCenter(center);
      setMapSize(size);
    },
    []
  );


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
              width: "50px",
              height: "50px",
              objectFit: "contain",
              display: "block",
              margin: "20px auto"
            }}
          />   
        </button>  
      </div> 


      <h1
        className={styles.title}
        style={{ fontFamily: "DaysOne" }}
      > 
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
              width: "50px",
              height: "50px",
              objectFit: "contain",
              display: "block",
              margin: "20px auto"
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
              width: "50px",
              height: "50px",
              objectFit: "contain",
              display: "block",
              margin: "20px auto"
            }}
          />   
        </button>         

      </div> 


      <div
        style={{
          position: "absolute",
          top: "120px",
          left: "15px",
          width: "calc(100% - 30px)",
          height: "calc(100% - 135px)",
          zIndex: 0
        }}
      > 

        <Canvas
          camera={{
            position: [0, 3.2, -4],
            far: 10000
          }}
        > 

          <ambientLight intensity={1.5} /> 
          <pointLight position={[10, 10, 10]} /> 
           
          <Suspense
            fallback={
              <div
                style={{
                  color: "white",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%"
                }}
              >
                Carregando Mapa...
              </div>
            }
          > 
             
            <Modelo
              onBoundsReady={handleBoundsReady}
            /> 

            <PersonagemAnimado
              targetPosition={targetPos}
              rotationRef={characterRotationRef}
            /> 
             
            <CameraController 
              targetPos={targetPos}
              topView={topView}
              mapCenter={mapCenter}
              mapSize={mapSize}
              characterRotationRef={characterRotationRef}
            />

            <PlayerMarker
              targetPos={targetPos}
              topView={topView}
            />
 
          </Suspense> 
        </Canvas>   


        <button
          className={styles.buttonTopo}
          onClick={() =>
            setTopView((prev) => !prev)
          }
          aria-label={
            topView
              ? "Voltar para visão normal"
              : "Ver mapa de cima"
          }
        >
          <img
            src={mapa}
            alt="Visão de cima"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain"
            }}
          />
        </button>

      </div> 
    </div> 
  ); 
} 
 
useGLTF.preload(modelPath);

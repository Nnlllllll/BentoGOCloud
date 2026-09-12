import React, { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from "three";


// modelo 3D utilizado temporário obtido da pasta de exemplos do repositorio do three.js
const MODEL_URL =
  "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/models/gltf/Xbot.glb";

// ajustes utilizados na rotação do personagem
const HEADING_SIGN = -1;
const HEADING_OFFSET_DEG = 0;

// controla a velocidade com que o personagem acompanha a nova direção
const ROTATION_DAMPING = 3;

export default function PersonagemAnimado({ targetPosition, rotationRef }) {
  const groupRef = useRef();

  // guarda a direção recebida do magnetômetro
  const headingRef = useRef(0);

  // guarda a rotação atual do personagem
  const currentRotationRef = useRef(0);

  const { scene, animations } = useGLTF(MODEL_URL);
  const { actions } = useAnimations(animations, groupRef);

  // controla a animação atual do personagem
  const [animationState, setAnimationState] = useState("idle");


  useEffect(() => {
    // recebe a leitura do magnetômetro enviada pelo App.js
    const handleMagnetometer = (event) => {
      if (typeof event.detail === "number") {
        headingRef.current = event.detail;
      }
    };

    window.addEventListener(
      "atualizaBussola",
      handleMagnetometer
    );

    return () => {
      window.removeEventListener(
        "atualizaBussola",
        handleMagnetometer
      );
    };
  }, []);


  useEffect(() => {
    // seleciona a animação de acordo com o estado do personagem
    const currentActionName =
      animationState === "walk" ? "walk" : "idle";

    const currentAction = actions[currentActionName];

    if (currentAction) {
      currentAction
        .reset()
        .fadeIn(0.2)
        .play();
    }

    return () => {
      if (currentAction) {
        currentAction.fadeOut(0.2);
      }
    };
  }, [animationState, actions]);


  useFrame((state, delta) => {
    if (!groupRef.current || !targetPosition) return;

    const currentPos = groupRef.current.position;

    // calcula a distância entre o personagem e a posição do GPS
    const dx = targetPosition.x - currentPos.x;
    const dz = targetPosition.z - currentPos.z;
    const distance = Math.sqrt(dx * dx + dz * dz);


    if (distance > 1000) {
      // movimentação do personagem até a posição recebida pelo GPS
      if (animationState !== "walk") {
        setAnimationState("walk");
      }

      currentPos.lerp(
        targetPosition,
        delta * 2.5
      );

      // enquanto se move, olha em direção ao destino
      groupRef.current.lookAt(
        targetPosition.x,
        currentPos.y,
        targetPosition.z
      );

      currentRotationRef.current =
        groupRef.current.rotation.y;

    } else {
      // quando chega à posição, fica parado e acompanha o magnetômetro
      if (animationState !== "idle") {
        setAnimationState("idle");
      }

      // converte a direção recebida para a rotação usada no modelo
      const adjustedHeadingDeg =
        HEADING_SIGN * headingRef.current +
        HEADING_OFFSET_DEG;

      const targetRotation =
        THREE.MathUtils.degToRad(
          adjustedHeadingDeg
        );

      let difference =
        targetRotation -
        currentRotationRef.current;

      // evita uma mudança maior ao passar de 360 para 0 graus
      difference = Math.atan2(
        Math.sin(difference),
        Math.cos(difference)
      );

      // suaviza a mudança de direção
      const rotationLerp =
        1 - Math.exp(
          -ROTATION_DAMPING * delta
        );

      currentRotationRef.current +=
        difference * rotationLerp;

      groupRef.current.rotation.y =
        currentRotationRef.current;
    }


    // disponibiliza a rotação atual para a câmera
    if (rotationRef) {
      rotationRef.current =
        groupRef.current.rotation.y;
    }
  });


  return (
    <group
      ref={groupRef}
      position={[0, 0, 0]}
      scale={[1, 1, 1]}
    >
      <primitive
        object={scene}
        scale={1.5}
        position={[0, 0, 0]}
      />
    </group>
  );
}
useGLTF.preload(MODEL_URL);

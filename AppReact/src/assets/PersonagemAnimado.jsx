import React, { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations } from "@react-three/drei";

// Modelo de teste público do Three.js (com animações 'idle' e 'walk')
const MODEL_URL = "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/models/gltf/Xbot.glb";

export default function PersonagemAnimado({ targetPosition }) {
  const groupRef = useRef();
  
  const { scene, animations } = useGLTF(MODEL_URL);
  const { actions } = useAnimations(animations, groupRef);

  const [animationState, setAnimationState] = useState("idle");

  // Transição entre as animações
  useEffect(() => {
    const currentActionName = animationState === "walk" ? "walk" : "idle";
    const currentAction = actions[currentActionName];

    if (currentAction) {
      currentAction.reset().fadeIn(0.2).play();
    }

    return () => {
      if (currentAction) currentAction.fadeOut(0.2);
    };
  }, [animationState, actions]);

  // Movimento e rotação a cada frame
  useFrame((state, delta) => {
    if (!groupRef.current || !targetPosition) return;

    const currentPos = groupRef.current.position;
    const distance = currentPos.distanceTo(targetPosition);

    if (distance > 0.2) {
      if (animationState !== "walk") setAnimationState("walk");
      currentPos.lerp(targetPosition, delta * 2.5);
      groupRef.current.lookAt(targetPosition.x, currentPos.y, targetPosition.z);
    } else {
      if (animationState !== "idle") setAnimationState("idle");
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <primitive object={scene} scale={1.5} position={[0, 0, 0]} />
    </group>
  );
}

useGLTF.preload(MODEL_URL);
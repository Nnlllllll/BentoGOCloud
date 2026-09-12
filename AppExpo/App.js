// Parte nativa do projeto em Expo
// O aplicativo abre a aplicação React pelo WebView
// O magnetômetro é lido nesta parte e enviado para a aplicação web

import React, { useEffect, useRef } from "react";
import { WebView } from "react-native-webview";
import { Magnetometer } from "expo-sensors";

const SMOOTHING = 0.15;
const MIN_HEADING_DELTA = 1.5;

export default function App() {
  const webViewRef = useRef(null);

  // valor utilizado para suavizar a leitura do magnetômetro
  const smoothedRef = useRef({ x: 0, y: 0, initialized: false });
  const lastHeadingRef = useRef(null);

  useEffect(() => {
    Magnetometer.setUpdateInterval(100);

    const subscription = Magnetometer.addListener(({ x, y }) => {
      const s = smoothedRef.current;

      if (!s.initialized) {
        s.x = x;
        s.y = y;
        s.initialized = true;
      } else {
        s.x += (x - s.x) * SMOOTHING;
        s.y += (y - s.y) * SMOOTHING;
      }

      // conversão da leitura para graus
      let heading = Math.atan2(s.y, s.x) * (180 / Math.PI);
      if (heading < 0) heading += 360;

      // ignora pequenas alterações na leitura
      if (lastHeadingRef.current !== null) {
        let diff = heading - lastHeadingRef.current;
        diff = ((diff + 180) % 360 + 360) % 360 - 180;

        if (Math.abs(diff) < MIN_HEADING_DELTA) return;
      }

      lastHeadingRef.current = heading;

      // envia a leitura do magnetômetro para o React/Vite
      const script = `
        window.dispatchEvent(new CustomEvent('atualizaBussola', { detail: ${heading} }));
        true;
      `;

      if (webViewRef.current) {
        webViewRef.current.injectJavaScript(script);
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    // aplicação React/Vite utilizada dentro do WebView
    <WebView
      ref={webViewRef}
      source={{ uri: "https://bentogo.me" }}
      style={{ flex: 1 }}
      javaScriptEnabled={true}
    />
  );
}
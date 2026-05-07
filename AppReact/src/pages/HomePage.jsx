import React from "react";
import { useNavigate } from "react-router-dom";
import { get } from "../servers/Crud"; 
import logo from "../assets/logo-Bento-Quirino-sem-fundo-branco.png";
import styles from "../styles/Home.module.css";

export default function HomePage() {
  const navigate = useNavigate();
  
  async function testarBanco() {
    try {
      const data = await get();
      console.log("Dados do db.json:", data);
    } catch (error) {
      console.error("Erro ao conectar:", error);
    }
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title} style={{ fontFamily: 'DaysOne' }}>
        BentoGo
      </h1>
      
      <img 
        src={logo} 
        alt="Logo"
        style={{ 
          width: '150px', 
          height: '150px', 
          objectFit: 'contain', 
          display: 'block',
          margin: '20px auto' 
        }} 
      />

      <div className={styles.buttonContainer}>
        <button
          className={styles.buttonSecondary}
          onClick={() => navigate("/settings")}
          style={{ backgroundColor: '#4F5A66', color: 'white' }}
        >
          Ir para Configurações
        </button>

        <button
          className={styles.buttonPrimary}
          onClick={() => navigate("/main")}
        >
          Abrir Mapa 3D
        </button>

        <button
          className={styles.buttonTest}
          onClick={testarBanco}
          style={{ backgroundColor: '#841584', color: 'white', marginTop: '20px' }}
        >
          Testar Conexão com Servidor
        </button>
      </div>
    </div>
  );
}
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

      <div className={styles.logos}>
        <h1 className={styles.title} style={{ fontFamily: 'DaysOne'}}>
          BentoGo
        </h1>
        
        <img 
          src={logo} 
          style={{ 
            width: '200px', 
            height: '200px', 
            objectFit: 'contain', 
            display: 'block',
            margin: '10px auto' 
          }} 
        />  
      </div>

      <div className={styles.buttonContainer}>
        <button
          className={styles.buttonPrimary}
          onClick={() => navigate("/main")}
        >
          Começar
        </button>
      </div>
    </div>
  );
}
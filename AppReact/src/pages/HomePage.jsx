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
      <div className={styles.logos} style={{paddingBottom: 150}}>
      <h1 className={styles.title} style={{ fontFamily: 'DaysOne'}}>
        BentoGo
      </h1>
      
      <img 
        src={logo} 
        alt="Logo"
        style={{ 
          width: '250px', 
          height: '250px', 
          objectFit: 'contain', 
          display: 'block',
          margin: '20px auto' 
        }} 
      />  
      </div>
      

      <div className={styles.buttonContainer} style={{paddingBottom: 200}}>

        <button
          className={styles.buttonPrimary}
          onClick={() => navigate("/main")}
        >
          Iniciar
        </button>

      </div>
    </div>
  );
}
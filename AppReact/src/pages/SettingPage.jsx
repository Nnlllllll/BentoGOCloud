import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo-Bento-Quirino-sem-fundo-branco.png";
import styles from "../styles/Setting.module.css";

export default function SettingPage() {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <h1 className={styles.title} style={{ fontFamily: 'DaysOne' }}>
        Configs
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

      <button
        className={styles.button}
        onClick={() => navigate("/")}
      >
        Voltar para a homescreen
      </button>
    </div>
  );
}
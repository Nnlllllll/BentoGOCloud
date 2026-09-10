import React from "react";
import { useNavigate } from "react-router-dom";
import { get } from "../servers/Crud";

import logotipo from "../assets/BentoGOLogotipo.png";
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

      {/* Logo pequeno */}
      <img
        src={logotipo}
        className={styles.smallLogo}
        alt="BentoGo"
      />

      {/* Título, subtítulo e conteúdo principal */}
      <div className={styles.logos}>

        <h1 className={styles.title}>
          BentoGo
        </h1>

        <h3 className={styles.title2}>
          "Sempre siga em frente"
        </h3>

        {/* Conteúdo 1 + Logo + Conteúdo 2 */}
        <div className={styles.logoArea}>

          <div className={styles.twodivsgeneral}>
            <span>
              O BentoGo é um projeto desenvolvido para facilitar a orientação dentro da
              Escola Técnica Estadual Bento Quirino. A proposta é tornar a experiência de
              alunos, familiares e visitantes mais simples, principalmente para quem
              ainda não conhece o espaço da escola. Durante uma primeira visita, encontrar
              salas, projetos e outros ambientes pode ser difícil quando não se conhece
              a estrutura do local. Pensando nisso, o projeto foi desenvolvido para
              auxiliar diferentes públicos que precisam se localizar dentro da escola,
              oferecendo uma forma mais visual e intuitiva de conhecer o ambiente. Assim,
              o BentoGo busca diminuir a dificuldade de orientação e tornar o deslocamento
              pela escola mais fácil.
            </span>
          </div>

          <img
            src={logo}
            className={styles.mainLogo}
            alt="Logo Bento Quirino"
          />

          <div className={styles.twodivsgeneral}>
            <span>
              Para solucionar esse problema, o BentoGo utiliza um mapa interativo em 3D
              que permite ao usuário conhecer a estrutura da escola e acompanhar sua
              própria posição durante o deslocamento. A localização é obtida pelo GPS do
              dispositivo e representada diretamente no mapa. O sistema também permite
              alternar entre diferentes formas de visualização, facilitando a compreensão
              do espaço e ajudando o usuário a encontrar os locais de interesse. Dessa
              maneira, a orientação pode ser feita de forma mais dinâmica do que
              utilizando apenas uma representação tradicional da escola. A aplicação foi
              desenvolvida utilizando React, React Router, Three.js, React Three Fiber,
              Drei, Geolocation API e CSS Modules. O ambiente da escola é representado
              por um modelo 3D em formato GLB, utilizado como base para a navegação.
            </span>
          </div>

        </div>

      </div>

      {/* Botão */}
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
import React, { useState } from "react";
import { FaQuestion, FaLinkedin, FaGithub, FaGlobeAmericas, FaGamepad } from "react-icons/fa";
import CountryFlag from "react-country-flag";
import "./Enterence.css";
import colors from "../styles/Colors.js";
import { t, setLanguage, currentLang } from "../locales/lang.js";

import { useNavigate } from "react-router-dom";

const Enterence = () => {
  const navigate = useNavigate();
  const [lang, setLang] = useState(currentLang);

  const githubLink = "https://github.com/SgrAhmet";
  const linkedinLink = "https://www.linkedin.com/in/ahmet-aydos/";

  const openLink = (link) => {
    window.open(link, "_blank");
  };


  const availableLangs = ["tr", "us", "es", "fr", "de"];

  const changeLang = () => {
    const currentIndex = availableLangs.indexOf(lang);
    const nextIndex = (currentIndex + 1) % availableLangs.length; // döngüsel
    const nextLang = availableLangs[nextIndex];
    setLang(nextLang);
    setLanguage(nextLang);
  };

  return (
    <div className="enterence-container">
      <button className="flag-button" onClick={changeLang}>
        <CountryFlag countryCode={lang} svg style={{ width: "32px", height: "32px" }} />
      </button>

      <button className="info-button" onClick={() => navigate("/Tutorial")}>
        <FaQuestion size={32} color={colors.brown} />
      </button>

      <h1 className="h1-text">PolyBank</h1>

      <button
        className="custom-btn brown-btn"
        // style={{ backgroundColor: colors.brown }}
        onClick={() => navigate("/OnlineEnterence")}
      >
        <FaGlobeAmericas size={24} color={colors.darkGreen} />
        <span className="btn-text" style={{ color: colors.darkGreen }}>
          {t("online")}
        </span>
        <FaGlobeAmericas size={24} color={colors.darkGreen} />
      </button>

      <button
        className="bottom-btn"
        onClick={() => navigate("/Main")}
      >
        <FaGamepad size={24} color={colors.brown} />
        <span className="btn-text" style={{ color: colors.brown }}>
          {t("offline")}
        </span>
        <FaGamepad size={24} color={colors.brown} />
      </button>

      <div className="footer">
        <FaLinkedin
          size={40}
          color={colors.brown}
          onClick={() => openLink(linkedinLink)}
          style={{ cursor: "pointer" }}
        />
        <FaGithub
          size={40}
          color={colors.brown}
          onClick={() => openLink(githubLink)}
          style={{ cursor: "pointer" }}
        />
      </div>
    </div>
  );
};

export default Enterence;

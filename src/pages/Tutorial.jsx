import { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import styles from "./Tutorial.module.css";
import { t } from "../locales/lang.js";

const Tutorial = () => {
  const [textIndex, setTextIndex] = useState(0);

  const tutorialTexts = [
    {
      title: t("tutorial_addPerson_title"),
      desc: t("tutorial_addPerson_desc"),
    },
    {
      title: t("tutorial_transferMoney_title"),
      desc: t("tutorial_transferMoney_desc"),
    },
    {
      title: t("tutorial_setBanknote_title"),
      desc: t("tutorial_setBanknote_desc"),
    },
    {
      title: t("tutorial_resetGame_title"),
      desc: t("tutorial_resetGame_desc"),
    },
    {
      title: t("tutorial_watchOnline_title"),
      desc: t("tutorial_watchOnline_desc"),
    },
  ];

  const handleTextIndex = (next) => {
    if (next) setTextIndex((i) => (i === 4 ? 0 : i + 1));
    else setTextIndex((i) => (i === 0 ? 4 : i - 1));
  };

  return (
    <div className={styles.container}>
      <button
        className={styles.arrowButton}
        onClick={() => handleTextIndex(false)}
      >
        <FaChevronLeft size={40} />
      </button>

      <div className={styles.contentArea}>
        <h2 className={styles.titleText}>{tutorialTexts[textIndex].title}</h2>
        <p className={styles.contentText}>{tutorialTexts[textIndex].desc}</p>
      </div>

      <button
        className={styles.arrowButton}
        onClick={() => handleTextIndex(true)}
      >
        <FaChevronRight size={40} />
      </button>

      <span className={styles.index}>{textIndex + 1}</span>
    </div>
  );
};

export default Tutorial;

import React from "react";
import {
  FaPlus,
  FaMinus,
  FaTrashAlt,
  FaUniversity,
  FaInfinity,
  FaUser,
} from "react-icons/fa";
import "./PlayerListItem.css";
import { t } from "../locales/lang";
import colors from "../styles/Colors.js";

const PlayerListItem = ({
  index,
  name,
  money,
  selecteds,
  setSelecteds,
  gamers,
  setGamers,
  isEditVisible,
  history,
  setHistory,
  spectator,
}) => {
  const changePozitive = () =>
    setSelecteds({ ...selecteds, pozitif: index });

  const changeNegative = () =>
    setSelecteds({ ...selecteds, negatif: index });

  const deleteGamer = () => {
    setHistory([
      { pozitif: name, negatif: "Banka", quantity: "deleteGamer" },
      ...history,
    ]);
    setGamers((prev) => prev.filter((_, i) => i !== index));
  };

  const isPozitif = selecteds.pozitif === index;
  const isNegatif = selecteds.negatif === index;

  const displayName = index === 0 && name === "Banka" ? t("bank") : name;

  return (
    <div className="pli-container" style={{ backgroundColor: colors.brown }}>
      <div className="pli-icon">
        {index === 0 ? (
          <FaUniversity size={32} color={colors.white} />
        ) : (
          <FaUser size={32} color={colors.white} />
        )}
      </div>

      <div className="pli-name">
        <span className="pli-text">{displayName}</span>
      </div>

      <div className="pli-money">
        {index === 0 ? (
          <div className="pli-infinity">
            <FaInfinity size={28} color={colors.black} />
            <span className="pli-text">$</span>
          </div>
        ) : (
          // <span className="pli-text">{money} $</span>
          <span className="pli-text">{money.toString().length >= 7 ? `${money / 1000000}m` : money.toString().length >= 5 ? `${money / 1000}k` : money } $</span>
        )}
      </div>

      {!spectator && !isEditVisible && (
        <div className="pli-buttons">
          <button
            className={`pli-btn ${isPozitif ? "pozitif" : ""}`}
            onClick={changePozitive}
          >
            <FaPlus size={18} color={colors.white} />
          </button>

          <button
            className={`pli-btn ${isNegatif ? "negatif" : ""}`}
            onClick={changeNegative}
          >
            <FaMinus size={18} color={colors.white} />
          </button>
        </div>
      )}

      {index !== 0 && isEditVisible && (
        <button className="pli-delete" onClick={deleteGamer}>
          <FaTrashAlt size={24} color={colors.lightRed} />
        </button>
      )}
    </div>
  );
};

export default PlayerListItem;

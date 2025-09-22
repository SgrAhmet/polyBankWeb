import React, { useState, useEffect } from "react";
import "./Main.css";
// import "./Main.css"
import {
  FaHistory,
  FaUndoAlt,
  FaPencilAlt,
  FaLongArrowAltRight,
  FaUserPlus,
  FaMoneyBillWave,
} from "react-icons/fa";
import { IoPersonAdd, IoPersonRemove } from "react-icons/io5";
import colors from "../styles/Colors.js";
import PlayerListItem from "../components/PlayerListItem";
import { t, setLanguage, currentLang } from "../locales/lang.js";

const Main = () => {
  const [isEditVisible, setIsEditVisible] = useState(false);
  const [newGamerName, setNewGamerName] = useState("");
  const [selecteds, setSelecteds] = useState({ pozitif: null, negatif: null });
  const [moneyQuantity, setMoneyQuantity] = useState("");
  const [gamers, setGamers] = useState([{ name: "Banka", money: "∞" }]);
  const [history, setHistory] = useState([]);
  const [moneybills, setMoneybills] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  // Ses nesnesi
  const [sound, setSound] = useState(null);

  // localStorage read
  const getAsyncItem = () => {
    try {
      const offlineGamers = localStorage.getItem("offlineGamers");
      const offlineHistory = localStorage.getItem("offlineHistory");
      const offlineMoneyBills = localStorage.getItem("offlineMoneyBills");

      if (offlineGamers && offlineHistory) {
        setGamers(JSON.parse(offlineGamers));
        setHistory(JSON.parse(offlineHistory));
      }

      if (offlineMoneyBills) {
        setMoneybills(JSON.parse(offlineMoneyBills));
      } else {
        setMoneybills([10, 20, 50, 100, 200, 500, 1000, 5000]);
      }
    } catch (err) {
      console.error("localStorage read error", err);
    }
  };

  // localStorage write
  const setAsyncItem = () => {
    try {
      localStorage.setItem("offlineGamers", JSON.stringify(gamers));
      localStorage.setItem("offlineHistory", JSON.stringify(history));
    } catch (err) {
      console.error("localStorage save error", err);
    }
  };

  useEffect(() => {
    getAsyncItem();
  }, []);

  useEffect(() => {
    setAsyncItem();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gamers, history]);

  const addNewGamer = () => {
    if (newGamerName.trim() !== "") {
      setGamers([...gamers, { name: newGamerName.trim(), money: 0 }]);
      setHistory([
        { pozitif: newGamerName.trim(), negatif: "Banka", quantity: "newGamer" },
        ...history,
      ]);
      setNewGamerName("");
    }
  };

  const handleMoneyBill = (value) => {
    // moneyQuantity may be string number or "" — convert carefully
    const current = moneyQuantity === "" ? 0 : Number(moneyQuantity);
    setMoneyQuantity((current + Number(value)).toString());
  };

  const playSound = () => {
    try {
      const a = new Audio("/soundEffect2.mp3"); // public klasöre koy
      setSound(a);
      a.play().catch(() => {});
    } catch (err) {
      console.warn("Audio play error", err);
    }
  };

  const transferMoney = () => {
    const amount = Number(moneyQuantity);
    if (amount > 0 && selecteds.pozitif !== selecteds.negatif) {
      if (selecteds.pozitif !== null && selecteds.negatif !== null) {
        const updatedGamers = gamers.map((player, index) => {
          if (player.name === "Banka") return player;
          if (index === selecteds.pozitif) {
            return { ...player, money: Number(player.money) + amount };
          }
          if (index === selecteds.negatif) {
            return { ...player, money: Number(player.money) - amount };
          }
          return player;
        });

        setGamers(updatedGamers);
        setMoneyQuantity("");
        playSound();

        const historyItem = {
          pozitif: gamers[selecteds.pozitif].name,
          negatif: gamers[selecteds.negatif].name,
          quantity: amount,
        };
        setHistory([historyItem, ...history]);
        setSelecteds({ pozitif: null, negatif: null });
      }
    } else {
      // hatalı giriş — istersen uyarı göster
      // alert(t("invalidOperation") || "Invalid operation");
    }
  };

  const handleHistory = () => {
    setModalVisible(true);
  };

  const resetGame = () => {
    setGamers([{ name: "Banka", money: "∞" }]);
    setHistory([]);
    setMoneybills([10, 20, 50, 100, 200, 500, 1000, 5000]);
    setMoneyQuantity("");
    // temizle localStorage
    localStorage.removeItem("offlineGamers");
    localStorage.removeItem("offlineHistory");
    localStorage.removeItem("offlineMoneyBills");
  };

  const handleReset = () => {
    const ok = window.confirm(`${t("areYouSureToResetGame") || "Are you sure?"}`);
    if (ok) resetGame();
  };

  useEffect(() => {
    if (moneybills.length > 0) {
      try {
        localStorage.setItem("offlineMoneyBills", JSON.stringify(moneybills));
      } catch (err) {
        console.error(err);
      }
    }
  }, [moneybills]);

  const handleLongMoneyBill = (value, idx) => {
    // Web'de double click ile düzenleme tetikliyoruz
    if (moneyQuantity !== "") {
      if (moneyQuantity.toString().length < 6) {
        const newMoneyBills = [...moneybills];
        newMoneyBills[idx] = Number(moneyQuantity);
        setMoneybills(newMoneyBills);
        setMoneyQuantity("");
      } else {
        window.alert(`${t("max5Digit") || "Max 5 digits"}`);
      }
    }
  };

  return (
    <div className="main-container">
      {/* Banner */}
      <div className="banner">
        <div className="title">{/* H1 */}<span className="h1Text">PolyBank</span></div>

        <div className="bannerBtnArea">
          <button className="iconBtn" onClick={handleHistory} title={t("history")}>
            <FaHistory size={22} color={colors.white} />
          </button>

          <button
            className="iconBtn"
            onClick={() => {
              setSelecteds({ pozitif: null, negatif: null });
              setMoneyQuantity("");
            }}
            onDoubleClick={handleReset}
            title={`${t("resetShort") || "Reset (double click to confirm)"}`}
          >
            <FaUndoAlt size={20} color={colors.white} />
          </button>

          <button className="iconBtn" onClick={() => setIsEditVisible(!isEditVisible)}>
            <FaPencilAlt size={20} color={isEditVisible ? colors.lightGreen : colors.white} />
          </button>
        </div>
      </div>

      {/* Modal */}
      {modalVisible && (
        <div className="modalOverlay" onClick={() => setModalVisible(false)}>
          <div className="modalCard" onClick={(e) => e.stopPropagation()}>
            <button className="modalClose" onClick={() => setModalVisible(false)}>
              ✕
            </button>

            <div className="modalBody">
              {history.length === 0 && <div className="emptyHistory">{t("noHistory") || "No history"}</div>}
              {history.map((e, i) => {
                if (e.quantity === "newGamer" || e.quantity === "deleteGamer") {
                  return (
                    <div className="modalItem" key={i}>
                      <div className="modalItemSep">{e.negatif === "Banka" ? t("bank") : e.negatif}</div>
                      <div className="modalItemSep iconCenter" style={{ width: "15%" }}>
                        {e.quantity === "newGamer" ? (
                          <IoPersonAdd size={28} color={colors.darkGreen} />
                        ) : (
                          <IoPersonRemove size={28} color={colors.darkGreen} />
                        )}
                      </div>
                      <div className="modalItemSep">{e.pozitif === "Banka" ? t("bank") : e.pozitif}</div>
                    </div>
                  );
                } else {
                  return (
                    <div className="modalItem" key={i}>
                      <div>{e.negatif === "Banka" ? t("bank") : e.negatif}</div>
                      <div>{e.quantity} $</div>
                      <FaLongArrowAltRight size={20} color={colors.darkGreen} />
                      <div>{e.pozitif === "Banka" ? t("bank") : e.pozitif}</div>
                    </div>
                  );
                }
              })}
            </div>
          </div>
        </div>
      )}

      {/* Content (scrollable) */}
      <div className="content">
        <div className="moneyArea">
          <div className="moneyInputArea">
            <input
              className="input"
              placeholder={t("enterMoney")}
              value={moneyQuantity.toString()}
              onChange={(ev) => {
                const fixed = ev.target.value.replace(",", ".");
                const valid = /^(\d+(\.\d*)?)?$/.test(fixed);
                if (valid || fixed === "") setMoneyQuantity(fixed);
              }}
              inputMode="decimal"
            />
            <button className="iconBtn" onClick={transferMoney} title={t("transfer")}>
              <FaMoneyBillWave size={26} color={colors.white} />
            </button>
          </div>

          <div className="moneyBillArea">
            <div className="moneyBillRow">
              {moneybills?.slice(0, 4).map((e, i) => (
                <div
                  className="moneyBill"
                  key={i}
                  onClick={() => handleMoneyBill(e)}
                  onDoubleClick={() => handleLongMoneyBill(e, i)}
                  // onContextMenu={(ev) => {
                  //   ev.preventDefault();
                  //   handleLongMoneyBill(e, i);
                  // }}
                >
                  <div className="moneyCircle leftTop" />
                  <div className="moneyCircle rightTop" />
                  <div className="moneyCircle leftBottom" />
                  <div className="moneyCircle rightBottom" />
                  <div className="h4Text">{e}</div>
                </div>
              ))}
            </div>

            <div className="moneyBillRow">
              {moneybills.slice(4, 8).map((e, i) => (
                <div
                  className="moneyBill"
                  key={i + 4}
                  onClick={() => handleMoneyBill(e)}
                  onDoubleClick={() => handleLongMoneyBill(e, i + 4)}
                >
                  <div className="moneyCircle leftTop" />
                  <div className="moneyCircle rightTop" />
                  <div className="moneyCircle leftBottom" />
                  <div className="moneyCircle rightBottom" />
                  <div className="h4Text">{e}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Edit Area */}
        {isEditVisible && (
          <div className="editArea">
            <input
              className="input"
              value={newGamerName}
              onChange={(e) => setNewGamerName(e.target.value)}
              placeholder={t("enterName")}
            />
            <button className="iconBtn" onClick={addNewGamer}>
              <FaUserPlus size={24} color={colors.white} />
            </button>
          </div>
        )}

        {/* Player list */}
        <div className="playerArea">
          {gamers.map((player, i) => (
            <PlayerListItem
              key={i}
              index={i}
              name={player.name}
              money={player.money}
              selecteds={selecteds}
              setSelecteds={setSelecteds}
              gamers={gamers}
              setGamers={setGamers}
              isEditVisible={isEditVisible}
              history={history}
              setHistory={setHistory}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Main;

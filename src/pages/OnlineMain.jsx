// src/pages/OnlineMain.jsx
import React, { useState, useEffect, useRef } from "react";
import {
  FaHistory,
  FaUndoAlt,
  FaUserEdit,
  FaMoneyBillWave,
  FaUserPlus,
  FaTimes,
  FaArrowRight,
} from "react-icons/fa";
import { IoPersonAdd, IoPersonRemove } from "react-icons/io5";
import PlayerListItem from "../components/PlayerListItem";
import colors from "../styles/Colors";
import { t } from "../locales/lang";
import { db } from "../firebaseConfig";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { useLocation, useParams } from "react-router-dom";

import styles from "./OnlineMain.module.css"; // CSS'i sonra sağlayacaksın

const OnlineMain = () => {
  // roomId ve spectator'ü önce location.state (navigate ile gönderirsen) den al,
  // yoksa URL paramı (useParams) ile al.
  const location = useLocation();
  const params = useParams();
  const stateRoom = location?.state?.roomId;
  const stateSpectator = location?.state?.spectator;

  const roomId = stateRoom ?? params.roomId ?? null;
  // spectator olabilir boolean ya da "true"/"false" string; normalize edelim
  const spectatorFromParams = params.spectator;
  const spectator =
    typeof stateSpectator === "boolean"
      ? stateSpectator
      : spectatorFromParams !== undefined
      ? spectatorFromParams === "true"
      : false;

      console.log(spectator)

  // component state
  const [isEditVisible, setIsEditVisible] = useState(false);
  const [newGamerName, setNewGamerName] = useState("");
  const [selecteds, setSelecteds] = useState({ pozitif: null, negatif: null });
  const [moneyQuantity, setMoneyQuantity] = useState("");
  const [gamers, setGamers] = useState([]);
  const [history, setHistory] = useState([]);
  const [moneybills, setMoneybills] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  // Blink state (spectator için)
  const [blinkOn, setBlinkOn] = useState(false);
  const blinkTimerRef = useRef(null);

  // Ses (web): public klasörüne koyduğun soundEffect2.mp3 dosyasını çalar
  const soundRef = useRef(null);
  const playSound = async () => {
    try {
      if (!soundRef.current) {
        soundRef.current = new Audio("/soundEffect2.mp3"); // public/soundEffect2.mp3
      }
      await soundRef.current.play();
    } catch (err) {
      // sessiz hata
      // console.warn("Sound play error:", err);
    }
  };

  // localStorage yerine kullanılan fonksiyonlar (AsyncStorage yerine)
  const getAsyncItem = () => {
    try {
      const offlineMoneyBills = localStorage.getItem("offlineMoneyBills");
      if (offlineMoneyBills != null) {
        setMoneybills(JSON.parse(offlineMoneyBills));
      } else {
        setMoneybills([10, 20, 50, 100, 200, 500, 1000, 5000]);
      }
    } catch (error) {
      console.log("getAsyncItem error:", error);
      setMoneybills([10, 20, 50, 100, 200, 500, 1000, 5000]);
    }
  };

  const setAsyncMoneyBills = () => {
    try {
      localStorage.setItem("offlineMoneyBills", JSON.stringify(moneybills));
    } catch (err) {
      console.log("setAsyncMoneyBills error:", err);
    }
  };

  useEffect(() => {
    getAsyncItem();
    // cleanup on unmount
    return () => {
      if (blinkTimerRef.current) {
        clearInterval(blinkTimerRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (moneybills && moneybills.length > 0) {
      setAsyncMoneyBills();
    }
  }, [moneybills]);

  // Firestore onSnapshot dinlemesi (document)
  useEffect(() => {
    if (!roomId) return; // roomId yoksa bekle

    const docRef = doc(db, "rooms", roomId);
    const unsubscribe = onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const d = docSnap.data();
          // setData gibi, doğrudan gamers/history set edelim
          setGamers(Array.isArray(d.gamers) ? d.gamers : []);
          setHistory(Array.isArray(d.history) ? d.history : []);
          // spectator varsa bir blink efekti tetikleyelim
          if (spectator) {
            // kısa blink: 200ms off/on (aynı mantık)
            setBlinkOn(true);
            if (blinkTimerRef.current) {
              clearTimeout(blinkTimerRef.current);
            }
            blinkTimerRef.current = setTimeout(() => setBlinkOn(false), 400);
          }
        } else {
          console.log("No such document!");
        }
      },
      (err) => {
        console.error("onSnapshot error:", err);
      }
    );

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId]);

  // update document when gamers/history change (but not on initial empty)
  const updateDocument = async (g, h) => {
    if (!roomId) return;
    try {
      const orderDocRef = doc(db, "rooms", roomId);
      await updateDoc(orderDocRef, { gamers: g, history: h });
    } catch (error) {
      console.log("updateDocument error:", error);
    }
  };

  // Only update firestore when local gamers/history changed and there is at least an initial gamer
  useEffect(() => {
    if (!Array.isArray(gamers) || !Array.isArray(history)) return;
    if (gamers[0]) {
      updateDocument(gamers, history);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gamers, history]);

  // add new gamer (keeps same logic)
  const addNewGamer = () => {
    if (newGamerName.trim() !== "") {
      const newGamers = [...gamers, { name: newGamerName, money: 0 }];
      const newHistory = [
        { pozitif: newGamerName, negatif: "Banka", quantity: "newGamer" },
        ...history,
      ];
      setGamers(newGamers);
      setHistory(newHistory);
      setNewGamerName("");
    }
  };

  const handleMoneyBill = (val) => {
    setMoneyQuantity((prev) => {
      const numPrev = Number(prev) || 0;
      return String(numPrev + val);
    });
  };

  const transferMoney = () => {
    if (Number(moneyQuantity) > 0 && selecteds.pozitif !== selecteds.negatif) {
      if (selecteds.pozitif != null && selecteds.negatif != null) {
        const updatedGamers = gamers.map((player, index) => {
          if (player.name === "Banka") {
            return player;
          }
          if (index === selecteds.pozitif) {
            return {
              ...player,
              money: Number(player.money) + Number(moneyQuantity),
            };
          }
          if (index === selecteds.negatif) {
            return {
              ...player,
              money: Number(player.money) - Number(moneyQuantity),
            };
          }
          return player;
        });

        setGamers(updatedGamers);
        setMoneyQuantity(""); // reset
        playSound();
      }

      const historyItem = {
        pozitif: gamers[selecteds.pozitif]?.name ?? "Unknown",
        negatif: gamers[selecteds.negatif]?.name ?? "Unknown",
        quantity: moneyQuantity,
      };
      setHistory((prev) => [historyItem, ...prev]);
      setSelecteds({ pozitif: null, negatif: null });
    } else {
      // optional: show a small alert
      // window.alert("Invalid transfer");
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
  };

  const handleReset = () => {
    const confirmed = window.confirm(`${t("areYouSureToResetGame")}`);
    if (confirmed) {
      resetGame();
    }
  };

  const handleLongMoneyBill = (val, idx) => {
    if (moneyQuantity !== "") {
      if (moneyQuantity.toString().length < 10) {
        const newMoneyBills = [...moneybills];
        newMoneyBills[idx] = Number(moneyQuantity);
        setMoneybills(newMoneyBills);
        setMoneyQuantity("");
      } else {
        window.alert(t("max5Digit"));
      }
    }
  };

  const handleMouseDown = (e, i) => {
    e.persist();
    e.target.pressTimer = setTimeout(() => {
      handleLongMoneyBill(e, i); // uzun basma olayı
    }, 500); // 500ms basılı tutunca tetiklenir
  };
  
  const handleMouseUp = (e) => {
    clearTimeout(e.target.pressTimer);
  };
  // UI
  return (
    <div
      className={styles.container}
      style={{
        // blink effect: toggle border/glow or background when blinkOn true
        backgroundColor: blinkOn ? colors.white : colors.darkGreen,
      }}
    >
      {/* Banner */}
      <header className={styles.banner}>
        <h1 className={styles.h1Text}>PolyBank</h1>
        <div className={styles.bannerBtnArea}>
          <button className={styles.iconBtn} onClick={() => handleHistory()}>
            <FaHistory size={20} color={colors.white} />
          </button>

          {/* reset / edit buttons hidden for spectator */}
          {!spectator && (
            <>
              <button
                className={styles.iconBtn}
                onClick={() => {
                  setSelecteds({ pozitif: null, negatif: null });
                  setMoneyQuantity("");
                }}
                onDoubleClick={handleReset} // web: double click to mimic RN onLongPress; user can change
                title={t("resetGame")}
              >
                <FaUndoAlt size={20} color={colors.white} />
              </button>

              <button
                className={styles.iconBtn}
                onClick={() => setIsEditVisible((s) => !s)}
                title={t("edit")}
              >
                <FaUserEdit
                  size={20}
                  color={isEditVisible ? colors.lightGreen : colors.white}
                />
              </button>
            </>
          )}
        </div>
      </header>

      {/* Modal */}
      {modalVisible && (
        <div className={styles.modalContainer}>
          <div className={styles.modalCard}>
            <button
              className={styles.modalCloseButton}
              onClick={() => setModalVisible(false)}
            >
              <FaTimes size={24} color={colors.lightRed} />
            </button>

            <div className={styles.modalBody}>
              {Array.isArray(history) &&
                history.map((e, i) => {
                  if (e.quantity === "newGamer" || e.quantity === "deleteGamer") {
                    return (
                      <div className={styles.modalItem} key={i}>
                        <div className={styles.modalItemSep}>
                          <span>
                            {e.negatif === "Banka" ? t("bank") : e.negatif}
                          </span>
                        </div>

                        <div
                          className={styles.modalItemSep}
                          style={{ width: "15%" }}
                        >
                          {e.quantity === "newGamer" ? (
                            <IoPersonAdd size={20} color={colors.darkGreen} />
                          ) : (
                            <IoPersonRemove
                              size={20}
                              color={colors.darkGreen}
                            />
                          )}
                        </div>

                        <div className={styles.modalItemSep}>
                          <span>
                            {e.pozitif === "Banka" ? t("bank") : e.pozitif}
                          </span>
                        </div>
                      </div>
                    );
                  } else {
                    return (
                      <div className={styles.modalItem} key={i}>
                        <span>
                          {e.negatif === "Banka" ? t("bank") : e.negatif}
                        </span>
                        <span>{e.quantity} $</span>
                        <FaArrowRight size={18} color={colors.darkGreen} />
                        <span>
                          {e.pozitif === "Banka" ? t("bank") : e.pozitif}
                        </span>
                      </div>
                    );
                  }
                })}
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className={styles.scrollContainer}>
        <div className={styles.moneyInputArea}>
          <div className={styles.h2Text}>
            {t("roomId")} : {roomId ?? t("notCreatedYet")}
          </div>
        </div>

        {/* Money area (hide if spectator) */}
        {!spectator && (
          <div className={styles.moneyArea}>
            <div className={styles.moneyInputArea}>
              <input
                className={styles.input}
                placeholder={t("enterMoney")}
                // value={moneyQuantity}
              // value={moneyQuantity.toString().length >= 7 ? `${moneyQuantity / 1000000}m` : moneyQuantity.toString().length >= 5 ? `${moneyQuantity / 1000}k` : moneyQuantity.toString() }
              value={moneyQuantity.toString().length >= 7 ? `${(moneyQuantity / 1000000)}m` : moneyQuantity.toString().length >= 5 ? `${(moneyQuantity / 1000)}k` : moneyQuantity.toString() }

                onChange={(ev) => {
                  const fixed = ev.target.value.replace(",", ".");
                  const valid = fixed.match(/^(\d+(\.\d*)?)?$/);
                  if (valid || fixed === "") setMoneyQuantity(fixed);
                }}
                inputMode="decimal"
              />
              <button
                className={styles.iconBtn}
                onClick={() => transferMoney()}
                title={t("transfer")}
              >
                <FaMoneyBillWave size={20} color={colors.white} />
              </button>
            </div>

            <div className={styles.moneyBillArea}>
              <div className={styles.moneyBillRow}>
                {moneybills?.slice(0, 4).map((e, i) => (
                  <button
                    key={i}
                    className={styles.moneyBill}
                    onClick={() => handleMoneyBill(e)}

                    // onMouseDown={(e) => handleMouseDown(e, i)}
                    // onMouseUp={handleMouseUp}
                    // onMouseLeave={handleMouseUp} 

                    onMouseDown={(e) => handleMouseDown(e, i)}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onTouchStart={(e) => handleMouseDown(e, i)}   // mobil
                    onTouchEnd={handleMouseUp}                    // mobil
                    onTouchCancel={handleMouseUp}                 // mobil (parmak kayarsa iptal et)
                  >
                    <div className={styles.moneyCircle} style={{ left: -10, top: -10 }} />
                    <div className={styles.moneyCircle} style={{ right: -10, top: -10 }} />
                    <div className={styles.moneyCircle} style={{ left: -10, bottom: -10 }} />
                    <div className={styles.moneyCircle} style={{ right: -10, bottom: -10 }} />
                    <span className={styles.moneyText}>{e.toString().length >= 7 ? `${e / 1000000}m` : e.toString().length >= 5 ? `${e / 1000}k` : e }</span>
              

                  </button>
                ))}
              </div>

              <div className={styles.moneyBillRow}>
                {moneybills?.slice(4, 8).map((e, i) => (
                  <button
                    key={i}
                    className={styles.moneyBill}
                    onClick={() => handleMoneyBill(e)}

                    // onMouseDown={(e) => handleMouseDown(e, i+4)}
                    // onMouseUp={handleMouseUp}
                    // onMouseLeave={handleMouseUp} 

                    onMouseDown={(e) => handleMouseDown(e, i+4)}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onTouchStart={(e) => handleMouseDown(e, i+4)}   // mobil
                    onTouchEnd={handleMouseUp}                    // mobil
                    onTouchCancel={handleMouseUp}                 // mobil (parmak kayarsa iptal et)
                  >
                    <div className={styles.moneyCircle} style={{ left: -10, top: -10 }} />
                    <div className={styles.moneyCircle} style={{ right: -10, top: -10 }} />
                    <div className={styles.moneyCircle} style={{ left: -10, bottom: -10 }} />
                    <div className={styles.moneyCircle} style={{ right: -10, bottom: -10 }} />
                    <span className={styles.moneyText}>{e.toString().length >= 7 ? `${e / 1000000}m` : e.toString().length >= 5 ? `${e / 1000}k` : e }</span>

                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Edit area */}
        {isEditVisible && (
          <div className={styles.editArea}>
            <input
              className={styles.input}
              value={newGamerName}
              onChange={(ev) => setNewGamerName(ev.target.value)}
              placeholder={t("enterName")}
            />
            <button className={styles.iconBtn} onClick={addNewGamer}>
              <FaUserPlus size={18} color={colors.white} />
            </button>
          </div>
        )}

        {/* Player list */}
        <div className={styles.playerArea}>
          {Array.isArray(gamers) &&
            gamers.map((player, i) => (
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
                spectator={spectator}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default OnlineMain;

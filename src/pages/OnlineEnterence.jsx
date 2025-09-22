import React, { useState, useEffect } from "react";
import "./OnlineEnterence.css";
import colors from "../styles/Colors.js";
import {
  collection,
  getDoc,
  setDoc,
  doc,
} from "firebase/firestore";
// import { db } from "../../firebaseConfig.js";

import { t, setLanguage, currentLang } from "../locales/lang.js";
import { db } from "../firebaseConfig.js";
import { useNavigate } from "react-router-dom";

const OnlineEnterence = () => {
const navigate = useNavigate();

  const [test, setTest] = useState("Waiting...");
  const [asyncRoomId, setAsyncRoomId] = useState();
  const [inputRoomId, setInputRoomId] = useState("");

  // --- LocalStorage yerine web'de localStorage kullanılıyor ---
  const getAsyncRoomId = async () => {
    const roomId = localStorage.getItem("asyncRoomId");
    if (roomId) {
      setAsyncRoomId(roomId);
    } else {
      console.warn("RoomId is not Valid");
    }
  };

  const setAsyncRoomIdFunc = async (newRoomId) => {
    try {
      localStorage.setItem("asyncRoomId", newRoomId);
      console.log("LocalStorage newRoomId added");
    } catch (error) {
      console.warn(error);
    }
  };

  useEffect(() => {
    getAsyncRoomId();
  }, []);

  const generateRoomId = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const createRoom = async () => {
    if (!asyncRoomId) {
      let roomId;
      let roomRef;
      let exists = true;

      while (exists) {
        roomId = generateRoomId();
        roomRef = doc(db, "rooms", roomId);
        const docSnap = await getDoc(roomRef);
        exists = docSnap.exists();
        console.log("Oda ID:", roomId, "| Var mı?", exists);
      }

      await setDoc(roomRef, {
        gamers: [{ name: "Banka", money: "∞" }],
        history: [],
        createdAt: Date.now(),
      });

      console.log("Oda oluşturuldu:", roomId);
      setTest("Oda: " + roomId);

      setAsyncRoomIdFunc(roomId);
      setAsyncRoomId(roomId);
      navigate("/OnlineMain", { state: { roomId } });
      console.log("1-1roomId is :", roomId);

    } else {
      // navigate("/OnlineMain", { roomId: asyncRoomId, spectator: false });
      navigate("/OnlineMain", { state: { roomId: asyncRoomId, spectator: false } });
      console.log("1-2roomId is :", asyncRoomId);

    }
  };

  const enterRoom = async () => {
    if (
      inputRoomId.trim() === "" ||
      inputRoomId.trim().length !== 6
    ) {
      alert(`${t("invalidRoomId")}\n${t("pleaseEnterValidRoomId")}`);
    } else {
      try {
        let roomRef = doc(db, "rooms", inputRoomId);
        const docSnap = await getDoc(roomRef);
        const exists = docSnap.exists();
        console.log("Oda ID:", inputRoomId, "| Var mı?", exists);

        if (exists) {
          navigate("/OnlineMain", { state: { roomId: inputRoomId, spectator: true } });
          console.log("1roomId is :", inputRoomId);
          // console.log("spectator is :", true);
          setInputRoomId("");
        } else {
          alert(`${t("cantFindRoomId")}\n${t("pleaseEnterValidRoomId")}`);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div className="online-container">
      <h1 className="h2-text">
        {t("yourRoomId")}:{" "}
        {asyncRoomId === undefined ? t("notCreatedYet") : asyncRoomId}
      </h1>

      <button className="createRoom-btn" onClick={createRoom}>
        <span style={{ color: colors.brown }}>{t("createRoom")}</span>
      </button>

      <button className="custom-btn brown-btn" onClick={enterRoom}>
        <span style={{ color: colors.darkGreen }}>{t("enterRoom")}</span>
      </button>

      <input
        type="text"
        maxLength={6}
        value={inputRoomId}
        placeholder={t("enterRoomId")}
        className="room-input"
        onChange={(e) => setInputRoomId(e.target.value)}
      />
    </div>
  );
};

export default OnlineEnterence;



export const strings = {
    us: {
      online: "ONLINE",
      offline: "OFFLINE",
      invalidRoomId: "Invalid Room ID",
      pleaseEnterValidRoomId: "Please enter a valid Room ID",
      cantFindRoomId: "Room ID not found",
      createRoom: "Create Room",
      enterRoom: "Join Room",
      enterRoomId: "Enter Room ID",
      yourRoomId: "Your Room ID",
      notCreatedYet: "Not created yet",
      resetGame: "Reset Game",
      areYouSureToResetGame: "Are you sure you want to reset the game?",
      yes: "Yes",
      no: "No",
      error: "Error",
      max5Digit: "Numbers can be a maximum of 5 digits",
      enterMoney: "Enter amount",
      enterName: "Enter name...",
      bank: "Bank",
      roomId: "Room ID",
      
      tutorial_addPerson_title: "Add Person",
      tutorial_addPerson_desc: "Tap the pencil icon to enter edit mode. You can add or remove people there.",
  
      tutorial_transferMoney_title: "Transfer Money",
      tutorial_transferMoney_desc: "Enter amount or choose a banknote. Use - to withdraw, + to give money. Press 'Transfer' to complete.",
  
      tutorial_setBanknote_title: "Set Banknote Value",
      tutorial_setBanknote_desc: "Write the value and long press a banknote to change its preset value.",
  
      tutorial_resetGame_title: "Reset Game",
      tutorial_resetGame_desc: "Press the restart button to reset people and banknote settings.",
  
      tutorial_watchOnline_title: "Watch Online Game",
      tutorial_watchOnline_desc: "Use your friend’s room ID to watch the game live or see all past actions with the 'History' button."
    },
    tr: {
      online: "ÇEVRİMİÇİ",
      offline: "ÇEVRİMDIŞI",
      invalidRoomId: "Geçersiz Oda Numarası",
      pleaseEnterValidRoomId: "Lütfen geçerli bir oda numarası girin",
      cantFindRoomId: "Oda numarası bulunamadı",
      createRoom: "Oda Oluştur",
      enterRoom: "Odaya Katıl",
      enterRoomId: "Oda Numarası Gir",
      yourRoomId: "Oda Numarası",
      notCreatedYet: "Henüz oluşturulmadı",
      resetGame: "Oyunu Sıfırla",
      areYouSureToResetGame: "Oyunu sıfırlamak istediğinizden emin misiniz?",
      yes: "Evet",
      no: "Hayır",
      error: "Hata",
      max5Digit: "Sayılar en fazla 5 haneli olabilir",
      enterMoney: "Para miktarı gir",
      enterName: "İsim gir...",
      bank: "Banka",
      roomId: "Oda Numarası",
  
      tutorial_addPerson_title: "Kişi Ekleme",
      tutorial_addPerson_desc: "Kalem ikonuna tıklayarak düzenleme modunu açıp kişi ekleyebilir veya silebilirsiniz.",
  
      tutorial_transferMoney_title: "Para Aktarma",
      tutorial_transferMoney_desc: "Tutarı yazın veya hazır banknot seçin. Parayı - ile çekin, + ile aktarın. 'Transfer' butonuna basarak işlemi tamamlayın.",
  
      tutorial_setBanknote_title: "Para Değeri Ayarlama",
      tutorial_setBanknote_desc: "İstediğiniz miktarı yazıp banknota uzun basarak o banknotun değerini değiştirebilirsiniz.",
  
      tutorial_resetGame_title: "Oyunu Sıfırla",
      tutorial_resetGame_desc: "Restart tuşuyla kişileri ve banknot ayarlarını sıfırlayabilirsiniz.",
  
      tutorial_watchOnline_title: "Online Oyunu İzleme",
      tutorial_watchOnline_desc: "Arkadaşınızın oda numarasıyla oyunu anlık izleyebilir, 'Geçmiş' tuşuyla tüm hareketleri görebilirsiniz.",
  
    }
  };
  
  
  // Şu anki dil, buradan kontrol edilir
  export let currentLang = "tr"; // veya 'us'
  
  export const setLanguage = (lang) => {
    currentLang = lang;
  };
  
  export const t = (key) => {
    return strings[currentLang][key] || key;
  };
  
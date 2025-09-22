import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Enterence from "./pages/Enterence";
import OnlineEnterence from "./pages/OnlineEnterence";
import Main from "./pages/Main";
import Tutorial from "./pages/Tutorial";
import OnlineMain from "./pages/OnlineMain";
import colors from "./styles/Colors.js";
function App() {
  // const root = document.documentElement;
  // root.style.setProperty("--white", colors.white);
  // root.style.setProperty("--black", colors.black);
  // root.style.setProperty("--darkGreen", colors.darkGreen);
  // root.style.setProperty("--lightGreen", colors.lightGreen);
  // root.style.setProperty("--brown", colors.brown);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Enterence />} />
        <Route path="/OnlineEnterence" element={<OnlineEnterence />} />
        <Route path="/Main" element={<Main />} />
        <Route path="/Tutorial" element={<Tutorial />} />
        <Route path="/OnlineMain" element={<OnlineMain />} />
        {/* <Route path="/OnlineMain" element={<OnlineMain />} /> */}
      </Routes>
    </Router>
  );
}

export default App;

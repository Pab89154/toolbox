import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Home } from "./pages/Home";
import { Metronome } from "./pages/Metronome";
import { ColorPicker } from "./pages/ColorPicker";
import { Meditate } from "./pages/Meditate";
import { RollDie } from "./pages/RollDie";
import { Spinner } from "./pages/Spinner";
import { Tuner } from "./pages/Tuner";
import { Calculator } from "./pages/Calculator";
import { FlipCoin } from "./pages/FlipCoin";

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <div key={location.pathname} className="page-in">
      <Routes location={location}>
        <Route path="/" element={<Home />} />
        <Route path="/metronome" element={<Metronome />} />
        <Route path="/color-picker" element={<ColorPicker />} />
        <Route path="/meditate" element={<Meditate />} />
        <Route path="/roll-a-die" element={<RollDie />} />
        <Route path="/spinner" element={<Spinner />} />
        <Route path="/tuner" element={<Tuner />} />
        <Route path="/calculator" element={<Calculator />} />
        <Route path="/flip-a-coin" element={<FlipCoin />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export function App() {
  const basename = import.meta.env.BASE_URL.replace(/\/$/, "");
  return (
    <BrowserRouter basename={basename || undefined}>
      <AnimatedRoutes />
    </BrowserRouter>
  );
}

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import FoodForm from "./FoodForm";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/FoodForm" element={<FoodForm/>} />
      </Routes>
    </Router>
  );
}
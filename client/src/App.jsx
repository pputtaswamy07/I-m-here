import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Join from "./pages/Join";
import Login from "./pages/Login";

function App() {

  return (
    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/join" element={<Join />} />

        <Route path="/login" element={<Login />} />

      </Routes>

    </BrowserRouter>
  );
}

export default App;
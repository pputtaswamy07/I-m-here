import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./features/home/pages/Home";
import Join from "./features/auth/pages/Join";
import Login from "./features/auth/pages/Login";
import Dashboard from "./features/dashboard/pages/Dashboard";

function App() {

  return (
    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/join" element={<Join />} />

        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />

      </Routes>

    </BrowserRouter>
  );
}

export default App;
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./features/home/pages/Home";
import Join from "./features/auth/pages/Join";
import Login from "./features/auth/pages/Login";
import Dashboard from "./features/dashboard/pages/Dashboard";
import MyRequests from "./features/requests/pages/MyRequests";
import MyActivities from "./features/activities/pages/MyActivities";
import Settings from "./features/settings/pages/Settings";
import PrivateRoute from "./shared/components/PrivateRoute";
import PublicRoute from "./shared/components/PublicRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/join"  element={<PublicRoute><Join /></PublicRoute>} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />

        <Route path="/dashboard"    element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/my-requests"  element={<PrivateRoute><MyRequests /></PrivateRoute>} />
        <Route path="/my-activities" element={<PrivateRoute><MyActivities /></PrivateRoute>} />
        <Route path="/settings"     element={<PrivateRoute><Settings /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
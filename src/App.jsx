import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import AddDate from "./pages/AddDate";
import RoadTripGames from "./pages/RoadTripGames";
import NewTrip from "./pages/NewTrip";

function App() {
  const [user] = useAuthState(auth);

  return (
    <Router>
      <Routes>
        <Route path="/" element={user ? <Home /> : <Navigate to="/login" />} />
        <Route path="/add" element={user ? <AddDate /> : <Navigate to="/login" />} />
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
        <Route path="/games/:tripId" element={<RoadTripGames />} />
        <Route path="/newtrip" element={<NewTrip />} />

      </Routes>
    </Router>
  );
}

export default App;

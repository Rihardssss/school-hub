import { useState } from "react";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Homework from "./pages/Homework";
import Schedule from "./pages/Schedule";
import Announcements from "./pages/Announcements";

function App() {
  const [page, setPage] = useState("login");

  if (page === "login") return <Login setPage={setPage} />;
  if (page === "dashboard") return <Dashboard setPage={setPage} />;
  if (page === "homework") return <Homework setPage={setPage} />;
  if (page === "schedule") return <Schedule setPage={setPage} />;
  if (page === "announcements") return <Announcements setPage={setPage} />;

  return <div className="center"><div className="card">Page not found</div></div>;
}



export default App;
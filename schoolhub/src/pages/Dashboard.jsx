function Dashboard({ setPage }) {
  return (
    <div className="center">
      <div className="card">
        <h1>Dashboard</h1>

        <button onClick={() => setPage("homework")}>Homework</button>
        <button onClick={() => setPage("schedule")}>Schedule</button>
        <button onClick={() => setPage("announcements")}>Announcements</button>

        <button onClick={() => setPage("login")}>Logout</button>
      </div>
    </div>
  );
}

export default Dashboard;
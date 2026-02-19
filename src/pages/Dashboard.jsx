function Dashboard({ setPage }) {
  return (
    <div className="center">
      <div className="card">
        <h1>Sākumlapa</h1>

        <button onClick={() => setPage("homework")}>Mājasdarbi</button>
        <button onClick={() => setPage("schedule")}>Stundu saraksts</button>
        <button onClick={() => setPage("announcements")}>Paziņojumi</button>

        <button onClick={() => setPage("login")}>Iziet</button>
      </div>
    </div>
  );
}

export default Dashboard;
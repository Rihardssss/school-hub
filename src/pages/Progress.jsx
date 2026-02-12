function Progress({ setPage }) {
  const monthColumns = ["Janvāris", "Februāris", "Marts"];
  const subjectRows = [
    { subject: "Dabaszinības", months: ["i, i, 8", "7, 5", "9, 7"] },
    { subject: "Latviešu valoda I un Literatūra I", months: ["5, i, i", "i, i, i", "7, i, i, i"] },
    { subject: "Matemātika I", months: ["8, 83%", "84%", ""] },
    { subject: "Svešvaloda (B1) - Spāņu", months: ["7", "7", "6, 8"] },
    { subject: "Svešvaloda I (Angļu)", months: ["10", "", ""] },
  ];

  const pointRows = [
    { points: "86/100", avg: "7,2" },
    { points: "36/63", avg: "6" },
    { points: "135,5/161", avg: "8" },
    { points: "97/133", avg: "7" },
    { points: "-", avg: "10" },
  ];

  const kavējumi = [
    "Janvāris: 3 kavējumi",
    "Februāris: 1 kavējums",
    "Marts: 2 kavējumi",
    "Neattaisnoti: 1",
  ];

  return (
    <div className="layout">
      <div className="topbar">
        <div className="titleBlock">
          <h1>Sekmes un kavējumi</h1>
        </div>
        <button className="btnGhost" onClick={() => setPage("dashboard")}>Atpakaļ</button>
      </div>

      <div className="panel">
        <div className="tableWrap">
          <table className="scheduleTable">
            <thead>
              <tr>
                <th>Priekšmets</th>
                {monthColumns.map((m) => <th key={m}>{m}</th>)}
              </tr>
            </thead>
            <tbody>
              {subjectRows.map((row) => (
                <tr key={row.subject}>
                  <td>{row.subject}</td>
                  <td>{row.months[0]}</td>
                  <td>{row.months[1]}</td>
                  <td>{row.months[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="panel">
        <div className="tableWrap">
          <table className="scheduleTable">
            <thead>
              <tr>
                <th>Punkti</th>
                <th>Vidēji</th>
              </tr>
            </thead>
            <tbody>
              {pointRows.map((row, idx) => (
                <tr key={idx}>
                  <td>{row.points}</td>
                  <td>{row.avg}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="panel stack">
        <h2>Kavējumi</h2>
        {kavējumi.map((k) => (
          <div key={k} className="listItem">{k}</div>
        ))}
      </div>
    </div>
  );
}

export default Progress;

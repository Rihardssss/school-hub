import { useMemo, useState } from "react";

const times = [
  "08:30 - 09:10",
  "09:10 - 09:50",
  "10:00 - 10:40",
  "10:40 - 11:20",
  "12:00 - 12:40",
  "12:40 - 13:20",
  "13:40 - 14:20",
  "14:20 - 15:00",
  "15:10 - 15:50",
  "15:50 - 16:30",
  "16:35 - 17:15",
  "17:15 - 17:55",
  "18:00 - 18:40",
  "18:40 - 19:20",
  "19:40 - 20:20",
  "20:20 - 21:00",
];

const scheduleByDay = {
  Pirmdiena: {
    3: {
      subject: "Svešvaloda I (Angļu) - 114. auditorija, Meža iela 3 (RISEBA) (Stepanova Jeļena)",
      tasks: "NOD",
      topic: "Conditionals, 1st, 2nd, 3rd",
    },
    4: {
      subject: "Svešvaloda I (Angļu) - 114. auditorija, Meža iela 3 (RISEBA) (Stepanova Jeļena)",
      topic: "Mixed Conditionals",
    },
    5: {
      subject: "Latviešu valoda I un Literatūra I - 43.auditorija, VICTORIA (D-8) (Liepiņa-Zakirova Inese)",
      tasks: "NOD",
      topic: "Teikuma iedalījums pēc izteikuma mērķa.",
    },
    6: {
      subject: "Latviešu valoda I un Literatūra I - 43.auditorija, VICTORIA (D-8) (Liepiņa-Zakirova Inese)",
      tasks: "NOD",
      topic: "Teikuma veidi pēc uzbūves.",
    },
    7: {
      subject: "Svešvaloda (B1) - Spāņu - 102. auditorija, Meža iela 3 (RISEBA) (Kļaveniece-Zaharova Elizabete)",
      grade: "8",
      topic: "Pārbaudes darbs II",
    },
    8: {
      subject: "Svešvaloda (B1) - Spāņu - 102. auditorija, Meža iela 3 (RISEBA) (Kļaveniece-Zaharova Elizabete)",
      topic: "Pārbaudes darbs II",
    },
    9: { subject: "Matemātika I - 13.auditorija, VICTORIA (D-8) (Devajeva Ludmila)" },
    10: { subject: "Matemātika I - 13.auditorija, VICTORIA (D-8) (Devajeva Ludmila)" },
  },
  Otrdiena: {
    3: {
      subject: "Dabaszinības - 35.auditorija, VICTORIA (D-8) (Ozola Inese)",
      topic: "Projekts: Vides izpēte un iespējamā piesārņojuma noteikšana, jaunie darba organizācijas veidi, dienas režīms",
    },
    4: {
      subject: "Dabaszinības - 35.auditorija, VICTORIA (D-8) (Ozola Inese)",
      topic: "Projekts: Vides izpēte un iespējamā piesārņojuma noteikšana, jaunie darba organizācijas veidi, dienas režīms",
    },
    5: {
      subject: "Matemātika I - 13.auditorija, VICTORIA (D-8) (Devajeva Ludmila)",
      topic: "Eksponentfunkcija. Eksponenciālie procesi SR: iepazīstas ar reālās situācijās sastopamiem eksponenciāliem procesiem",
    },
    6: {
      subject: "Latviešu valoda I un Literatūra I - 43.auditorija, VICTORIA (D-8) (Liepiņa-Zakirova Inese)",
      tasks: "* NOD",
      topic: "Literatūras veidi un žanri.",
    },
  },
  Tresdiena: {
    3: { subject: "Programmēšanas tehnoloģijas (PB5) - attālināti (Medvedevs Vladislavs)" },
    4: { subject: "Programmēšanas tehnoloģijas (PB5) - attālināti (Medvedevs Vladislavs)" },
    5: { subject: "Programmēšanas tehnoloģijas (PB5) - attālināti (Medvedevs Vladislavs)" },
    6: { subject: "Programmēšanas tehnoloģijas (PB5) - attālināti (Medvedevs Vladislavs)" },
  },
  Ceturtdiena: {
    2: {
      subject: "Datu bāzu programmēšana (PB3) - 204. auditorija, Meža iela 3 (RISEBA) (Medvedevs Vladislavs)",
    },
    3: {
      subject: "Datu bāzu programmēšana (PB3) - 204. auditorija, Meža iela 3 (RISEBA) (Medvedevs Vladislavs)",
    },
    4: {
      subject: "Datu bāzu programmēšana (PB3) - 204. auditorija, Meža iela 3 (RISEBA) (Medvedevs Vladislavs)",
    },
    5: {
      subject: "Datu bāzu programmēšana (PB3) - 204. auditorija, Meža iela 3 (RISEBA) (Medvedevs Vladislavs)",
    },
    6: {
      subject: "Datu bāzu programmēšana (PB3) - 204. auditorija, Meža iela 3 (RISEBA) (Medvedevs Vladislavs)",
    },
    7: {
      subject: "Datu bāzu programmēšana (PB3) - 204. auditorija, Meža iela 3 (RISEBA) (Medvedevs Vladislavs)",
    },
    8: {
      subject: "Programmēšanas tehnoloģijas (PB5) - 204. auditorija, Meža iela 3 (RISEBA) (Medvedevs Vladislavs)",
    },
    9: {
      subject: "Programmēšanas tehnoloģijas (PB5) - 204. auditorija, Meža iela 3 (RISEBA) (Medvedevs Vladislavs)",
    },
  },
  Piektdiena: {},
};

function Schedule({ setPage }) {
  const [selectedDay, setSelectedDay] = useState("Pirmdiena");
  const days = Object.keys(scheduleByDay);
  const rows = useMemo(
    () =>
      times.map((time, idx) => {
        const nr = idx + 1;
        const lesson = scheduleByDay[selectedDay][nr] || {};
        return { nr, time, ...lesson };
      }),
    [selectedDay]
  );

  return (
    <div className="layout">
      <div className="topbar">
        <div className="titleBlock">
          <h1>Stundu saraksts</h1>
        </div>
        <button className="btnGhost" onClick={() => setPage("dashboard")}>Atpakaļ</button>
      </div>

      <div className="panel">
        <div className="dayTabs">
          {days.map((day) => (
            <button
              key={day}
              className={day === selectedDay ? "btnPrimary" : "btnGhost"}
              onClick={() => setSelectedDay(day)}
            >
              {day}
            </button>
          ))}
        </div>
        <div className="tableWrap">
          <table className="scheduleTable">
            <thead>
              <tr>
                <th>#</th>
                <th>Laiks</th>
                <th>Priekšmets, klases telpa, pedagogs</th>
                <th>Vērtējumi</th>
                <th>Apmeklējumi</th>
                <th>Uzdevumi</th>
                <th>Tēma</th>
                <th>Atsauksme</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.nr}>
                  <td>{row.nr}.</td>
                  <td>{row.time}</td>
                  <td>{row.subject || ""}</td>
                  <td>{row.grade || ""}</td>
                  <td>{row.attendance || ""}</td>
                  <td>{row.tasks || ""}</td>
                  <td>{row.topic || ""}</td>
                  <td>{row.feedback || ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Schedule;
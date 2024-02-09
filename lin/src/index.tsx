import dayjs from "dayjs";
import React from "react";
import ReactDOM from "react-dom/client";
import Calendar from "./App";
import CalendarComponent from "./components/Calendar";
import "./index.css";
import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <Calendar />
    <br />
    <CalendarComponent value={dayjs("2023-11-08")} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

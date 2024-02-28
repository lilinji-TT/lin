import React from "react";
import ReactDOM from "react-dom/client";
import Calendar from "./App";
import CalendarComponent from "./components/Calendar";
import ColorPickerPanel from "./components/ColorPicker";
import Space from "./components/Space";
import { ConfigProvider } from "./components/Space/SpaceProvider";
import "./index.css";
import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <Calendar />
    <br />
    <CalendarComponent />
    <br />
    <ColorPickerPanel value="rgb(166 57 57)" />
    <br />
    <ConfigProvider space={{ size: "large" }}>
      <Space direction="horizontal">
        <div className="box">Box1</div>
        <div className="box">Box2</div>
        <div className="box">Box3</div>
      </Space>
    </ConfigProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

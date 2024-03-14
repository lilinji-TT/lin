import ReactDOM from "react-dom/client";
import { ConfigProvider } from "./components/Message/ConfigProvider";
import { useMessage } from "./components/Message/useMessage";
import "./index.css";
import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
function Test() {
  const message = useMessage();
  return (
    <div>
      <button
        onClick={() => {
          message.add({
            content: "添加成功",
          });
        }}
      >
        添加
      </button>
    </div>
  );
}
root.render(
  <ConfigProvider>
    <Test></Test>
  </ConfigProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

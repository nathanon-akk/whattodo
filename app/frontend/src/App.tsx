import { ConfigProvider } from "antd";

import TodoList from "./components";

const App = () => {
  return (
    <ConfigProvider
      theme={{
        hashed: false,
        token: { fontFamily: "Kanit", colorPrimary: "#EA4C89" },
        components: {
          Table: {
            headerSplitColor: "transparent",
            cellPaddingBlock: 8,
          },
        },
      }}
    >
      <div className="App">
        <TodoList />
      </div>
    </ConfigProvider>
  );
};

export default App;

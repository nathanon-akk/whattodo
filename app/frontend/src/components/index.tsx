import { Layout } from "antd";

import HeaderBar from "./HeaderBar";
import TodoList from "./TodoList";

import "./index.css";

const { Content } = Layout;

const TodoPage = () => {
  return (
    <Layout>
      <HeaderBar />
      <Content>
        <TodoList />
      </Content>
    </Layout>
  );
};
export default TodoPage;

import React, { ReactElement, useEffect, useMemo, useState } from "react";

import { Button, Checkbox, Divider, message, Table, TableProps } from "antd";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

import api from "@/client";

import DeleteIcon from "./DeleteIcon.svg";
import EditIcon from "./EditIcon.svg";
import TaskModal from "./TaskModal";

import "./index.css";

dayjs.extend(utc);

export interface Task {
  _id: string;
  name: string;
  due_date: string;
  complete: boolean;
}

const TodoList = () => {
  const [taskData, setTaskData] = useState<Task[]>([]);
  const [taskToEdit, setTaskToEdit] = useState<Task | Omit<Task, "_id"> | null>(
    null
  );

  ///// call api create task, then add to `taskData` and sort by day accordingly
  const createTask = (task: Omit<Task, "_id">, msg?: string) => {
    api
      .post("/task", task)
      .then((response) => {
        const newTask = response.data as Task;
        setTaskData((prev) =>
          [...prev, newTask].sort(
            (a, b) =>
              dayjs(a.due_date).diff(b.due_date, "day") ||
              a.name.localeCompare(b.name)
          )
        );
        setTaskToEdit(null);
        message.success(msg ?? "Task created");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  ///// call api update task, then update `taskData` and sort by day accordingly
  const updateTask = (task: Task, msg?: string) => {
    const { _id, ...rest } = task;
    api
      .put(`/task/${_id}`, rest)
      .then((response) => {
        const newTask = response.data as Task;
        setTaskData((prev) =>
          prev
            .map((task) => (task._id === newTask._id ? newTask : task))
            .sort(
              (a, b) =>
                dayjs(a.due_date).diff(b.due_date, "day") ||
                a.name.localeCompare(b.name)
            )
        );
        setTaskToEdit(null);
        message.success(msg ?? "Task updated");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  ///// call api delete task, then delete from `taskData`
  const deleteTask = (id: string) => {
    api
      .delete(`/task/${id}`)
      .then(() => {
        setTaskData((prev) => prev.filter((task) => task._id !== id));
        message.success("Task deleted");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  ///// get all tasks on tab load/reload
  const getAllTasks = () => {
    api
      .get("/task")
      .then((response) => {
        if (response.status === 200) {
          setTaskData(response.data);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };
  useEffect(() => {
    getAllTasks();
  }, []);

  ///// column display for uncompleted tasks
  const todoColumns: TableProps<Task>["columns"] = [
    {
      title: "",
      render: (value, record) => (
        <Checkbox
          checked={false}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            updateTask({ ...record, complete: true }, "Task completed");
          }}
        />
      ),
      width: 30,
    },
    {
      title: "TASK NAME",
      dataIndex: "name",
    },
    {
      title: "DUE",
      dataIndex: "due_date",
      width: 200,
      render: (value) => {
        const dif = dayjs(value).diff(dayjs(), "day");
        if (dif < 0)
          return (
            <div className="wtd-overdue">
              {dayjs(value).format("D MMM YYYY")}
              <div>overdue</div>
            </div>
          );
        if (dif == 0)
          return (
            <div className="wtd-due">
              {dayjs(value).format("D MMM YYYY")}
              <div>due</div>
            </div>
          );
        return dayjs(value).format("D MMM YYYY");
      },
    },
    {
      title: "",
      width: 40,
      render: (value, record) => {
        return (
          <img
            src={EditIcon}
            onClick={() => setTaskToEdit(record)}
            style={{ cursor: "pointer" }}
          />
        );
      },
    },
    {
      title: "",
      width: 40,
      render: (value, record) => {
        return (
          <img
            src={DeleteIcon}
            onClick={() => deleteTask(record._id)}
            style={{ cursor: "pointer" }}
          />
        );
      },
    },
  ];

  ///// column display for completed tasks
  const completeColumns: TableProps<Task>["columns"] = [
    {
      title: "",
      render: (value, record) => (
        <Checkbox
          checked={true}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            updateTask({ ...record, complete: false }, "Task uncompleted");
          }}
        />
      ),
      width: 30,
    },
    {
      title: "TASK NAME",
      dataIndex: "name",
    },
    {
      title: "DUE",
      dataIndex: "due_date",
      width: 200,
      render: (value) => {
        return dayjs(value).format("D MMM YYYY");
      },
    },
    {
      title: "",
      width: 40,
      render: (value, record) => {
        return (
          <img
            src={EditIcon}
            onClick={() => setTaskToEdit(record)}
            style={{ cursor: "pointer" }}
          />
        );
      },
    },
    {
      title: "",
      width: 40,
      render: (value, record) => {
        return (
          <img
            src={DeleteIcon}
            onClick={() => deleteTask(record._id)}
            style={{ cursor: "pointer" }}
          />
        );
      },
    },
  ];

  ////// group task into completed tasks and uncompleted tasks
  const { false: taskUncomplete, true: taskComplete } = useMemo(() => {
    return Object.groupBy(taskData, (task) => `${task.complete}`);
  }, [taskData]);

  ///// render content, check for empty
  const TodoContent: () => React.ReactNode = () => {
    const content = [
      <Divider orientation="left" orientationMargin="0">
        What to do
      </Divider>,
    ];

    if (taskData.length == 0) {
      content.push(<div className="wtd-empty">Add some tasks to start !</div>);
      return content;
    }

    if (taskUncomplete?.length) {
      content.push(
        <Table<Task>
          columns={todoColumns}
          dataSource={taskUncomplete}
          pagination={false}
        />
      );
    } else {
      content.push(<div className="wtd-empty">No tasks left ! Good job !</div>);
    }

    if (taskComplete?.length) {
      content.push(
        <Divider orientation="left" orientationMargin="0">
          Complete
        </Divider>
      );
      content.push(
        <Table<Task>
          columns={completeColumns}
          dataSource={taskComplete}
          pagination={false}
        />
      );
    }

    return content;
  };

  return (
    <>
      <Button
        className="wtd-new-button"
        onClick={() =>
          setTaskToEdit({
            name: "",
            due_date: dayjs().utc(true).startOf("day").format(),
            complete: false,
          })
        }
      >
        + NEW TO DO
      </Button>
      <TodoContent />
      <TaskModal
        task={taskToEdit}
        onClose={() => setTaskToEdit(null)}
        done={(task) => {
          if ("_id" in task) updateTask(task);
          else createTask(task);
        }}
      />
    </>
  );
};

export default TodoList;

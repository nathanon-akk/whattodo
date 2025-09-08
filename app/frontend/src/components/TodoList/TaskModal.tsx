//////// Modal for creating/updating todo task

import React, { useEffect, useMemo, useState } from "react";

import { Button, DatePicker, Input, Modal } from "antd";
import dayjs, { Dayjs } from "dayjs";

import LogoText from "@/components/LogoText";
import styled from "@emotion/styled";

import { Task } from "./";
import CalendarIcon from "./CalendarIcon.svg";

interface TaskModalProps {
  // Task with _id for updating existing task
  // Task without _id for creating new task
  task: Task | Omit<Task, "_id"> | null;
  onClose: () => void;
  done: (task: Task | Omit<Task, "_id">) => void;
}

const TaskModal: React.FC<TaskModalProps> = ({ task, onClose, done }) => {
  const [name, setName] = useState<string>("");
  const [date, setDate] = useState<Dayjs>(dayjs());

  // set name and date appropriately when modal opens
  useEffect(() => {
    if (!task) return;
    setName(task.name);
    setDate(dayjs(task.due_date));
  }, [task]);

  // if no _id field, then it is a new task
  const isNew = useMemo(() => task !== null && !("_id" in task), [task]);

  return (
    <StyledModal
      width={640}
      height={400}
      footer={null}
      open={!!task}
      onCancel={onClose}
    >
      <div style={{ height: 51 }}>
        <LogoText />
      </div>
      <div className="wtd-modal-title">
        {isNew ? "NEW TO DO" : "EDIT TO DO"}
      </div>
      <div className="input-group">
        <div className="input-label">TASK NAME</div>
        <Input value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div className="input-group">
        <div className="input-label">DUE DATE</div>
        <DatePicker
          defaultValue={dayjs()}
          suffixIcon={<img src={CalendarIcon} />}
          picker="date"
          placeholder=""
          format="D MMM YYYY"
          value={date}
          onChange={(val) => setDate(val)}
        />
      </div>
      <Button
        onClick={() =>
          done({ ...task, name, due_date: date.utc(true).format() })
        }
      >
        {isNew ? "ADD WHAT TO DO" : "CONFIRM"}
      </Button>
    </StyledModal>
  );
};

export default TaskModal;

const StyledModal = styled(Modal)`
  .ant-modal-content {
    padding: 24px;
    text-align: center;
    height: 400px;
    text-transform: uppercase;
    button.ant-modal-close {
      margin: 12px;
      border-radius: 29px;
      background: #e5e5e5;
    }

    div.wtd-modal-title {
      font-family: "Kanit", sans-serif;
      font-weight: 600;
      font-style: normal;
      font-size: 32px;
      letter-spacing: 3px;
      height: 48px;
      width: 200px;
      margin: 0 auto;
    }

    .ant-modal-body {
      display: flex;
      flex-direction: column;
      gap: 10px;
      text-align: center;
      .input-group {
        display: block;
        width: 420px;
        margin: 0 auto;
        text-align: left;
        .input-label {
          font-weight: 700;
          line-height: 24px;
          font-size: 15px;
        }
        input.ant-input {
          width: 100%;
          height: 40px;
          background: #f3f3f4;
          border: none;
        }
        .ant-picker {
          width: 100%;
          height: 40px;
          background: #f3f3f4;
          border: none;
          .ant-picker-suffix {
            margin-right: 4px;
          }
          input {
            text-transform: uppercase;
          }
        }
      }
      & > button {
        background: #ea4c89;
        color: white;
        width: 420px;
        margin: 20px auto;
        height: 40px;
        font-size: 14px;
        letter-spacing: 1.4px;
        font-weight: 500;
        font-style: normal;
      }
    }
  }
`;

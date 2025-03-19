import { Card, Typography } from "@mui/material";
import { useParams, usePathname } from "next/navigation";

import DeleteTodo from "./delete-todo";
import React from "react";
import TodoCheckBox from "./todo-checkbox";
import TodoForm from "./todo-form";

interface Todo {
  data: {
    id: string;
    title: string;
    description?: string;
    dueDate?: string;
    completed: boolean;
  };
}

const TodoCard: React.FC<Todo> = ({ data }) => {
  return (
    <Card key={data.id} className="mb-2 p-2 flex items-center justify-between">
      <div className=" flex flex-row items-start ">
        <TodoCheckBox id={data.id} checked={data.completed} />
        <div>
          <Typography
            variant="h6"
            className={data.completed ? "line-through" : ""}
          >
            {data.title}
          </Typography>
          {data.description && <Typography>{data.description}</Typography>}
          {data.dueDate && (
            <Typography variant="caption">Due: {data.dueDate}</Typography>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <TodoForm type="update" data={data} />
        <DeleteTodo id={data.id} />
      </div>
    </Card>
  );
};

export default TodoCard;

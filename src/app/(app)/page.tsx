"use client";

import {
  Alert,
  Box,
  Container,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";

import React from "react";
import TodoCard from "@/components/todo/todo-card";
import TodoForm from "@/components/todo/todo-form";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

interface Todo {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  completed: boolean;
  userId: string;
}

const MyTodos = () => {
  const { data, isSuccess, isError, isLoading } = useQuery<Todo[]>({
    queryKey: ["todos"],
    queryFn: async () => {
      const response = await axios.get("/api/todo");
      return response.data.data;
    },
  });
  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Stack
        direction="row"
        spacing={2}
        sx={{
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h4">My Todos</Typography>
        <TodoForm type="create" />
      </Stack>
      <Stack spacing={2}>
        {isLoading &&
          new Array(10)
            .fill(0)
            .map((_, i) => <Skeleton key={i} variant="rounded" height={60} />)}
        {isError && (
          <Alert severity="error">
            Error fetching todos. Please try again later.
          </Alert>
        )}
        {isSuccess && data && data.map((todo) => <TodoCard data={todo} />)}
      </Stack>
    </Container>
  );
};

export default MyTodos;

"use client";

import { Alert, Container, Skeleton, Stack, Typography } from "@mui/material";

import { Group } from "@/types/groups";
import React from "react";
import TodoCard from "@/components/todo/todo-card";
import TodoForm from "@/components/todo/todo-form";
import axios from "axios";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

const GroupDetails = () => {
  const { id } = useParams();
  const { data, isSuccess, isError, isLoading } = useQuery<Group>({
    queryKey: ["group-details", id],
    queryFn: async () => {
      const response = await axios.get("/api/groups/" + id);
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
        <Typography variant="h4"> {data?.name || "Group"} Todos</Typography>
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
        {isSuccess &&
          data &&
          data.todos.map((todo) => <TodoCard key={todo.id} data={todo} />)}
      </Stack>
    </Container>
  );
};

export default GroupDetails;

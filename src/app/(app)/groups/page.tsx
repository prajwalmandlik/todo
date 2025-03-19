"use client";

import {
  Alert,
  Container,
  Grid,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";

import { Group } from "@/types/groups";
import GroupCard from "@/components/groups/group-card";
import GroupForm from "@/components/groups/group-form";
import JoinGroup from "@/components/groups/join-groups";
import React from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const Groups = () => {
  const { data, isSuccess, isError, isLoading } = useQuery<Group[]>({
    queryKey: ["groups"],
    queryFn: async () => {
      const response = await axios.get("/api/groups");
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
        <Typography variant="h4">Groups</Typography>
        <Stack direction="row" spacing={2}>
          <JoinGroup />
          <GroupForm type="create" />
        </Stack>
      </Stack>
      <Grid
        container
        spacing={2}
        sx={{
          marginY: 2,
        }}
      >
        {isLoading &&
          new Array(10).fill(0).map((_, i) => (
            <Grid key={i} item xs={12} sm={6} md={4}>
              <Skeleton key={i} height={250} />
            </Grid>
          ))}

        {isError && (
          <Alert severity="error">
            Error fetching groups. Please try again later.
          </Alert>
        )}

        {isSuccess &&
          data &&
          data.map((group) => <GroupCard key={group.id} data={group} />)}
      </Grid>
    </Container>
  );
};
export default Groups;

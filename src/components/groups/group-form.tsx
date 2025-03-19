"use client";

import * as React from "react";

import { Controller, useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Edit } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import TextField from "@mui/material/TextField";
import axios from "axios";
import toast from "react-hot-toast";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface groupFormProps {
  type: "create" | "update";
  data?: {
    name: string;
    id: string;
  };
}

const groupSchema = z.object({
  id: z.string().optional(),
  name: z.string().nonempty(),
});

async function createGroup(data: z.infer<typeof groupSchema>) {
  const response = await axios.post("/api/groups", data);
  return response.data.data;
}

async function updateGroup(data: z.infer<typeof groupSchema>) {
  const response = await axios.put(`/api/groups/${data.id}`, data);
  return response.data.data;
}

export default function GroupForm({ type = "create", data }: groupFormProps) {
  const [open, setOpen] = React.useState(false);
  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({
    defaultValues: {
      id: data?.id || undefined,
      name: data?.name || "",
    },
    resolver: zodResolver(groupSchema),
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const queryClient = useQueryClient();

  const { mutate, isError, error, isPending } = useMutation({
    mutationFn: async (data: z.infer<typeof groupSchema>) => {
      if (type === "create") {
        return await createGroup(data);
      } else {
        return await updateGroup(data);
      }
    },
    onSuccess: () => {
      reset();
      toast.success("group saved successfully");
      queryClient.invalidateQueries({
        queryKey: ["groups"],
      });
      handleClose();
    },
  });

  return (
    <>
      {type === "update" ? (
        <Button
          size="small"
          color="primary"
          startIcon={<Edit />}
          onClick={handleClickOpen}
        >
          Edit
        </Button>
      ) : (
        <Button variant="contained" onClick={handleClickOpen}>
          Add group
        </Button>
      )}

      <Dialog
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: {
            component: "form",
            onSubmit: handleSubmit((data) => mutate(data)),
          },
        }}
      >
        <DialogTitle>
          {type === "create" ? "Create group" : "Update group"}
        </DialogTitle>
        <DialogContent>
          <Controller
            name="name"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <TextField
                fullWidth
                label="Name"
                variant="outlined"
                margin="normal"
                required
                {...field}
                error={errors.name ? true : false}
                helperText={errors.name?.message}
              />
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              handleClose();
              reset();
            }}
          >
            Cancel
          </Button>
          <Button type="submit" loading={isPending}>
            {type}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

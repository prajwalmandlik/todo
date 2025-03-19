"use client";

import * as React from "react";

import { Controller, useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, usePathname } from "next/navigation";

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

interface TodoFormProps {
  type: "create" | "update";
  data?: {
    id: string;
    title: string;
    description?: string;
    dueDate?: string;
    completed: boolean;
  };
}

const todoSchema = z.object({
  id: z.string().optional(),
  title: z.string().nonempty(),
  description: z.string().optional(),
  dueDate: z.string().optional(),
  groupId: z.string().optional(),
});

async function createTodo(data: z.infer<typeof todoSchema>) {
  const response = await axios.post("/api/todo", data);
  return response.data.data;
}

async function updateTodo(data: z.infer<typeof todoSchema>) {
  const response = await axios.put(`/api/todo/${data.id}`, data);
  return response.data.data;
}

export default function TodoForm({ type = "create", data }: TodoFormProps) {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();
  const { id } = useParams();
  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({
    defaultValues: {
      id: data?.id || undefined,
      title: data?.title || "",
      description: data?.description || "",
      dueDate: data?.dueDate || "",
    },
    resolver: zodResolver(todoSchema),
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const queryClient = useQueryClient();

  const { mutate, isError, error, isPending } = useMutation({
    mutationFn: async (data: z.infer<typeof todoSchema>) => {
      if (type === "create") {
        if (pathname.includes("group")) {
          data.groupId = id as string;
        }
        return await createTodo(data);
      } else {
        return await updateTodo(data);
      }
    },
    onSuccess: () => {
      reset();
      toast.success("Todo saved successfully");
      const isGroup = pathname.includes("group");

      if (isGroup) {
        queryClient.invalidateQueries({
          queryKey: ["group-todos"],
        });
      } else {
        queryClient.invalidateQueries({
          queryKey: ["todos"],
        });
      }
      handleClose();
    },
  });

  return (
    <>
      {type === "update" ? (
        <IconButton color="primary" onClick={handleClickOpen}>
          <Edit />
        </IconButton>
      ) : (
        <Button variant="contained" onClick={handleClickOpen}>
          Add Todo
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
          {type === "create" ? "Create Todo" : "Update Todo"}
        </DialogTitle>
        <DialogContent>
          <Controller
            name="title"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <TextField
                fullWidth
                label="Title"
                variant="outlined"
                margin="normal"
                required
                {...field}
                error={errors.title ? true : false}
                helperText={errors.title?.message}
              />
            )}
          />

          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <TextField
                fullWidth
                label="Description"
                variant="outlined"
                margin="normal"
                {...field}
                error={errors.description ? true : false}
                helperText={errors.description?.message}
              />
            )}
          />

          <Controller
            name="dueDate"
            control={control}
            render={({ field }) => (
              <TextField
                fullWidth
                type="date"
                label="Due Date"
                variant="outlined"
                margin="normal"
                {...field}
                error={errors.dueDate ? true : false}
                helperText={errors.dueDate?.message}
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

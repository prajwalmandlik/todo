"use client";

import * as React from "react";

import { Controller, useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import axios from "axios";
import toast from "react-hot-toast";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const groupSchema = z.object({
  inviteCode: z.string().nonempty(),
});

export default function JoinGroup() {
  const [open, setOpen] = React.useState(false);
  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({
    defaultValues: {
      inviteCode: "",
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

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: z.infer<typeof groupSchema>) => {
      const response = await axios.post("/api/groups/join", data);
      return response.data;
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
      <Button variant="contained" onClick={handleClickOpen}>
        Join Group
      </Button>

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
        <DialogTitle>Join group by entering the group Code</DialogTitle>
        <DialogContent>
          <Controller
            name="inviteCode"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <TextField
                fullWidth
                label="Group Code"
                variant="outlined"
                margin="normal"
                required
                {...field}
                error={errors.inviteCode ? true : false}
                helperText={errors.inviteCode?.message}
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
            Join
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

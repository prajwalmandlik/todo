import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
} from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Delete } from "@mui/icons-material";
import axios from "axios";
import { usePathname } from "next/navigation";
import { useState } from "react";

type DeleteTodoProps = {
  id: string;
};

const DeleteTodo: React.FC<DeleteTodoProps> = ({ id }) => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const { mutate, isPending } = useMutation({
    mutationFn: async (id: string) => {
      const response = await axios.delete(`/api/todo/${id}`);
      return response.data;
    },
    onSuccess: () => {
      const isGroup = pathname.includes("group");

      if (isGroup) {
        queryClient.invalidateQueries({
          queryKey: ["group-details"],
        });
      } else {
        queryClient.invalidateQueries({
          queryKey: ["todos"],
        });
      }
    },
  });

  return (
    <>
      <IconButton color="error" onClick={handleClickOpen}>
        <Delete />
      </IconButton>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Are you sure you want to delete this todo?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Disagree</Button>
          <Button onClick={() => mutate(id)} autoFocus loading={isPending}>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DeleteTodo;

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Checkbox } from "@mui/material";
import React from "react";
import axios from "axios";
import { usePathname } from "next/navigation";

type TodoCheckBoxProps = {
  id: string;
  checked: boolean;
};

const TodoCheckBox: React.FC<TodoCheckBoxProps> = ({ id, checked }) => {
  const queryClient = useQueryClient();
  const pathname = usePathname();
  const { mutate } = useMutation({
    mutationFn: async (id: string) => {
      const response = await axios.put(`/api/todo/${id}`, {
        completed: !checked,
      });
      return response.data.data;
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

  return <Checkbox checked={checked} onChange={() => mutate(id)} />;
};

export default TodoCheckBox;

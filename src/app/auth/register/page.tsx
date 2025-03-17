"use client";

import { Alert, Container, TextField } from "@mui/material";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import axios, { AxiosError } from "axios";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import React from "react";
import Typography from "@mui/material/Typography";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const loginSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
});

type customError = {
  message: string;
};

const Register = () => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<z.infer<typeof loginSchema>>({
    mode: "onBlur",
    resolver: zodResolver(loginSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });
  const router = useRouter();

  const { mutate, isError, error, isPending } = useMutation<
    any,
    AxiosError<customError>,
    z.infer<typeof loginSchema>
  >({
    mutationFn: async (data: z.infer<typeof loginSchema>) => {
      const response = await axios.post("/api/auth/signup", data);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message);
      router.push("/auth/login");
    },
  });

  return (
    <Container
      maxWidth="xs"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Box
        sx={{
          p: 4,
          boxShadow: 3,
          borderRadius: 2,
          bgcolor: "background.paper",
        }}
      >
        <Typography variant="h4" align="center" gutterBottom>
          Register
        </Typography>

        {isError && (
          <Alert severity="error">
            {error?.response?.data?.message || "An error occurred"}
          </Alert>
        )}

        <form onSubmit={handleSubmit((data) => mutate(data))}>
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
                error={errors.email ? true : false}
                helperText={errors.email?.message}
              />
            )}
          />
          <Controller
            name="email"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <TextField
                fullWidth
                label="Email"
                variant="outlined"
                margin="normal"
                required
                {...field}
                error={errors.email ? true : false}
                helperText={errors.email?.message}
              />
            )}
          />

          <Controller
            name="password"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <TextField
                fullWidth
                label="Password"
                type="password"
                variant="outlined"
                margin="normal"
                required
                {...field}
                error={errors.password ? true : false}
                helperText={errors.password?.message}
              />
            )}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 2 }}
            loading={isPending}
          >
            Register
          </Button>

          <Typography variant="body2" align="center" sx={{ mt: 2 }}>
            Already have an account?{" "}
            <a href="/auth/login" className=" text-blue-500">
              Login
            </a>
          </Typography>
        </form>
      </Box>
    </Container>
  );
};

export default Register;

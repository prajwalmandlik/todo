"use client";

import { Alert, Container, TextField } from "@mui/material";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { signIn } from "next-auth/react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const LoginPage = () => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<z.infer<typeof loginSchema>>({
    mode: "onBlur",
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const router = useRouter();
  const onSubmit: SubmitHandler<z.infer<typeof loginSchema>> = async (data) => {
    setLoading(true);
    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.ok) {
        router.push("/");
      }

      if (result?.error) {
        setError(true);
      }
    } catch (error) {
      setError(true);
      console.error("Failed to sign in", error);
    } finally {
      setLoading(false);
    }
  };

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
          Login
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            Invalid credentials
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
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
            loading={loading}
            sx={{ mt: 2 }}
          >
            Login
          </Button>

          <Typography variant="body2" align="center" sx={{ mt: 2 }}>
            Don't have an account?{" "}
            <a href="/auth/register" className=" text-blue-500">
              Register
            </a>
          </Typography>
        </form>
      </Box>
    </Container>
  );
};

export default LoginPage;

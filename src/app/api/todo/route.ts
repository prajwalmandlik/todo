import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const todos = await prisma.todoItem.findMany();
    return NextResponse.json({ todos });
  } catch (error) {
    console.error("Get Todos Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

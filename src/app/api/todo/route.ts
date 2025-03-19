import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const user = await auth();

    if (user?.user?.id === undefined) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const todos = await prisma.todoItem.findMany({
      where: {
        userId: user?.user?.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json({ data: todos });
  } catch (error) {
    console.error("Get Todos Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const user = await auth();
    const { title, description, dueDate, groupId } = await req.json();

    if (user?.user?.id === undefined) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const todo = await prisma.todoItem.create({
      data: {
        title,
        description,
        dueDate: dueDate ? new Date(dueDate) : null,
        userId: user?.user?.id,
        groupId: groupId || null,
        completed: false,
      },
    });

    return NextResponse.json({ data: todo });
  } catch (error) {
    console.error("Create Todo Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

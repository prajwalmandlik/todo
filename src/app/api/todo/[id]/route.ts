import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await auth();
    const { title, description, dueDate, completed } = await req.json();
    const { id } = await params;

    if (user?.user?.id === undefined) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const todo = await prisma.todoItem.update({
      where: {
        id,
      },
      data: {
        title,
        description,
        dueDate: dueDate ? new Date(dueDate) : null,
        completed,
      },
    });

    return NextResponse.json({ data: todo });
  } catch (error) {
    console.error("Update Todo Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await auth();
    const { id } = await params;

    if (user?.user?.id === undefined) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const todo = await prisma.todoItem.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({ data: todo });
  } catch (error) {
    console.error("Delete Todo Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

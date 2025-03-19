import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await auth();
    const { name } = await req.json();
    const { id } = await params;

    if (user?.user?.id === undefined) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const group = await prisma.group.update({
      where: {
        id,
      },
      data: {
        name,
      },
    });

    return NextResponse.json({ data: group });
  } catch (error) {
    console.error("Update Group Error:", error);
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

    await prisma.groupMembers.deleteMany({
      where: {
        groupId: id,
      },
    });

    await prisma.todoItem.deleteMany({
      where: {
        groupId: id,
      },
    });

    const group = await prisma.group.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({ data: group });
  } catch (error) {
    console.error("Delete Group Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await auth();
    const { id } = await params;
    if (user?.user?.id === undefined) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const group = await prisma.group.findFirst({
      where: {
        id,
      },
      include: {
        members: {
          include: {
            user: true,
          },
        },
        createdBy: true,
        todos: {
          include: {
            user: true,
          },
        },
      },
    });

    return NextResponse.json({ data: group });
  } catch (error) {
    console.error("Get Todos Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

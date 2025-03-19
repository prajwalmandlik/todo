import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const user = await auth();

    if (user?.user?.id === undefined) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const groups = await prisma.group.findMany({
      where: {
        members: {
          some: {
            userId: user?.user?.id,
          },
        },
      },
      include: {
        _count: {
          select: {
            members: true,
          },
        },
        createdBy: true,
        members: true,
      },
    });

    return NextResponse.json({ data: groups });
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
    const { name } = await req.json();

    if (user?.user?.id === undefined) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const inviteCode = Math.random().toString(36).substring(7);

    const group = await prisma.group.create({
      data: {
        name,
        inviteCode,
        createdById: user.user.id,
        members: {
          create: {
            userId: user?.user?.id,
          },
        },
      },
    });

    return NextResponse.json({ data: group });
  } catch (error) {
    console.error("Create Todo Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

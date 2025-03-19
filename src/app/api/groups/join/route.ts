import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const user = await auth();
    const { inviteCode } = await req.json();

    if (user?.user?.id === undefined) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const group = await prisma.group.findFirst({
      where: {
        inviteCode: inviteCode,
      },
    });

    if (!group) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 });
    }

    const existingMember = await prisma.groupMembers.findFirst({
      where: {
        groupId: group.id,
        userId: user?.user?.id,
      },
    });

    if (existingMember) {
      return NextResponse.json(
        { error: "Already a member of this group" },
        { status: 400 }
      );
    }

    await prisma.groupMembers.create({
      data: {
        userId: user?.user?.id,
        groupId: group.id,
      },
    });

    return NextResponse.json({ data: group });
  } catch (error) {
    console.error("Join Group Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

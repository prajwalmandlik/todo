import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await auth();
    const { id } = await params;
    if (user?.user?.id === undefined) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const members = await prisma.groupMembers.findMany({
      where: {
        groupId: id,
      },
    });

    return NextResponse.json({ data: members });
  } catch (error) {
    console.error("Get Todos Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

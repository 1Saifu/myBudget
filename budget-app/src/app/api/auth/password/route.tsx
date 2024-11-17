import { hashPassword } from "../../../../utils/bcrypt";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
    try {
      const body = await request.json();
  
      const { email, newPassword } = body;
  
      if (!email || !newPassword) {
        return NextResponse.json(
          { message: "Email and newPassword are required" },
          { status: 400 }
        );
      }
  
      const hashedPassword = await hashPassword(newPassword);
  
      const updatedUser = await prisma.user.update({
        where: { email },
        data: { password: hashedPassword },
      });
  
      return NextResponse.json({
        message: "Password successfully updated",
        user: updatedUser,
      });
    } catch (error: any) {
      console.log("Error: failed to update password", error.message);
      return NextResponse.json(
        { message: "Error updating user password", error: error.message },
        { status: 500 }
      );
    }
  }
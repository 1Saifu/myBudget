import { NextRequest, NextResponse } from "next/server";
import { UserRegistrationData } from "@/types/user";
import { hashPassword } from "../../../../utils/bcrpyt";
import { signJWT } from "@/utils/jwt";
import { userExists } from "@/utils/prisma"; 
import { userRegistrationValidator } from "@/utils/validators/userValidator";
import prisma from "@/utils/prisma"; 

export async function POST(request: NextRequest) {
  try {
    const body: UserRegistrationData = await request.json();
    const [hasErrors, errors] = userRegistrationValidator(body);
    if (hasErrors) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    const hashedPassword = await hashPassword(body.password);

    const exists = await userExists(body.email); 
    if (exists) {
      return NextResponse.json({ message: "User with this email already exists" }, { status: 400 });
    }

    const user = await prisma.user.create({
      data: {
        email: body.email.toLowerCase(),
        password: hashedPassword,
      },
    });

    const token = await signJWT({ userId: user.id });

    return NextResponse.json({ token, userId: user.id }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: "Registration failed", error: error.message }, { status: 400 });
  }
}
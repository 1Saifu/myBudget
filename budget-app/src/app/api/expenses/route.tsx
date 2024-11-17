import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { ExpenseData } from "@/types/expense"; 

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get("user-id");
    if (!userId) {
      return NextResponse.json({ message: "User ID is required" }, { status: 400 });
    }

    const expenses = await prisma.expense.findMany({
      where: {
        category: {
          budget: { userId }, 
        },
      },
      include: {
        category: true, 
      },
    });

    return NextResponse.json(expenses, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: "Error fetching expenses", error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
    try {
      const body: ExpenseData = await request.json(); 
      const { name, amount, categoryId } = body;
  
      if (!name || !amount || !categoryId) {
        return NextResponse.json({ message: "Name, amount, and category ID are required" }, { status: 400 });
      }
  
      const expense = await prisma.expense.create({
        data: {
          description: name, 
          amount,
          categoryId,
          date: new Date(), 
        },
      });
  
      return NextResponse.json(expense, { status: 201 });
    } catch (error: any) {
      return NextResponse.json({ message: "Error creating expense", error: error.message }, { status: 500 });
    }
  }
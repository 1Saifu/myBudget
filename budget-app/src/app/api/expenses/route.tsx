import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { SafeExpense, ExpenseData } from "@/types/expense";

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
          budget: {
            userId,
          },
        },
      },
      include: {
        category: {
          include: {
            budget: true,
          },
        },
      },
    });

    const safeExpenses: SafeExpense[] = expenses.map((expense) => ({
      id: expense.id,
      description: expense.description,
      amount: expense.amount,
      categoryId: expense.categoryId,
    }));

    return NextResponse.json(safeExpenses, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: "Error fetching expenses", error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: ExpenseData = await request.json();
    const { description, amount, categoryId } = body;

    if (!description || !amount || !categoryId) {
      return NextResponse.json(
        { message: "Description, amount, and category ID are required" },
        { status: 400 }
      );
    }

    const expense = await prisma.expense.create({
      data: {
        description,
        amount,
        categoryId,
      },
    });

    return NextResponse.json(expense, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: "Error creating expense", error: error.message }, { status: 500 });
  }
}
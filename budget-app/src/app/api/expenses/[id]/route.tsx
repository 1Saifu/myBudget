import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { SafeExpense, ExpenseData } from "@/types/expense";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();

    const expense = await prisma.expense.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });

    if (!expense) {
      return NextResponse.json({ message: "Expense not found" }, { status: 404 });
    }

    const safeExpense: SafeExpense = {
      id: expense.id,
      description: expense.description,
      amount: expense.amount,
      categoryId: expense.categoryId,
    };

    return NextResponse.json(safeExpense, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: "Error fetching expense", error: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();

    const body: ExpenseData = await request.json();
    const { description, amount, categoryId } = body;

    if (!description || !amount || !categoryId) {
      return NextResponse.json(
        { message: "Description, amount, and category ID are required" },
        { status: 400 }
      );
    }

    const updatedExpense = await prisma.expense.update({
      where: { id },
      data: {
        description,
        amount,
        categoryId,
      },
    });

    return NextResponse.json(updatedExpense, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: "Error updating expense", error: error.message }, { status: 500 });
  }
}

  
export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();

    const deletedExpense = await prisma.expense.delete({
      where: { id },
    });

    return NextResponse.json(deletedExpense, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: "Error deleting expense", error: error.message }, { status: 500 });
  }
}
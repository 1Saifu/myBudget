import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, Expense } from "@prisma/client";
import { SafeExpense, ExpenseData } from "@/types/expense";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get("user-id");
    const categoryId = request.nextUrl.searchParams.get("categoryId");

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
        ...(categoryId ? { categoryId } : {}), 
      },
      include: {
        category: true,
      },
    });


    const safeExpenses: SafeExpense[] = expenses.map((expense: Expense) => ({
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

    if (!description || amount === undefined || !categoryId) {
      return NextResponse.json(
        { message: "Description, amount, and category ID are required" },
        { status: 400 }
      );
    }

    if (typeof amount !== 'number' || isNaN(amount)) {
      return NextResponse.json({ message: "Invalid amount" }, { status: 400 });
    }


    if (typeof categoryId !== 'string') {
      return NextResponse.json({ message: "Invalid category ID" }, { status: 400 });
    }

    const category = await prisma.category.findUnique({
      where: { id: categoryId },
      include: { budget: true },  
    });

    if (!category || !category.budget) {
      return NextResponse.json(
        { message: "Category or Budget not found" },
        { status: 400 }
      );
    }

    const remainingBudget = category.budget.remaining - amount;

    if (remainingBudget < 0) {
      return NextResponse.json(
        { message: "Expense exceeds the available budget" },
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

    await prisma.budget.update({
      where: { id: category.budgetId },
      data: {
        remaining: remainingBudget,  
      },
    });

    return NextResponse.json(expense, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: "Error creating expense", error: error.message }, { status: 500 });
  }
}
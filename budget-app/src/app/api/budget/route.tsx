import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { SafeBudget, BudgetData } from "@/types/budget";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
    try {
      const userId = request.headers.get("user-id");
      if (!userId) {
        return NextResponse.json({ message: "User ID is required" }, { status: 400 });
      }
  
      const budgets = await prisma.budget.findMany({
        where: { userId },
        include: {
          categories: {
            include: {
              expenses: true, 
            },
          },
        },
      });
  
      const safeBudgets: SafeBudget[] = await Promise.all(
        budgets.map(async (budget) => {
          const totalExpenses = budget.categories.reduce((total, category) => {
            return total + category.expenses.reduce((categoryTotal, expense) => {
              return categoryTotal + expense.amount;
            }, 0);
          }, 0);
  
          const remaining = budget.amount - totalExpenses;
  
          return {
            id: budget.id,
            amount: budget.amount,
            startDate: budget.startDate,
            endDate: budget.endDate,
            userId: budget.userId,
            remaining, 
          };
        })
      );
  
  
      return NextResponse.json(safeBudgets, { status: 200 });
    } catch (error: any) {
      return NextResponse.json({ message: "Error fetching budgets", error: error.message }, { status: 500 });
    }
  }

  
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log("Received data for creating budget:", body);

    const { amount, startDate, endDate, userId }: BudgetData = body;

    if (!amount || !startDate || !endDate || !userId) {
      return NextResponse.json({ message: "Amount, start date, end date, and user ID are required" }, { status: 400 });
    }

    const budget = await prisma.budget.create({
      data: {
        amount,
        remaining: amount,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        userId,
      },
    });

    return NextResponse.json(budget, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: "Error creating budget", error: error.message }, { status: 500 });
  }
}
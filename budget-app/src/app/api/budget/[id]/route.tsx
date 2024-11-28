import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { SafeBudget, BudgetData, } from "@/types/budget";
import { SafeCategory } from "@/types/category";
import { SafeExpense } from "@/types/expense";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
    try {
      
      const url = new URL(request.url);
      const id = url.pathname.split('/').pop();
  
      const budget = await prisma.budget.findUnique({
        where: { id },
        include: {
          categories: {
            include: {
              expenses: true, 
            },
          },
        },
      });
  
      if (!budget) {
        return NextResponse.json({ message: "Budget not found" }, { status: 404 });
      }
  
      const totalExpenses = budget.categories.reduce((total: number, category: SafeCategory) => {
        return total + category.expenses.reduce((categoryTotal: number, expense: SafeExpense) => {
          return categoryTotal + expense.amount;
        }, 0);
      }, 0);
      
  
      const remaining = budget.amount - totalExpenses;
  
      const safeBudget: SafeBudget = {
        id: budget.id,
        amount: budget.amount,
        startDate: budget.startDate,
        endDate: budget.endDate,
        userId: budget.userId,
        remaining,
      };
  
      return NextResponse.json(safeBudget, { status: 200 });
    } catch (error: any) {
      return NextResponse.json({ message: "Error fetching budget", error: error.message }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
      
      const url = new URL(request.url);
      const id = url.pathname.split('/').pop();

      const body = await request.json();
      const { amount, startDate, endDate }: BudgetData = body;
  
      if (!amount || !startDate || !endDate) {
        return NextResponse.json({ message: "Amount, start date, and end date are required" }, { status: 400 });
      }
  
      const updatedBudget = await prisma.budget.update({
        where: { id },
        data: {
          amount,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
        },
      });
  
      return NextResponse.json(updatedBudget, { status: 200 });
    } catch (error: any) {
      return NextResponse.json({ message: "Error updating budget", error: error.message }, { status: 500 });
    }
}
  
export async function DELETE(request: NextRequest) {
    try {
      
      const url = new URL(request.url);
      const id = url.pathname.split('/').pop();

      const budget = await prisma.budget.findUnique({
        where: { id },
        include: { categories: true }, 
      });
  
      if (!budget) {
        return NextResponse.json({ message: "Budget not found" }, { status: 404 });
      }

      await prisma.expense.deleteMany({
        where: {
          categoryId: {
            in: budget.categories.map((category) => category.id),
          },
        },
      });

      await prisma.category.deleteMany({
        where: { budgetId: id },
      });

      const deletedBudget = await prisma.budget.delete({
        where: { id },
      });
  
      return NextResponse.json(deletedBudget, { status: 200 });
    } catch (error: any) {
      return NextResponse.json({ message: "Error deleting budget", error: error.message }, { status: 500 });
    }
}
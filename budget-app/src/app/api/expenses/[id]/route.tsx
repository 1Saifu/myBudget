import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { ExpenseData } from "@/types/expense";

const prisma = new PrismaClient();

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;


    const expense = await prisma.expense.findUnique({
        where: { id },
        include: {
          category: true,
        },
      });

      if (!expense) {
        return NextResponse.json({ message: "Expense not found" }, { status: 404 });
      }
  
      return NextResponse.json(expense, { status: 200 });
    } catch (error: any) {
      return NextResponse.json({ message: "Error fetching expense", error: error.message }, { status: 500 });
    }
}


export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    try {
      const { id } = params;
      const body: ExpenseData = await request.json();  
      const { name, amount, categoryId } = body;
  
      if (!name || !amount || !categoryId) {
        return NextResponse.json({ message: "Name, amount, and category ID are required" }, { status: 400 });
      }
  
      const updatedExpense = await prisma.expense.update({
        where: { id },
        data: {
          description: name, 
          amount,
          categoryId,
          date: new Date(),  
        },
      });
  
      return NextResponse.json(updatedExpense, { status: 200 });
    } catch (error: any) {
      return NextResponse.json({ message: "Error updating expense", error: error.message }, { status: 500 });
    }
}

  
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    try {
      const { id } = params;
  
      const deletedExpense = await prisma.expense.delete({
        where: { id },
      });
  
      return NextResponse.json(deletedExpense, { status: 200 });
    } catch (error: any) {
      return NextResponse.json({ message: "Error deleting expense", error: error.message }, { status: 500 });
    }
}
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { SafeCategory, CategoryData } from "@/types/category"; 
import { SafeExpense } from "@/types/expense"; 

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
      const url = new URL(request.url);
      const id = url.pathname.split('/').pop();

    const category = await prisma.category.findUnique({
      where: {
        id: id, 
      },
      include: {
        expenses: true, 
        budget: true,   
      },
    });

    if (!category) {
      return NextResponse.json({ message: "Category not found" }, { status: 404 });
    }

    const safeCategory: SafeCategory = {
      id: category.id,
      name: category.name,
      expenses: (category.expenses as SafeExpense[]).map((expense) => ({
        id: expense.id,
        description: expense.description,
        amount: expense.amount,
        categoryId: expense.categoryId,
      })),
      budgetId: category.budget.id,  
    };

    return NextResponse.json(safeCategory, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: "Error fetching category", error: error.message }, { status: 500 });
  }
}


  export async function PUT(request: NextRequest) {
    try {
      const url = new URL(request.url);
      const id = url.pathname.split('/').pop();

      const body: CategoryData = await request.json(); 
      const { name } = body;
  
      if (!name) {
        return NextResponse.json({ message: "Name and Budget ID are required" }, { status: 400 });
      }
  
      const updatedCategory = await prisma.category.update({
        where: {
          id: id,
        },
        data: {
          name,
        },
      });
  
      return NextResponse.json(updatedCategory, { status: 200 });
    } catch (error: any) {
      return NextResponse.json({ message: "Error updating category", error: error.message }, { status: 500 });
    }
}

  export async function DELETE(request: NextRequest) {
    try {
      const url = new URL(request.url);
      const id = url.pathname.split('/').pop();

      const category = await prisma.category.findUnique({
        where: { id },
        include: { expenses: true },
      });
  
      if (!category) {
        return NextResponse.json({ message: "Category not found" }, { status: 404 });
      }

      await prisma.expense.deleteMany({
        where: { categoryId: id },
      });
  
      const deletedCategory = await prisma.category.delete({
        where: { id: id, },
      });
  
      return NextResponse.json(deletedCategory, { status: 200 });
    } catch (error: any) {
      return NextResponse.json({ message: "Error deleting category", error: error.message }, { status: 500 });
    }
}
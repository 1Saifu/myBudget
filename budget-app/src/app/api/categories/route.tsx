import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { SafeCategory, CategoryData } from "@/types/category"; 

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
    try {
      const userId = request.headers.get("user-id");
  
      if (!userId) {
        return NextResponse.json({ message: "User ID is required" }, { status: 400 });
      }
  
      const categories = await prisma.category.findMany({
        include: {
          expenses: true, 
          budget: true, 
        },
        where: {
          budget: {
            userId: userId, 
          },
        },
      });
  

      const safeCategories: SafeCategory[] = categories.map(category => ({
        id: category.id,
        name: category.name,
        expenses: category.expenses.map((expense) => ({
          id: expense.id,
          description: expense.description,
          amount: expense.amount,
          categoryId: expense.categoryId,
        })),
        budgetId: category.budget.id, 
      }));
  
      return NextResponse.json(safeCategories, { status: 200 });
    } catch (error: any) {
      return NextResponse.json({ message: "Error fetching categories", error: error.message }, { status: 500 });
    }
  }

  export async function POST(request: NextRequest) {
    try {
      const body: CategoryData = await request.json(); 
      const { name } = body;
  
      if (!name) {
        return NextResponse.json({ message: "Name and Budget ID are required" }, { status: 400 });
      }

      const userId = request.headers.get("user-id");
      console.log("Received User ID:", userId);

      if (!userId) {
        return NextResponse.json({ message: "User ID is required" }, { status: 400 });
      }

      const budget = await prisma.budget.findFirst({
        where: {
          userId: userId,
        },
      });

      if (!budget) {
        return NextResponse.json({ message: "No active budget found for user" }, { status: 400 });
      }
  
      const category = await prisma.category.create({
        data: {
          name,
          budgetId: budget.id,
        },
      });
  
      return NextResponse.json(category, { status: 201 });
    } catch (error: any) {
      return NextResponse.json({ message: "Error creating category", error: error.message }, { status: 500 });
    }
  }
import { Category } from "@prisma/client";

export type SafeCategory = Omit<Category, "createdAt" | "updatedAt"> & {
  budgetId: string;  
  expenses: Expense[]; 
};

export type CategoryData = {
  name: string;
}
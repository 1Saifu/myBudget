import { Expense } from "@prisma/client";

export type SafeExpense = Omit<Expense, "createdAt" | "updatedAt">;

export type ExpenseData = {
  description: string; 
  amount: number;     
  categoryId: string;   
};
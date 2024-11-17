import { Budget } from "@prisma/client";

export type SafeBudget = Omit<Budget, "createdAt" | "updatedAt"> & {
  remaining: number;
};

export type BudgetData = {
    amount: number;     
    startDate: string;    
    endDate: string; 
    userId: string;     
  };
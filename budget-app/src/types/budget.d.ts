import { Budget } from "@prisma/client";
import { SafeCategory } from "@/types/category";  

export type SafeBudget = Omit<Budget, "createdAt" | "updatedAt"> & {
  remaining: number;
  categories: SafeCategory[]; 
};

export type BudgetData = {
    amount: number;     
    startDate: string;    
    endDate: string; 
    userId: string;     
  };
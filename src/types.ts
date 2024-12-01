// src/types.ts
export interface Company {
    id: number;
    name: string;
    // Add other relevant fields
  }
  
  export interface Farm {
    id: number;
    name: string;
    status: string;
    created_at: string;
    company: Company;
    // Add other relevant fields
  }
  
  // src/types/staff.ts
export interface Staff {
  id: string;
  name: string;
  email: string;
  position: string;
}

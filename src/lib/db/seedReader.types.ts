export interface SeedUser {
  id: string;
  name: string;
  email: string;
  password: string;
  role: "admin" | "empleado";
  must_change_password?: boolean;
}

export interface SeedProduct {
  id: string;
  name: string;
  price: number;
  current_stock: number;
  is_active: boolean;
}

export interface SeedData {
  users: SeedUser[];
  system_config: {
    low_stock_threshold: number;
  };
  products: SeedProduct[];
}

export interface MenuItemRow {
    id: number;
    name: string;
    description: string;
    price:number;
    type: "coffee" | "bun" | "other";
    is_available: boolean;
    category_id: number;
    created_at: Date;
    updated_at: Date;
}

export interface CreateMenuInput {
    name: string;
    description: string;
    price: number;
    type: "coffee" | "bun" | "other";
    is_available: boolean;
    category_id: number;
}

export interface UpdateMenuInput  {
    name?: string;
    description?: string;
    price?: number;
    type?: "coffee" | "bun" | "other";
    is_available?: boolean;
    category_id?: number;
}
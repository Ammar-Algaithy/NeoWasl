export type Product = {
    id: number;
    name: string;
    category: string;
    description: string;
    price: number;
    pictureUrl: string;
    type: string;
    brand: string;
    quantityInStock: number;
    businessType: string;
    // Nullable fields in C# should be (Type | null) in TS
    discountAmount: number | null;
    discountStartUtc: string | null;
    discountEndUtc: string | null;
    tags: string[];
    isActive: boolean;
    isFeatured: boolean;
    supplier: string | null;
    supplierId: number | null;
    soldQuantity: number;
    createdAt: string;
    updatedAt: string | null;
}
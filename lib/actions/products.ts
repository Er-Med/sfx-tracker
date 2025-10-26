"use server";
import z from "zod";
import { getCurrentUser } from "../auth";
import { prisma } from "../prisma";
import { redirect } from "next/navigation";

/**
 * Zod schema for product validation
 * Defines the structure and validation rules for product data
 */
const ProductSchema = z.object({
  name: z.string().min(1, "Name is Required"),
  price: z.coerce.number().nonnegative("Price must be non-negative"),
  quantity: z.coerce.number().int().min(0, "Quantity must be non-negative"),
  sku: z.string().optional(),
  lowStock: z.coerce.number().int().min(0).optional(),
});

/**
 * Server action to create a new product
 * Validates form data and creates a product in the database
 * @param formData - Form data containing product information
 */
export async function createProduct(formData: FormData) {
  const user = await getCurrentUser();

  const parsed = ProductSchema.safeParse({
    name: formData.get("name"),
    price: formData.get("price"),
    quantity: formData.get("quantity"),
    sku: formData.get("sku") || undefined,
    lowStock: formData.get("lowStock") || undefined,
  });

  if (!parsed.success) {
    throw new Error("Validation failed");
  }

  try {
    await prisma.product.create({
      data: { ...parsed.data, userId: user.id },
    });
  } catch (error) {
    throw new Error("Failed to create product " + error);
  }
  redirect("/inventory");
}

/**
 * Server action to delete a product
 * Deletes a product from the database (only if it belongs to the current user)
 * @param formData - Form data containing the product ID to delete
 */
export async function deleteProduct(formData: FormData) {
  const user = await getCurrentUser();

  const id = String(formData.get("id") || "");

  await prisma.product.deleteMany({ where: { id: id, userId: user.id } });
}

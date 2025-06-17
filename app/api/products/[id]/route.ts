import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// Route handler untuk GET produk berdasarkan ID
// GET produk berdasarkan ID
export async function GET(
  req: Request,
  context: { params: { id: string } }
) {
  const { id } = context.params;
  const idNumber = parseInt(id);

  if (isNaN(idNumber)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  try {
    const product = await prisma.product.findUnique({
      where: { id_produk: idNumber },
      select: {
        nama_produk: true,
        harga: true,
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

// PUT untuk update produk
export async function PUT(
  req: Request,
  context: { params: { id: string } }
) {
  const { id } = context.params;
  const idNumber = parseInt(id);

  if (isNaN(idNumber)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  try {
    const data = await req.json();

    const updated = await prisma.product.update({
      where: { id_produk: idNumber },
      data: {
        nama_produk: data.nama_produk,
        harga: data.harga,
        stok: data.stok,
        status: data.status,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

// DELETE untuk menghapus produk
export async function DELETE(
  req: Request,
  context: { params: { id: string } }
) {
  const { id } = context.params;
  const idNumber = parseInt(id);

  if (isNaN(idNumber)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  try {
    await prisma.product.delete({
      where: { id_produk: idNumber },
    });

    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
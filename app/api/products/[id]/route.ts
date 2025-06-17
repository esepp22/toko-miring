import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET transaksi berdasarkan I
export async function GET(
  _req: Request,
  context: { params: { id: string } }
) {
  const { id } = context.params;
  const idNumber = parseInt(id);

  if (isNaN(idNumber)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  try {
    const transaksi = await prisma.transaksi.findUnique({
      where: { id_transaksi: idNumber },
      include: {
        customer: true,
        product: true,
      },
    });

    if (!transaksi) {
      return NextResponse.json({ error: "Transaksi not found" }, { status: 404 });
    }

    return NextResponse.json(transaksi);
  } catch (error) {
    console.error("Error fetching transaksi:", error);
    return NextResponse.json({ error: "Failed to fetch transaksi" }, { status: 500 });
  }
}

// PUT untuk update transaksi berdasarkan ID
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
    const body = await req.json();
    const { status, total_harga, tanggal } = body;

    const updatedTransaksi = await prisma.transaksi.update({
      where: { id_transaksi: idNumber },
      data: {
        total_harga,
        tanggal: tanggal ? new Date(tanggal) : undefined,
        // tambahkan kolom lain jika perlu
      },
    });

    return NextResponse.json(updatedTransaksi, { status: 200 });
  } catch (error) {
    console.error("Error updating transaksi:", error);
    return NextResponse.json({ error: "Failed to update transaksi" }, { status: 500 });
  }
}

// DELETE untuk menghapus transaksi berdasarkan ID
export async function DELETE(
  _req: Request,
  context: { params: { id: string } }
) {
  const { id } = context.params;
  const idNumber = parseInt(id);

  if (isNaN(idNumber)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  try {
    await prisma.transaksi.delete({
      where: { id_transaksi: idNumber },
    });

    return NextResponse.json({ message: "Transaksi deleted successfully" });
  } catch (error) {
    console.error("Error deleting transaksi:", error);
    return NextResponse.json({ error: "Failed to delete transaksi" }, { status: 500 });
  }
}

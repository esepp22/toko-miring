import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * Ambil ID dari request path
 */
function getIdFromRequest(req: NextRequest): number | null {
  const segments = req.nextUrl.pathname.split('/')
  const idStr = segments[segments.length - 1]
  const id = parseInt(idStr)
  return isNaN(id) ? null : id
}

// ✅ GET product by ID
export async function GET(req: NextRequest) {
  const id = getIdFromRequest(req)
  if (id === null) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })
  }

  try {
    const product = await prisma.product.findUnique({
      where: { id_produk: id },
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 })
  }
}

// ✅ UPDATE product by ID
export async function PUT(req: NextRequest) {
  const id = getIdFromRequest(req)
  if (id === null) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })
  }

  try {
    const data = await req.json()
    const { nama_produk, harga, stok, status } = data

    const updated = await prisma.product.update({
      where: { id_produk: id },
      data: { nama_produk, harga, stok, status },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 })
  }
}

// ✅ DELETE product by ID
export async function DELETE(req: NextRequest) {
  const id = getIdFromRequest(req)
  if (id === null) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })
  }

  try {
    await prisma.product.delete({
      where: { id_produk: id },
    })

    return NextResponse.json({ message: 'Product deleted successfully' })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 })
  }
}

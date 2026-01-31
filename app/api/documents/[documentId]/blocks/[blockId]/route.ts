import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ documentId: string; blockId: string }> }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { documentId, blockId } = await params
  const { content } = await request.json()

  // Verify document belongs to user
  const document = await prisma.document.findUnique({
    where: { id: documentId },
  })

  if (!document || document.userId !== user.id) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const block = await prisma.block.update({
    where: { id: blockId },
    data: { content },
  })

  return NextResponse.json(block)
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ documentId: string; blockId: string }> }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { documentId, blockId } = await params

  // Verify document belongs to user
  const document = await prisma.document.findUnique({
    where: { id: documentId },
  })

  if (!document || document.userId !== user.id) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  await prisma.block.delete({
    where: { id: blockId },
  })

  return NextResponse.json({ success: true })
}
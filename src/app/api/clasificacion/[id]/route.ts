import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/db'
import { clasificacionEntries } from '@/db/schema'
import { eq } from 'drizzle-orm'

type Params = { params: { id: string } }

export async function DELETE(_: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  await db.delete(clasificacionEntries).where(eq(clasificacionEntries.id, Number(params.id)))
  return NextResponse.json({ ok: true })
}

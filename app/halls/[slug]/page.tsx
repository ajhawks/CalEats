import { notFound } from 'next/navigation'
import { getMockHall } from '@/app/_lib/data/mock-halls'
import HallDetailClient from './_components/HallDetailClient'

export default async function HallDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const hall = getMockHall(slug)

  if (!hall) notFound()

  return <HallDetailClient hall={hall} />
}

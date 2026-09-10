import { AssessInvite } from "@/components/assess-invite";

export const dynamic = "force-dynamic";

export default async function ShortInvitePage({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ fresh?: string }>;
}) {
  const { token } = await params;
  const { fresh } = await searchParams;
  return <AssessInvite token={token} fresh={fresh === "1"} />;
}

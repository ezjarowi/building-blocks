import { AssessInvite } from "@/components/assess-invite";

export const dynamic = "force-dynamic";

export default async function AssessPage({
  searchParams,
}: {
  searchParams: Promise<{ to?: string; fresh?: string }>;
}) {
  const { to, fresh } = await searchParams;
  return <AssessInvite token={to} fresh={fresh === "1"} />;
}

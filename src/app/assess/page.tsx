import { AssessInvite } from "@/components/assess-invite";

export const dynamic = "force-dynamic";

export default async function AssessPage({
  searchParams,
}: {
  searchParams: Promise<{ to?: string }>;
}) {
  const { to } = await searchParams;
  return <AssessInvite token={to} />;
}

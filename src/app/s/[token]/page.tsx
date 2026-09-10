import { AssessInvite } from "@/components/assess-invite";

export const dynamic = "force-dynamic";

export default async function ShortInvitePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  return <AssessInvite token={token} />;
}

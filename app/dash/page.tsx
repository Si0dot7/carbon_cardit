
import CarbonDashPageClient from "./CarbonDashPageClient";

type SP = { plot?: string | string[]; mode?: string | string[] };

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<SP>;
}) {
  const sp = await searchParams;               
  const id = typeof sp.plot === "string" ? sp.plot : "";
  const mode = sp.mode === "pro" ? "pro" : "simple";

  return <CarbonDashPageClient initialPlotId={id} initialMode={mode} />;
}

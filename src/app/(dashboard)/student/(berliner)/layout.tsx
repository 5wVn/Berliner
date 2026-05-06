import type { ReactNode } from "react";
import { loadBerlinerState } from "../../_berliner/loadBerlinerState";
import { BerlinerStateProvider } from "../../_berliner/BerlinerStateContext";
import { MobileLayout } from "../../_berliner/MobileLayout";

export default async function StudentBerlinerLayout({
  children,
}: {
  children: ReactNode;
}) {
  const state = await loadBerlinerState("student");
  return (
    <BerlinerStateProvider value={state}>
      <MobileLayout role="student">{children}</MobileLayout>
    </BerlinerStateProvider>
  );
}

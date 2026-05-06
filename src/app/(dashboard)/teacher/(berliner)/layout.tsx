import type { ReactNode } from "react";
import { loadBerlinerState } from "../../_berliner/loadBerlinerState";
import { BerlinerStateProvider } from "../../_berliner/BerlinerStateContext";
import { MobileLayout } from "../../_berliner/MobileLayout";

export default async function TeacherBerlinerLayout({
  children,
}: {
  children: ReactNode;
}) {
  const state = await loadBerlinerState("teacher");
  return (
    <BerlinerStateProvider value={state}>
      <MobileLayout role="teacher">{children}</MobileLayout>
    </BerlinerStateProvider>
  );
}

"use client";

import { use } from "react";
import { Suspense } from "react";
import { ResumeBuilderPage } from "@/components/resumes/ResumeBuilderPage";

type Props = { params: Promise<{ id: string }> };

function BuildPage({ params }: Props) {
  const { id } = use(params);
  return (
    <Suspense>
      <ResumeBuilderPage resumeId={id} />
    </Suspense>
  );
}

export default BuildPage;

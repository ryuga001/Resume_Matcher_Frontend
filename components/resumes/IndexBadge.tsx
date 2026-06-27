import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { IndexStatus } from "@/components/resumes/types";

export function IndexBadge({ status }: { status: IndexStatus }) {
  if (status === "ready") return <Badge variant="success">Ready</Badge>;
  if (status === "processing")
    return (
      <Badge variant="warning" className="gap-1">
        <Loader2 className="size-2.5 animate-spin" />
        Indexing…
      </Badge>
    );
  return <Badge variant="error">Error</Badge>;
}

import { Loader2Icon } from "lucide-react";

import { Button } from "./button";

export function ButtonLoading() {
  return (
    <Button className="w-full" disabled>
      <Loader2Icon className="animate-spin" />
      Please wait
    </Button>
  );
}

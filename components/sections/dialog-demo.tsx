"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

/** Isolated dialog demo for the design-system page. */
export function DialogDemo() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" data-cursor="hover">
          Open dialog
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>A well-behaved dialog</DialogTitle>
          <DialogDescription>
            Radix primitives underneath: focus trap, ESC to close, scroll lock
            and ARIA wiring come for free.
          </DialogDescription>
        </DialogHeader>
        <p className="text-sm text-foreground/80">
          Style it once here, reuse it on every client project.
        </p>
      </DialogContent>
    </Dialog>
  );
}

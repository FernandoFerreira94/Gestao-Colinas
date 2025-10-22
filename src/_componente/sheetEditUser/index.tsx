import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function SheetEditUser() {
  return (
    <Sheet>
      <SheetTrigger></SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Sheet</SheetTitle>
          <SheetDescription>description</SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}

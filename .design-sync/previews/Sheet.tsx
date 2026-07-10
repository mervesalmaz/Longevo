import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  Button,
} from 'longevo'

export const FilterPanel = () => (
  <Sheet defaultOpen>
    <SheetContent side="right">
      <SheetHeader>
        <SheetTitle>Filter clinics</SheetTitle>
        <SheetDescription>Narrow results by location, focus area, and rating.</SheetDescription>
      </SheetHeader>
      <div className="grid gap-2 py-4 text-sm text-muted-foreground">
        <div>Location · Europe</div>
        <div>Focus · Regenerative medicine</div>
        <div>Rating · 4.5 and up</div>
      </div>
      <SheetFooter>
        <Button variant="outline">Reset</Button>
        <Button>Apply filters</Button>
      </SheetFooter>
    </SheetContent>
  </Sheet>
)

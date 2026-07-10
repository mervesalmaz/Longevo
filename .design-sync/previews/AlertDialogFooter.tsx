import { AlertDialogFooter, Button } from 'longevo'

// AlertDialogFooter is the action bar of an alert dialog; its negative margins
// bleed it to the edges of the padded panel it sits in.
export const InContext = () => (
  <div className="w-[300px] rounded-xl border bg-background p-4">
    <p className="pb-3 text-sm text-muted-foreground">
      This removes Helios Longevity from your saved list.
    </p>
    <AlertDialogFooter>
      <Button variant="outline">Cancel</Button>
      <Button variant="destructive">Remove</Button>
    </AlertDialogFooter>
  </div>
)

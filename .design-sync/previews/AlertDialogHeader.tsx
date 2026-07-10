import { AlertDialogHeader, AlertDialogMedia } from 'longevo'

const AlertIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
)

// AlertDialogHeader is a layout wrapper; shown here inside a dialog-like panel.
export const InContext = () => (
  <div className="w-[300px] rounded-xl border bg-background p-4">
    <AlertDialogHeader>
      <AlertDialogMedia>
        <AlertIcon />
      </AlertDialogMedia>
      <h2 className="text-base font-medium">Remove this clinic?</h2>
      <p className="text-sm text-muted-foreground">
        This removes Helios Longevity from your saved list.
      </p>
    </AlertDialogHeader>
  </div>
)

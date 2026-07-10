import { AlertDialogMedia } from 'longevo'

const ShieldIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
)

// AlertDialogMedia is the icon slot at the top of an alert dialog.
export const InContext = () => (
  <div className="flex items-center gap-3">
    <AlertDialogMedia>
      <ShieldIcon />
    </AlertDialogMedia>
    <div>
      <div className="text-sm font-medium">Action required</div>
      <div className="text-sm text-muted-foreground">Confirm before continuing</div>
    </div>
  </div>
)

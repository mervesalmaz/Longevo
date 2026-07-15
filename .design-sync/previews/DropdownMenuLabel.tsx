import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
  Button,
} from 'longevo'

// DropdownMenuLabel is a non-interactive section heading inside a menu.
export const InMenu = () => (
  <DropdownMenu defaultOpen modal={false}>
    <DropdownMenuTrigger asChild>
      <Button variant="outline">Account</Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent className="w-56">
      <DropdownMenuLabel>My account</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem>Profile</DropdownMenuItem>
      <DropdownMenuItem>Saved clinics</DropdownMenuItem>
      <DropdownMenuItem>Sign out</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
)

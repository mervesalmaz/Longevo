import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  Button,
} from 'longevo'

export const ClinicActions = () => (
  <DropdownMenu defaultOpen modal={false}>
    <DropdownMenuTrigger asChild>
      <Button variant="outline">Clinic actions</Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent className="w-56">
      <DropdownMenuLabel>Helios Longevity</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem>View details</DropdownMenuItem>
        <DropdownMenuItem>Save to list</DropdownMenuItem>
        <DropdownMenuItem>Compare clinics</DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuItem>Report an issue</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
)

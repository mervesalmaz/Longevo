import { Separator } from 'longevo'

export const Horizontal = () => (
  <div className="w-[300px]">
    <div className="space-y-1">
      <h4 className="text-sm font-medium leading-none">Helios Longevity Clinic</h4>
      <p className="text-sm text-muted-foreground">Preventive &amp; regenerative medicine</p>
    </div>
    <Separator className="my-4" />
    <div className="flex h-5 items-center gap-4 text-sm">
      <span>Overview</span>
      <Separator orientation="vertical" />
      <span>Reviews</span>
      <Separator orientation="vertical" />
      <span>Treatments</span>
    </div>
  </div>
)

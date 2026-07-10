import { Label, Input, Switch } from 'longevo'

export const WithInput = () => (
  <div className="grid w-[280px] gap-1.5">
    <Label htmlFor="clinic-name">Clinic name</Label>
    <Input id="clinic-name" placeholder="e.g. Helios Longevity" />
  </div>
)

export const WithControl = () => (
  <div className="flex items-center gap-2">
    <Switch id="newsletter" defaultChecked />
    <Label htmlFor="newsletter">Email me new clinic reviews</Label>
  </div>
)

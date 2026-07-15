import { Input, Label } from 'longevo'

export const Default = () => (
  <div className="w-[280px]">
    <Input placeholder="Search clinics…" />
  </div>
)

export const WithLabel = () => (
  <div className="grid w-[280px] gap-1.5">
    <Label htmlFor="email">Email</Label>
    <Input id="email" type="email" placeholder="you@example.com" />
  </div>
)

export const States = () => (
  <div className="grid w-[280px] gap-3">
    <Input defaultValue="Helios Longevity Clinic" />
    <Input placeholder="Disabled" disabled />
  </div>
)

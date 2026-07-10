import { Switch, Label } from 'longevo'

export const States = () => (
  <div className="flex items-center gap-6">
    <Switch defaultChecked />
    <Switch />
    <Switch disabled defaultChecked />
    <Switch disabled />
  </div>
)

export const Sizes = () => (
  <div className="flex items-center gap-6">
    <Switch size="default" defaultChecked />
    <Switch size="sm" defaultChecked />
  </div>
)

export const WithLabel = () => (
  <div className="flex flex-col gap-3">
    <div className="flex items-center gap-2">
      <Switch id="s-verified" defaultChecked />
      <Label htmlFor="s-verified">Verified clinics only</Label>
    </div>
    <div className="flex items-center gap-2">
      <Switch id="s-accepting" />
      <Label htmlFor="s-accepting">Accepting new patients</Label>
    </div>
  </div>
)

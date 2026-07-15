import { Button } from 'longevo'

export const Variants = () => (
  <div className="flex flex-wrap items-center gap-3">
    <Button>Book consultation</Button>
    <Button variant="secondary">Save clinic</Button>
    <Button variant="outline">Compare</Button>
    <Button variant="ghost">Dismiss</Button>
    <Button variant="destructive">Remove</Button>
    <Button variant="link">Learn more</Button>
  </div>
)

export const Sizes = () => (
  <div className="flex flex-wrap items-center gap-3">
    <Button size="sm">Small</Button>
    <Button size="default">Default</Button>
    <Button size="lg">Large</Button>
  </div>
)

export const States = () => (
  <div className="flex flex-wrap items-center gap-3">
    <Button>Enabled</Button>
    <Button disabled>Disabled</Button>
    <Button variant="outline" disabled>
      Disabled outline
    </Button>
  </div>
)

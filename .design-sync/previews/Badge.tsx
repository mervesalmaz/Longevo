import { Badge } from 'longevo'

export const Variants = () => (
  <div className="flex flex-wrap items-center gap-2">
    <Badge>Default</Badge>
    <Badge variant="secondary">Secondary</Badge>
    <Badge variant="destructive">Destructive</Badge>
    <Badge variant="outline">Outline</Badge>
  </div>
)

export const ClinicStatuses = () => (
  <div className="flex flex-wrap items-center gap-2">
    <Badge className="border-transparent bg-longevo-green text-white hover:bg-longevo-green/90">
      Verified
    </Badge>
    <Badge variant="secondary">Accepting patients</Badge>
    <Badge variant="outline">Longevity focus</Badge>
    <Badge variant="destructive">Waitlist closed</Badge>
  </div>
)

export const WithCount = () => (
  <div className="flex flex-wrap items-center gap-3">
    <Badge variant="secondary">Reviews 128</Badge>
    <Badge variant="secondary">Treatments 24</Badge>
    <Badge>New</Badge>
  </div>
)

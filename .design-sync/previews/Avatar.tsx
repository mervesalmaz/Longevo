import { Avatar, AvatarImage, AvatarFallback } from 'longevo'

const face =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    "<svg xmlns='http://www.w3.org/2000/svg' width='80' height='80'><rect width='80' height='80' fill='#00aa6c'/><circle cx='40' cy='32' r='16' fill='#fff'/><circle cx='40' cy='78' r='26' fill='#fff'/></svg>"
  )

export const WithImage = () => (
  <Avatar>
    <AvatarImage src={face} alt="Dr. Anna Weber" />
    <AvatarFallback>AW</AvatarFallback>
  </Avatar>
)

export const Fallback = () => (
  <div className="flex items-center gap-3">
    <Avatar>
      <AvatarFallback>AW</AvatarFallback>
    </Avatar>
    <Avatar>
      <AvatarFallback className="bg-longevo-green text-white">HL</AvatarFallback>
    </Avatar>
    <Avatar>
      <AvatarFallback>JD</AvatarFallback>
    </Avatar>
  </div>
)

export const Group = () => (
  <div className="flex -space-x-2">
    <Avatar className="ring-2 ring-background">
      <AvatarFallback>AW</AvatarFallback>
    </Avatar>
    <Avatar className="ring-2 ring-background">
      <AvatarFallback className="bg-longevo-green text-white">HL</AvatarFallback>
    </Avatar>
    <Avatar className="ring-2 ring-background">
      <AvatarFallback>JD</AvatarFallback>
    </Avatar>
    <Avatar className="ring-2 ring-background">
      <AvatarFallback>+5</AvatarFallback>
    </Avatar>
  </div>
)

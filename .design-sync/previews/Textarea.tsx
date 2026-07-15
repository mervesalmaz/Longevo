import { Textarea, Label } from 'longevo'

export const Default = () => (
  <div className="w-[320px]">
    <Textarea placeholder="Write your review of this clinic…" />
  </div>
)

export const WithLabel = () => (
  <div className="grid w-[320px] gap-1.5">
    <Label htmlFor="review">Your review</Label>
    <Textarea
      id="review"
      defaultValue="Excellent experience — thorough biological-age testing and a genuinely personalized protocol."
    />
  </div>
)

export const Disabled = () => (
  <div className="w-[320px]">
    <Textarea placeholder="Reviews are closed" disabled />
  </div>
)

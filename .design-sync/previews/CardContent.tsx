import { Card, CardHeader, CardTitle, CardContent } from 'longevo'

export const InCard = () => (
  <Card className="w-[320px]">
    <CardHeader>
      <CardTitle>About the clinic</CardTitle>
    </CardHeader>
    <CardContent className="text-sm text-muted-foreground">
      Comprehensive biological-age testing, hormone optimization, and personalized
      longevity protocols led by board-certified physicians.
    </CardContent>
  </Card>
)

import { Card, CardHeader, CardTitle, CardContent, CardFooter, Button } from 'longevo'

export const InCard = () => (
  <Card className="w-[320px]">
    <CardHeader>
      <CardTitle>Ready to book?</CardTitle>
    </CardHeader>
    <CardContent className="text-sm text-muted-foreground">
      Schedule an introductory call with a longevity specialist.
    </CardContent>
    <CardFooter className="justify-between">
      <span className="text-sm font-medium">Free · 20 min</span>
      <Button size="sm">Book now</Button>
    </CardFooter>
  </Card>
)

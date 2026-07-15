import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Button,
  Badge,
} from 'longevo'

export const ClinicCard = () => (
  <Card className="w-[340px]">
    <CardHeader>
      <div className="flex items-center justify-between">
        <CardTitle>Helios Longevity Clinic</CardTitle>
        <Badge className="border-transparent bg-longevo-green text-white">Verified</Badge>
      </div>
      <CardDescription>Zurich, Switzerland · Preventive &amp; regenerative medicine</CardDescription>
    </CardHeader>
    <CardContent className="text-sm text-muted-foreground">
      Comprehensive biological-age testing, hormone optimization, and personalized
      longevity protocols led by board-certified physicians.
    </CardContent>
    <CardFooter className="justify-between">
      <span className="text-sm font-medium">4.8 · 214 reviews</span>
      <Button size="sm">View clinic</Button>
    </CardFooter>
  </Card>
)

export const StatCard = () => (
  <Card className="w-[240px]">
    <CardHeader className="pb-2">
      <CardDescription>Clinics reviewed</CardDescription>
      <CardTitle className="text-3xl">1,240</CardTitle>
    </CardHeader>
    <CardContent className="text-xs text-longevo-green">+12% this quarter</CardContent>
  </Card>
)

export const SimpleCard = () => (
  <Card className="w-[320px]">
    <CardHeader>
      <CardTitle>Book a consultation</CardTitle>
      <CardDescription>Schedule an intro call with a longevity specialist.</CardDescription>
    </CardHeader>
    <CardFooter>
      <Button className="w-full">Get started</Button>
    </CardFooter>
  </Card>
)

import { Tabs, TabsList, TabsTrigger, TabsContent } from 'longevo'

export const Default = () => (
  <Tabs defaultValue="overview" className="flex-col w-[420px]">
    <TabsList>
      <TabsTrigger value="overview">Overview</TabsTrigger>
      <TabsTrigger value="reviews">Reviews</TabsTrigger>
      <TabsTrigger value="treatments">Treatments</TabsTrigger>
    </TabsList>
    <TabsContent value="overview" className="pt-3 text-sm text-muted-foreground">
      Helios Longevity Clinic specializes in preventive and regenerative medicine,
      with a focus on biological-age optimization.
    </TabsContent>
    <TabsContent value="reviews" className="pt-3 text-sm text-muted-foreground">
      214 verified patient reviews · 4.8 average rating.
    </TabsContent>
    <TabsContent value="treatments" className="pt-3 text-sm text-muted-foreground">
      Hormone optimization, NAD+ therapy, and personalized supplement protocols.
    </TabsContent>
  </Tabs>
)

export const LineVariant = () => (
  <Tabs defaultValue="clinics" className="flex-col w-[420px]">
    <TabsList variant="line">
      <TabsTrigger value="clinics">Clinics</TabsTrigger>
      <TabsTrigger value="doctors">Doctors</TabsTrigger>
      <TabsTrigger value="articles">Articles</TabsTrigger>
    </TabsList>
    <TabsContent value="clinics" className="pt-3 text-sm text-muted-foreground">
      Browse 1,240 longevity clinics worldwide.
    </TabsContent>
    <TabsContent value="doctors" className="pt-3 text-sm text-muted-foreground">
      Find board-certified longevity physicians.
    </TabsContent>
    <TabsContent value="articles" className="pt-3 text-sm text-muted-foreground">
      Evidence-based guides on longevity medicine.
    </TabsContent>
  </Tabs>
)

import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from 'longevo'

export const ClinicDirectory = () => (
  <Table>
    <TableCaption>Longevity clinics reviewed this quarter</TableCaption>
    <TableHeader>
      <TableRow>
        <TableHead>Clinic</TableHead>
        <TableHead>Location</TableHead>
        <TableHead>Focus</TableHead>
        <TableHead className="text-right">Rating</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow>
        <TableCell className="font-medium">Helios Longevity</TableCell>
        <TableCell>Zurich</TableCell>
        <TableCell>Regenerative</TableCell>
        <TableCell className="text-right">4.8</TableCell>
      </TableRow>
      <TableRow>
        <TableCell className="font-medium">Vitalis Institute</TableCell>
        <TableCell>Berlin</TableCell>
        <TableCell>Preventive</TableCell>
        <TableCell className="text-right">4.6</TableCell>
      </TableRow>
      <TableRow>
        <TableCell className="font-medium">Aeon Health</TableCell>
        <TableCell>London</TableCell>
        <TableCell>Hormonal</TableCell>
        <TableCell className="text-right">4.5</TableCell>
      </TableRow>
    </TableBody>
    <TableFooter>
      <TableRow>
        <TableCell colSpan={3}>Average rating</TableCell>
        <TableCell className="text-right">4.6</TableCell>
      </TableRow>
    </TableFooter>
  </Table>
)

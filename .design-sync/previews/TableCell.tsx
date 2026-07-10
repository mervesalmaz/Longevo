import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from 'longevo'

export const InTable = () => (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Clinic</TableHead>
        <TableHead>Focus</TableHead>
        <TableHead className="text-right">Reviews</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow>
        <TableCell className="font-medium">Helios Longevity</TableCell>
        <TableCell>Regenerative</TableCell>
        <TableCell className="text-right">214</TableCell>
      </TableRow>
      <TableRow>
        <TableCell className="font-medium">Vitalis Institute</TableCell>
        <TableCell>Preventive</TableCell>
        <TableCell className="text-right">98</TableCell>
      </TableRow>
    </TableBody>
  </Table>
)

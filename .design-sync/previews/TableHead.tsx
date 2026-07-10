import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from 'longevo'

export const InTable = () => (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Clinic</TableHead>
        <TableHead>Location</TableHead>
        <TableHead className="text-right">Rating</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow>
        <TableCell className="font-medium">Helios Longevity</TableCell>
        <TableCell>Zurich</TableCell>
        <TableCell className="text-right">4.8</TableCell>
      </TableRow>
    </TableBody>
  </Table>
)

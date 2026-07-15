import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableCaption } from 'longevo'

export const InTable = () => (
  <Table>
    <TableCaption>A list of recently reviewed longevity clinics.</TableCaption>
    <TableHeader>
      <TableRow>
        <TableHead>Clinic</TableHead>
        <TableHead className="text-right">Rating</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow>
        <TableCell className="font-medium">Helios Longevity</TableCell>
        <TableCell className="text-right">4.8</TableCell>
      </TableRow>
      <TableRow>
        <TableCell className="font-medium">Aeon Health</TableCell>
        <TableCell className="text-right">4.5</TableCell>
      </TableRow>
    </TableBody>
  </Table>
)

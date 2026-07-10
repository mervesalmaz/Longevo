import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Button,
} from 'longevo'

export const BookConsultation = () => (
  <Dialog defaultOpen>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Book a consultation</DialogTitle>
        <DialogDescription>
          Request an introductory call with a longevity specialist at Helios Longevity Clinic.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button variant="outline">Cancel</Button>
        <Button>Confirm booking</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
)

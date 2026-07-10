import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
} from 'longevo'

export const Placeholder = () => (
  <div className="w-[240px]">
    <Select>
      <SelectTrigger>
        <SelectValue placeholder="Select a focus area" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="preventive">Preventive medicine</SelectItem>
          <SelectItem value="regenerative">Regenerative medicine</SelectItem>
          <SelectItem value="hormonal">Hormone optimization</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  </div>
)

export const WithValue = () => (
  <div className="w-[240px]">
    <Select defaultValue="regenerative">
      <SelectTrigger>
        <SelectValue placeholder="Select a focus area" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="preventive">Preventive medicine</SelectItem>
        <SelectItem value="regenerative">Regenerative medicine</SelectItem>
        <SelectItem value="hormonal">Hormone optimization</SelectItem>
      </SelectContent>
    </Select>
  </div>
)

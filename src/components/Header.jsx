import { Button } from "@/components/ui/button"
import { Mail } from "lucide-react"

export default function Header() {
  return (
    <header className="border-b bg-card">
      <div className="flex h-16 items-center px-6">
        <div className="flex items-center space-x-2">
          <Mail className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-semibold">Mass Mail Dispatcher</h1>
        </div>
      </div>
    </header>
  )
}

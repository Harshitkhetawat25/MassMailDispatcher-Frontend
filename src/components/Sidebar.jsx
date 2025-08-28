import { Button } from "@/components/ui/button"
import { Mail, Upload, FileText, Activity, Clock } from "lucide-react"
import { SidebarProfile } from "./SidebarProfile"

export default function Sidebar() {
  const user = {
    name: "Harshit",
    email: "harshitkhetawat25@gmail.com",
    avatar: "/vite.svg",
  }

  return (
    <aside className="w-64 border-r bg-card min-h-[calc(100vh-4rem)] flex flex-col">
      <nav className="p-4 space-y-2 flex-1">
        <Button variant="default" className="w-full justify-start" size="sm">
          <Mail className="mr-2 h-4 w-4" />
          Send Mail
        </Button>
        <Button variant="ghost" className="w-full justify-start" size="sm">
          <Upload className="mr-2 h-4 w-4" />
          Upload CSV
        </Button>
        <Button variant="ghost" className="w-full justify-start" size="sm">
          <FileText className="mr-2 h-4 w-4" />
          Manage Templates
        </Button>
        <Button variant="ghost" className="w-full justify-start" size="sm">
          <Activity className="mr-2 h-4 w-4" />
          View Logs
        </Button>
        <Button variant="ghost" className="w-full justify-start" size="sm">
          <Clock className="mr-2 h-4 w-4" />
          Drafts
        </Button>
      </nav>

      <div className="p-4 border-t">
        <SidebarProfile user={user} />
      </div>
    </aside>
  )
}

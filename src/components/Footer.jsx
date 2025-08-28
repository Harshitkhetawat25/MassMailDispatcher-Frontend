export default function Footer() {
  return (
    <footer className="border-t bg-card mt-auto">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-4">
          <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
            Help
          </a>
          <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
            Feedback
          </a>
          <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
            Contact Support
          </a>
        </div>
        <p className="text-sm text-muted-foreground">© 2025 Mass Mail Dispatcher</p>
      </div>
    </footer>
  )
}

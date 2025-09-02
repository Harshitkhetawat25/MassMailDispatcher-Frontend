export default function Footer() {
  return (
    <footer className="border-t bg-card mt-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 md:px-6 py-4 gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <a
            href="#"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Help
          </a>
          <a
            href="#"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Feedback
          </a>
          <a
            href="#"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Contact Support
          </a>
        </div>
        <p className="text-sm text-muted-foreground">
          © 2025 Mass Mail Dispatcher
        </p>
      </div>
    </footer>
  );
}

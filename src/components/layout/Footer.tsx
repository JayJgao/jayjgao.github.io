export function Footer() {
  return (
    <footer className="border-t border-white/10 py-8">
      <div className="page-container flex flex-col gap-3 text-sm text-muted md:flex-row md:items-center md:justify-between">
        <p>AI Product Portfolio</p>
        <div className="flex items-center gap-4">
          <a href="https://github.com/JayJgao" className="hover:text-white">
            GitHub
          </a>
          <a href="mailto:rhwogus0205@gmail.com" className="hover:text-white">
            Email
          </a>
          <span>© 2026 Jay Ko</span>
        </div>
      </div>
    </footer>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-white/10 py-7 md:py-8">
      <div className="page-container flex flex-col gap-3 text-sm text-white/62 md:flex-row md:items-center md:justify-between">
        <p className="text-white/56">Jay Ko Portfolio</p>
        <div className="flex items-center gap-4">
          <a href="https://github.com/JayJgao" className="hover:text-white/92">
            GitHub
          </a>
          <a href="mailto:rhwogus0205@gmail.com" className="hover:text-white/92">
            Email
          </a>
          <span className="text-white/56">© 2026 Jay Ko</span>
        </div>
      </div>
    </footer>
  );
}

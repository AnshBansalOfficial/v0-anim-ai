import { FaGithub } from "react-icons/fa"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface TopBarProps {
  showAuth?: boolean
}

export default function TopBar({ showAuth = true }: TopBarProps) {
  return (
    <div className="bg-background border-b border-border px-8 py-5 flex items-center justify-between">
      {/* Left Side: Logo and Title */}
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg">
          <span className="text-primary-foreground font-black text-lg">A</span>
        </div>
        <div>
          <h1 className="text-2xl font-black text-foreground tracking-tighter">AnimAI</h1>
          <p className="text-xs text-muted-foreground font-semibold">Math • Physics • Chemistry</p>
        </div>
      </div>

      {/* Right Side Content */}
      <div className="flex items-center gap-4">
        <p className="text-muted-foreground text-sm hidden sm:block font-semibold">Scientific AI-Powered Animations</p>

        {showAuth && (
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link href="/auth/login">Login</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/auth/sign-up">Sign Up</Link>
            </Button>
          </div>
        )}

        <a
          href="https://github.com/pushpitkamboj/AnimAI"
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-foreground transition-all duration-300 hover:scale-110"
          aria-label="View AnimAI on GitHub"
        >
          <FaGithub size={20} />
        </a>
      </div>
    </div>
  )
}

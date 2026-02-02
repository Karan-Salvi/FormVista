import { Link } from 'react-router-dom'
import { Sparkles } from 'lucide-react'

function Footer() {
  return (
    <footer className="bg-background mx-auto max-w-5xl border-t border-gray-200 px-2 py-12 text-start sm:px-4 md:px-6">
      <div className="container mx-auto">
        <div className="flex flex-col justify-between md:flex-row">
          <div className="mb-8 md:mb-0">
            <Link to="/" className="flex items-center gap-2">
              <Sparkles className="text-primary h-6 w-6" />
              <h2 className="text-lg font-bold">FormVista</h2>
            </Link>

            <p className="mt-5 text-xs sm:text-sm dark:text-gray-400">
              © {new Date().getFullYear()} FormVista. All rights reserved.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 text-start text-sm sm:text-base md:grid-cols-3">
            <div>
              <h3 className="mb-4 font-semibold">Pages</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/builder"
                    className="text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white"
                  >
                    Builder
                  </Link>
                </li>
                <li>
                  <Link
                    to="/"
                    className="text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white"
                  >
                    Components
                  </Link>
                </li>
                <li>
                  <Link
                    to="/"
                    className="text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white"
                  >
                    Examples
                  </Link>
                </li>
                <li>
                  <Link
                    to="/"
                    className="text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white"
                  >
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 font-semibold">Socials</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white"
                  >
                    Github
                  </a>
                </li>
                <li>
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white"
                  >
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a
                    href="https://x.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white"
                  >
                    X
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 font-semibold">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/"
                    className="text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    to="/"
                    className="text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white"
                  >
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-4 flex w-full items-center justify-center">
          <h1 className="bg-gradient-to-b from-blue-700 to-blue-900 bg-clip-text text-center text-2xl font-bold text-transparent select-none sm:text-3xl md:text-5xl lg:text-[10rem]">
            FormVista
          </h1>
        </div>
      </div>
    </footer>
  )
}

export { Footer }

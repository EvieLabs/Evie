export default function Footer() {
  return (
    <footer>
      <div>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path
            fill="#23272a"
            fillOpacity={1}
            d="M0,192L48,208C96,224,192,256,288,272C384,288,480,288,576,256C672,224,768,160,864,149.3C960,139,1056,181,1152,197.3C1248,213,1344,203,1392,197.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>
        <section className="bg-[#23272a]">
          <div className="max-w-screen-xl px-4 py-12 mx-auto overflow-hidden sm:px-6 lg:px-8">
            <nav className="flex justify-center mt-8">
              <div className="px-5 py-2 m-5">
                <a
                  className="text-gray-500 hover:text-gray-900"
                  href="https://evie.pw/invite"
                >
                  Invite Evie
                </a>
              </div>
              <div className="px-5 py-2 m-5">
                <a
                  href="https://evie.pw/discord"
                  className="text-gray-500 hover:text-gray-900"
                >
                  Support Server
                </a>
              </div>
              <div className="px-5 py-2 m-5">
                <a
                  href="/privacy"
                  className="text-gray-500 hover:text-gray-900"
                >
                  Privacy Policy
                </a>
              </div>
            </nav>
            <div className="flex justify-center mt-8">
              <a
                href="https://github.com/TeamEvie/Evie"
                className="text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">GitHub</span>
                <svg
                  className="w-6 h-6"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              </a>
            </div>
            <p className="mt-8 text-base text-center text-gray-400">
              &quot;keeping that server of yours safe&quot;
            </p>
          </div>
        </section>
      </div>
    </footer>
  );
}

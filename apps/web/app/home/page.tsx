import Link from "next/link";

const features = [
  {
    code: "01",
    title: "ADAPTIVE ATMOSPHERE",
    text: "Your listening space changes with the moment.",
  },
  {
    code: "02",
    title: "MUSIC DNA",
    text: "Build a deeper picture of your evolving taste.",
  },
  {
    code: "03",
    title: "ONE-TAP SESSIONS",
    text: "Start the right listening session without digging through menus.",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#110b08] text-[#f5efe8]">
      <nav className="sticky top-0 z-50 border-b border-[#c9b29b]/10 bg-[#110b08]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <Link
            href="/home"
            className="text-xl font-black tracking-[-0.06em]"
          >
            SONORA<span className="text-[#c9b29b]">.</span>
          </Link>

          <div className="hidden items-center gap-8 text-xs uppercase tracking-[0.18em] text-[#f5efe8]/55 md:flex">
            <a href="#system" className="transition hover:text-[#f5efe8]">
              System
            </a>
            <a href="#frequency" className="transition hover:text-[#f5efe8]">
              Frequency
            </a>
            <a href="#about" className="transition hover:text-[#f5efe8]">
              About
            </a>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="rounded-full px-4 py-2 text-xs uppercase tracking-[0.15em] text-[#f5efe8]/70 transition hover:bg-white/5 hover:text-[#f5efe8]"
            >
              Login
            </Link>

            <Link
              href="/signup"
              className="rounded-full border border-[#c9b29b]/20 bg-[#c9b29b]/10 px-4 py-2 text-xs uppercase tracking-[0.15em] text-[#f5efe8] transition hover:bg-[#c9b29b]/20"
            >
              Create Account
            </Link>
          </div>
        </div>
      </nav>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(201,178,155,0.12),transparent_32%)]" />

        <div className="relative mx-auto max-w-7xl px-5 pb-24 pt-20 lg:px-8 lg:pb-32 lg:pt-28">
          <div className="max-w-5xl">
            <div className="mb-6 flex items-center gap-3 text-[10px] uppercase tracking-[0.28em] text-[#c9b29b]">
              <span className="h-px w-10 bg-[#c9b29b]" />
              AI RETRO MUSIC MACHINE
            </div>

            <h1 className="max-w-5xl text-5xl font-black leading-[0.92] tracking-[-0.065em] sm:text-7xl lg:text-[8rem]">
              YOUR MUSIC.
              <br />
              YOUR{" "}
              <span className="text-[#c9b29b]">
                FREQUENCY.
              </span>
            </h1>

            <p className="mt-8 max-w-2xl text-base leading-7 text-[#f5efe8]/60 sm:text-lg">
              SONORA turns listening into an adaptive experience —
              discovery, atmosphere, memory and playback inside one
              retro-futuristic music machine.
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center rounded-full bg-[#f5efe8] px-7 py-3.5 text-sm font-semibold text-[#110b08] transition hover:scale-[1.02]"
              >
                Start Listening
              </Link>

              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-full border border-[#c9b29b]/20 bg-white/[0.03] px-7 py-3.5 text-sm text-[#f5efe8]/80 backdrop-blur-xl transition hover:bg-white/[0.06]"
              >
                Enter Machine
              </Link>
            </div>
          </div>

          <div className="mt-20 overflow-hidden rounded-[2rem] border border-[#c9b29b]/10 bg-white/[0.025] p-5 backdrop-blur-xl">
            <div className="mb-5 flex items-center justify-between text-[9px] uppercase tracking-[0.2em] text-[#f5efe8]/35">
              <span>LIVE FREQUENCY VISUALIZER</span>
              <span>SONORA / 01</span>
            </div>

            <div className="flex h-40 items-center justify-center gap-[3px] overflow-hidden rounded-[1.5rem] bg-[#0c0806] px-3">
              {Array.from({ length: 64 }).map((_, index) => (
                <span
                  key={index}
                  className="w-1 rounded-full bg-[#c9b29b]/70"
                  style={{
                    height: `${20 + ((index * 37) % 100)}px`,
                    animation: "sonora-wave 1.2s ease-in-out infinite",
                    animationDelay: `${index * 0.025}s`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        id="system"
        className="mx-auto max-w-7xl px-5 py-20 lg:px-8"
      >
        <div className="grid gap-4 lg:grid-cols-3">
          {features.map((feature) => (
            <article
              key={feature.code}
              className="rounded-[1.5rem] border border-[#c9b29b]/10 bg-white/[0.025] p-6 backdrop-blur-xl transition hover:-translate-y-1 hover:bg-white/[0.04]"
            >
              <div className="text-xs tracking-[0.2em] text-[#c9b29b]">
                {feature.code}
              </div>

              <h2 className="mt-14 text-lg font-semibold tracking-tight">
                {feature.title}
              </h2>

              <p className="mt-3 text-sm leading-6 text-[#f5efe8]/50">
                {feature.text}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section
        id="frequency"
        className="mx-auto max-w-7xl px-5 pb-24 lg:px-8"
      >
        <div className="rounded-[2rem] border border-[#c9b29b]/10 bg-gradient-to-br from-[#4a3428]/30 to-transparent p-8 lg:p-12">
          <div className="max-w-3xl">
            <div className="text-[10px] uppercase tracking-[0.25em] text-[#c9b29b]">
              THE MACHINE IS WAITING
            </div>

            <h2 className="mt-4 text-4xl font-black tracking-[-0.05em] sm:text-6xl">
              Press play.
              <br />
              Find your frequency.
            </h2>

            <Link
              href="/signup"
              className="mt-8 inline-flex rounded-full border border-[#c9b29b]/20 bg-[#c9b29b]/10 px-6 py-3 text-sm"
            >
              Create your SONORA account
            </Link>
          </div>
        </div>
      </section>

      <footer
        id="about"
        className="border-t border-[#c9b29b]/10 px-5 py-8 text-xs text-[#f5efe8]/30"
      >
        <div className="mx-auto flex max-w-7xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <span>SONORA — THE AI RETRO MUSIC MACHINE</span>
          <span>BUILD 01 / PLATFORM CORE</span>
        </div>
      </footer>
    </main>
  );
}
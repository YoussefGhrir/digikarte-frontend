import Link from "next/link";
import Image from "next/image";

export default function ImpressumPage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-50">
      <div className="mx-auto w-full max-w-4xl px-6 py-10">
        <h1 className="font-forum text-3xl text-neutral-50 md:text-4xl">
          Impressum
        </h1>
        <p className="mt-3 text-sm text-neutral-400">
          Persönliche Webseite und Projekt-Portfolio von{" "}
          <span className="font-medium text-neutral-100">Youssef Ghrir</span>.
        </p>

        <div className="mt-8 flex flex-col gap-6 md:flex-row md:items-start">
          <div className="flex-shrink-0">
            <div className="relative h-32 w-32 overflow-hidden rounded-3xl border border-neutral-700 bg-neutral-900 shadow-lg">
              <Image
                src="/ghrir.png"
                alt="Youssef Ghrir"
                fill
                sizes="128px"
                className="object-cover"
              />
            </div>
          </div>

          <div className="flex-1 space-y-6 text-sm text-neutral-300">
            <section>
              <h2 className="text-lg font-semibold text-neutral-100">
                Verantwortlich nach § 5 DDG
              </h2>
              <p className="mt-2">
                Youssef Ghrir
                <br />
                Student / Full-Stack Software Engineer
                <br />
                Kaiserslautern, Deutschland
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-neutral-100">
                Kontakt
              </h2>
              <p className="mt-2">
                E-Mail:{" "}
                <a
                  href="mailto:gheriryoussef@gmail.com"
                  className="text-amber-300 hover:text-amber-200"
                >
                  gheriryoussef@gmail.com
                </a>
                <br />
                Telefon / WhatsApp:{" "}
                <a
                  href="https://wa.me/4915202387840"
                  className="text-amber-300 hover:text-amber-200"
                >
                  +49 152 02387840
                </a>
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-neutral-100">
                Online-Profile
              </h2>
              <ul className="mt-2 space-y-1">
                <li>
                  LinkedIn:{" "}
                  <a
                    href="https://linkedin.com/in/youssef-ghrir-8922511a4"
                    target="_blank"
                    rel="noreferrer"
                    className="text-amber-300 hover:text-amber-200"
                  >
                    linkedin.com/in/youssef-ghrir-8922511a4
                  </a>
                </li>
                <li>
                  GitHub:{" "}
                  <a
                    href="https://github.com/YoussefGhrir"
                    target="_blank"
                    rel="noreferrer"
                    className="text-amber-300 hover:text-amber-200"
                  >
                    github.com/YoussefGhrir
                  </a>
                </li>
                <li>
                  Instagram:{" "}
                  <a
                    href="https://instagram.com/youssef.ghrir"
                    target="_blank"
                    rel="noreferrer"
                    className="text-amber-300 hover:text-amber-200"
                  >
                    @youssef.ghrir
                  </a>
                </li>
                <li>
                  Projekt:{" "}
                  <Link
                    href="/"
                    className="text-amber-300 hover:text-amber-200"
                  >
                    digi-karte.com
                  </Link>
                </li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

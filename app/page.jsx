import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <section className="pb-16 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
          {/* left */}
          <div className="text-center sm:text-left">
            <span className="text-gray-500 font-light tracking-wide mb-6">
              Spott<span className="text-purple-400">*</span>
            </span>
            <h1 className="text-5xl sm:text-xl md:text-7xl font-bold mb-6 leading-[0.95] tracking-tight">
              Discover &<br />
              create amazing
              <br />
              <span className="bg-linear-to-r from-blue-400 via-purple-400 to-orange-400 bg-clip-text text-transparent">
                event.
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-400 mb-12 max-w-lg font-light">
              Whether you&apos;re hosting or attending, Spotting makes every
              events memorable. Joint our community today.
            </p>
            <Link href="/explore">
              <Button size="xl" className={"rounded-full p-2"}>
                Get Started
              </Button>
            </Link>
          </div>
          {/* right */}
          <div>
            <Image
              src="/hero.png"
              alt="hero img"
              height={700}
              width={700}
              className="w-full h-auto"
              priority
            />
          </div>
        </div>
      </section>
    </div>
  );
}

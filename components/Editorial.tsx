export function Editorial() {
  return (
    <section id="sobre" className="grid items-center gap-12 bg-bone px-8 py-24 md:grid-cols-2">
      <div className="relative aspect-[4/5] w-full">
        <img
          src="/images/editorial-destaque.jpg"
          alt="Sobre a Rouge"
          className="absolute -top-[10%] left-1/2 h-[124%] w-[110%] -translate-x-1/2 object-cover object-top"
          style={{
            maskImage: 'linear-gradient(to bottom, transparent 0%, black 16%, black 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 16%, black 100%)',
          }}
        />
      </div>
      <div>
        <h2 className="mb-6 font-serif text-3xl tracking-wide text-ink md:text-4xl">
          Sobre a Rouge
        </h2>
        <p className="max-w-prose leading-relaxed text-smoke">
          A Rouge nasce da luz quente do fim de tarde e da certeza de um
          propósito maior. Cada peça é pensada para quem se veste com
          intenção, unindo conforto e elegância num guarda-roupa atemporal.
        </p>
      </div>
    </section>
  );
}

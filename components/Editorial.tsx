export function Editorial() {
  return (
    <section id="sobre" className="grid items-center gap-12 bg-bone px-8 py-24 md:grid-cols-2">
      <div className="aspect-[4/5] overflow-hidden bg-smoke/10">
        <img
          src="/images/editorial.webp"
          alt="Sobre a Rouge"
          className="h-full w-full object-cover"
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

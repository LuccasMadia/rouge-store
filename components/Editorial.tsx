export function Editorial() {
  return (
    <section id="sobre" className="grid items-center gap-12 bg-ink px-8 py-24 md:grid-cols-2">
      <div className="aspect-[4/5] overflow-hidden bg-smoke/10">
        <img
          src="/images/editorial.webp"
          alt="Sobre a Rouge"
          className="h-full w-full object-cover"
        />
      </div>
      <div>
        <h2 className="mb-6 font-serif text-3xl tracking-wide text-bone md:text-4xl">
          Sobre a Rouge
        </h2>
        <p className="max-w-prose leading-relaxed text-smoke">
          Nascida do contraste entre o silêncio do preto e a intensidade do vermelho, a Rouge
          propõe peças atemporais para quem se veste com intenção. Cada coleção nasce de um
          processo editorial, pensado peça a peça.
        </p>
      </div>
    </section>
  );
}

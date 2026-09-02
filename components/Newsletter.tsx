export function Newsletter() {
  return (
    <section className="bg-crimson/10 px-8 py-24 text-center">
      <h2 className="mb-4 font-serif text-2xl tracking-wide text-bone md:text-3xl">
        Receba as novidades
      </h2>
      <p className="mb-8 text-smoke">Lançamentos e edições limitadas antes de todo mundo.</p>
      <form className="mx-auto flex max-w-md flex-col justify-center gap-4 sm:flex-row">
        <label htmlFor="newsletter-email" className="sr-only">
          E-mail
        </label>
        <input
          id="newsletter-email"
          type="email"
          placeholder="seu@email.com"
          className="flex-1 border border-smoke bg-transparent px-4 py-3 text-bone placeholder:text-smoke focus:border-bone focus:outline-none"
        />
        <button
          type="submit"
          className="border border-bone px-6 py-3 text-sm uppercase tracking-wide text-bone transition-colors hover:bg-bone hover:text-ink"
        >
          Assinar
        </button>
      </form>
    </section>
  );
}

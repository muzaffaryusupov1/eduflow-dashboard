export default function DashboardPage() {
  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-ink-700">
          Dashboard
        </p>
        <h1 className="font-[var(--font-grotesk)] text-3xl font-semibold">
          Welcome back
        </h1>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {['Students', 'Classes', 'Revenue'].map((label) => (
          <div
            key={label}
            className="rounded-3xl border border-ink-900/10 bg-white p-6 shadow-card"
          >
            <p className="text-sm text-ink-700">{label}</p>
            <p className="mt-4 text-3xl font-semibold">--</p>
          </div>
        ))}
      </div>
    </section>
  );
}

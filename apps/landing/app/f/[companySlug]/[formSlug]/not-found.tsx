export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#FAF9F6] flex items-center justify-center px-6">
      <div className="text-center">
        <p className="text-4xl mb-4">🔍</p>
        <h1 className="text-xl text-[#1A1714] mb-2"
          style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>
          Form not found
        </h1>
        <p className="text-sm text-[#9B8E7E] font-mono">
          This form doesn't exist or has been removed.
        </p>
      </div>
    </main>
  );
}
export function Hero() {
  return (
    <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-purple-600/10 rounded-full blur-2xl" />
      </div>

      <div className="relative max-w-4xl mx-auto text-center">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 text-balance">
          Üdvözöllek a blogomon
        </h1>
        <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto text-pretty">
          Fedezd fel a legújabb gondolatokat, történeteket és inspirációkat.
          Oszd meg a saját sztoridat a világgal.
        </p>
      </div>
    </section>
  );
}

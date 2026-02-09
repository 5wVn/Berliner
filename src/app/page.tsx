import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-primary-50 to-transparent -z-10" />

      <div className="w-full max-w-md flex flex-col gap-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-primary-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-primary-600/20 mb-6">
            <span className="text-3xl font-bold text-white">B</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Berliner
          </h1>
          <p className="text-slate-500 text-lg">
            Votre portail étudiant, simplifié.
          </p>
        </div>

        {/* Login Form Card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-700 ml-1"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="etudiant@ecole.com"
                className="w-full px-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-700 ml-1"
              >
                Mot de passe
              </label>
              <input
                type="password"
                id="password"
                placeholder="••••••••"
                className="w-full px-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
              />
            </div>
          </div>

          <button className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-4 rounded-xl shadow-lg shadow-primary-600/20 active:scale-[0.98] transition-all text-lg">
            Se connecter
          </button>
        </div>

        {/* Footer */}
        <p className="text-center text-slate-400 text-sm">
          © 2026 Berliner Campus
        </p>
      </div>
    </main>
  );
}

"use client";
import Link from "next/link";
import { useProgreso } from "@/lib/progreso";
import { LEVELS } from "@/components/RobotGame";

export default function JuegoPage() {
  const { isPuzzleCompletado, xpTotal } = useProgreso();

  const totalXP = LEVELS.reduce((a, l) => a + l.xp, 0);
  const completados = LEVELS.filter((l) => isPuzzleCompletado(`robot-${l.id}`)).length;
  const pct = Math.round((completados / LEVELS.length) * 100);
  const terminado = completados === LEVELS.length;

  return (
    <div className="min-h-screen bg-[#06080f] text-white relative overflow-x-hidden">
      <div className="nebula-1" />
      <div className="nebula-2" />
      <div className="bg-grid fixed inset-0 pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/[0.06]"
        style={{ background: "rgba(6,8,15,0.85)", backdropFilter: "blur(20px)" }}>
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/"
            className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors text-sm group">
            <span className="group-hover:-translate-x-0.5 transition-transform">←</span>
            <span>Inicio</span>
          </Link>
          <span className="text-slate-700">/</span>
          <span className="text-sm text-white font-semibold">Robot Programable</span>
          <div className="ml-auto flex items-center gap-1.5 bg-yellow-500/10 border border-yellow-500/20 rounded-lg px-2.5 py-1">
            <span className="text-yellow-400 text-xs">⚡</span>
            <span className="text-yellow-300 font-bold text-xs">{xpTotal} XP</span>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-3xl mx-auto px-4 py-10">
        {/* Hero banner */}
        <div className="relative rounded-3xl overflow-hidden mb-8 animate-slide-up">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 opacity-20" />
          <div className="absolute inset-0 bg-[#06080f]/60" />
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 opacity-5 blur-2xl" />
          <div className="relative p-8 flex items-center gap-6">
            <div className="relative shrink-0">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl blur-xl opacity-60" />
              <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-4xl shadow-2xl">
                🤖
              </div>
            </div>
            <div className="flex-1">
              <div className="text-xs text-white/50 font-semibold uppercase tracking-widest mb-1">
                Minijuego
              </div>
              <h1 className="text-3xl font-bold text-white mb-1">Robot Programable</h1>
              <p className="text-white/60 text-sm">
                Arrastra bloques de instrucciones para llevar al robot hasta la meta.
              </p>
            </div>
            <div className="shrink-0 text-right hidden sm:block">
              <div className="text-xs text-white/40 mb-1">total</div>
              <div className="text-2xl font-bold text-yellow-300">⚡ {totalXP}</div>
              <div className="text-xs text-white/40">XP disponibles</div>
            </div>
          </div>
        </div>

        {/* Progress card */}
        <div className={`glass rounded-2xl p-5 mb-8 border animate-slide-up
          ${terminado ? "border-green-500/30" : "border-white/[0.07]"}`}
          style={{ animationDelay: "0.1s" }}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              {terminado
                ? <><span className="text-lg animate-bounce-in">🏆</span><span className="text-sm font-semibold text-green-400 animate-pop-in">¡Todos los niveles completados!</span></>
                : <span className="text-slate-400 text-sm">Progreso</span>
              }
            </div>
            <span className="text-sm font-bold text-white">{completados}/{LEVELS.length} niveles</span>
          </div>
          <div className="w-full h-3 bg-white/[0.05] rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 xp-bar-fill ${terminado ? "animate-pulse-glow-green" : ""}`}
              style={{
                width: `${pct}%`,
                background: terminado
                  ? "linear-gradient(90deg, #22c55e, #16a34a)"
                  : "linear-gradient(90deg, #6366f1, #a855f7)",
              }}
            />
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-xs text-slate-600">{pct}% completado</span>
            <span className="text-xs text-slate-600">
              {LEVELS.filter((l) => isPuzzleCompletado(`robot-${l.id}`)).reduce((a, l) => a + l.xp, 0)} / {totalXP} XP ganados
            </span>
          </div>
        </div>

        {/* Level list */}
        <div className="space-y-3">
          {LEVELS.map((level, idx) => {
            const completado = isPuzzleCompletado(`robot-${level.id}`);
            const desbloqueado = idx === 0 || isPuzzleCompletado(`robot-${LEVELS[idx - 1].id}`);

            return (
              <Link
                key={level.id}
                href={desbloqueado ? `/juego/${level.id}` : "#"}
                className={!desbloqueado ? "cursor-not-allowed block" : "block group"}
                style={{ animationDelay: `${0.15 + idx * 0.05}s` }}
              >
                <div className={`relative rounded-2xl border transition-all duration-250 overflow-hidden animate-slide-up
                  ${completado
                    ? "border-green-500/30 bg-green-500/[0.04] hover:border-green-400/50 hover:shadow-[0_0_20px_rgba(34,197,94,0.08)]"
                    : desbloqueado
                    ? "border-white/[0.07] bg-white/[0.02] hover:border-indigo-400/40 hover:bg-indigo-500/[0.03] hover:shadow-[0_0_20px_rgba(99,102,241,0.08)] hover:-translate-y-0.5"
                    : "border-white/[0.03] bg-white/[0.01] opacity-40"
                  }`}
                >
                  {completado && (
                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-green-400 to-emerald-400" />
                  )}

                  <div className="flex items-center gap-4 p-4">
                    {/* Number / status */}
                    <div className="shrink-0">
                      {completado ? (
                        <div className="w-11 h-11 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-lg shadow-lg animate-pulse-glow-green">
                          ✓
                        </div>
                      ) : desbloqueado ? (
                        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg group-hover:scale-110 transition-transform">
                          {idx + 1}
                        </div>
                      ) : (
                        <div className="w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-600">
                          🔒
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white leading-tight">{level.title}</h3>
                      <p className="text-slate-500 text-xs mt-0.5 line-clamp-1">{level.description}</p>
                      <div className="mt-1.5 flex items-center gap-2">
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full border text-indigo-400 bg-indigo-500/10 border-indigo-500/20">
                          Programación de bloques
                        </span>
                      </div>
                    </div>

                    {/* XP */}
                    <div className="shrink-0 text-right">
                      <div className={`text-sm font-bold ${completado ? "text-green-400" : "text-yellow-400"}`}>
                        {completado ? "✓" : "+"}{level.xp} XP
                      </div>
                      {desbloqueado && !completado && (
                        <div className="text-xs text-slate-600 mt-0.5 group-hover:text-indigo-400 transition-colors">
                          Jugar →
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}

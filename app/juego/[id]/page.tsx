"use client";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import RobotGame, { LEVELS } from "@/components/RobotGame";
import { useProgreso } from "@/lib/progreso";

export default function JuegoNivelPage() {
  const params = useParams();
  const router = useRouter();
  const { completarPuzzle, isPuzzleCompletado, xpTotal } = useProgreso();

  const levelId = Number(params.id);
  const level = LEVELS.find((l) => l.id === levelId);

  if (!level) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-[#06080f]">
        <div className="text-center animate-pop-in">
          <p className="text-6xl mb-4">😕</p>
          <p className="text-slate-400">Nivel no encontrado</p>
          <Link href="/juego" className="text-indigo-400 hover:text-indigo-300 underline mt-4 block transition-colors">
            ← Volver
          </Link>
        </div>
      </div>
    );
  }

  const currentIdx = LEVELS.findIndex((l) => l.id === levelId);
  const nextLevel = LEVELS[currentIdx + 1] ?? null;
  const completado = isPuzzleCompletado(`robot-${level.id}`);

  const handleComplete = (xp: number) => {
    completarPuzzle(`robot-${level.id}`, xp);
    // Auto-advance after 1.5s
    setTimeout(() => {
      if (nextLevel) {
        router.push(`/juego/${nextLevel.id}`);
      } else {
        router.push("/juego");
      }
    }, 1800);
  };

  return (
    <div className="min-h-screen bg-[#06080f] text-white relative overflow-x-hidden">
      <div className="nebula-1" />
      <div className="nebula-2" />
      <div className="bg-grid fixed inset-0 pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/[0.06]"
        style={{ background: "rgba(6,8,15,0.85)", backdropFilter: "blur(20px)" }}>
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/juego"
            className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors text-sm group">
            <span className="group-hover:-translate-x-0.5 transition-transform">←</span>
            <span>Robot Programable</span>
          </Link>
          <span className="text-slate-700">/</span>
          <span className="text-sm text-white font-semibold">{level.title}</span>
          <div className="ml-auto flex items-center gap-1.5 bg-yellow-500/10 border border-yellow-500/20 rounded-lg px-2.5 py-1">
            <span className="text-yellow-400 text-xs">⚡</span>
            <span className="text-yellow-300 font-bold text-xs">{xpTotal} XP</span>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-3xl mx-auto px-4 py-10">
        {/* Level badge */}
        <div className="flex items-center gap-3 mb-6 animate-slide-up">
          <div className="relative shrink-0">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl blur-lg opacity-50" />
            <div className="relative w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-2xl shadow-xl">
              🤖
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-xs text-indigo-400 font-bold uppercase tracking-widest">
                Nivel {level.id} de {LEVELS.length}
              </span>
              {completado && (
                <span className="text-xs text-green-400 border border-green-500/30 bg-green-500/10 px-2 py-0.5 rounded-full">
                  ✓ Completado
                </span>
              )}
            </div>
            <h1 className="text-2xl font-black text-white">{level.title}</h1>
            <p className="text-slate-400 text-sm mt-0.5">{level.description}</p>
          </div>
          <div className="shrink-0 text-right hidden sm:block">
            <div className="text-xs text-white/40 mb-0.5">recompensa</div>
            <div className="text-xl font-bold text-yellow-300">⚡ {level.xp}</div>
          </div>
        </div>

        {/* Game */}
        <div className="glass rounded-2xl p-6 border border-white/[0.07] animate-slide-up"
          style={{ animationDelay: "0.1s" }}>
          <RobotGame
            key={level.id}
            level={level}
            onComplete={handleComplete}
          />
        </div>

        {/* Nav between levels */}
        <div className="flex items-center justify-between mt-6 animate-slide-up" style={{ animationDelay: "0.15s" }}>
          {currentIdx > 0 ? (
            <Link href={`/juego/${LEVELS[currentIdx - 1].id}`}
              className="flex items-center gap-1.5 text-slate-500 hover:text-white transition-colors text-sm">
              ← {LEVELS[currentIdx - 1].title}
            </Link>
          ) : <div />}
          {nextLevel && (
            <Link href={`/juego/${nextLevel.id}`}
              className="flex items-center gap-1.5 text-slate-500 hover:text-white transition-colors text-sm">
              {nextLevel.title} →
            </Link>
          )}
        </div>
      </main>
    </div>
  );
}

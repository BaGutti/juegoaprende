"use client";
import { useState, useEffect, useRef, useCallback } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────
type Dir = "up" | "down" | "left" | "right";
type CellType = "empty" | "wall" | "goal" | "start" | "coin";

interface Cmd {
  id: string;
  type: "move" | "turn" | "loop-start" | "loop-end" | "if-obstacle";
  label: string;
  icon: string;
  dir?: Dir;
  times?: number;
}

export interface Level {
  id: number;
  title: string;
  description: string;
  grid: CellType[][];
  startPos: { x: number; y: number };
  startDir: Dir;
  goalPos: { x: number; y: number };
  coins?: { x: number; y: number }[];
  availableCmds: Cmd["type"][];
  maxCmds: number;
  xp: number;
  hint: string;
}

// ── All levels ────────────────────────────────────────────────────────────────
export const LEVELS: Level[] = [
  {
    id: 1,
    title: "Primer paso",
    description: "Mueve el robot hasta la bandera. Solo puedes avanzar.",
    grid: [
      ["start", "empty", "empty", "goal"],
    ],
    startPos: { x: 0, y: 0 },
    startDir: "right",
    goalPos: { x: 3, y: 0 },
    availableCmds: ["move"],
    maxCmds: 6,
    xp: 20,
    hint: "Necesitas 3 bloques 'Avanzar' para llegar de un extremo al otro.",
  },
  {
    id: 2,
    title: "Primera curva",
    description: "El camino dobla. Aprende a girar.",
    grid: [
      ["start", "empty", "empty", "empty"],
      ["wall",  "wall",  "wall",  "empty"],
      ["wall",  "wall",  "wall",  "goal" ],
    ],
    startPos: { x: 0, y: 0 },
    startDir: "right",
    goalPos: { x: 3, y: 2 },
    availableCmds: ["move", "turn"],
    maxCmds: 8,
    xp: 30,
    hint: "Avanza hasta el borde, gira a la derecha (hacia abajo), avanza, gira de nuevo.",
  },
  {
    id: 3,
    title: "Laberinto",
    description: "Navega el laberinto hasta la bandera.",
    grid: [
      ["start", "empty", "wall",  "empty", "empty"],
      ["wall",  "empty", "wall",  "empty", "wall" ],
      ["wall",  "empty", "empty", "empty", "goal" ],
    ],
    startPos: { x: 0, y: 0 },
    startDir: "right",
    goalPos: { x: 4, y: 2 },
    availableCmds: ["move", "turn"],
    maxCmds: 10,
    xp: 40,
    hint: "Baja primero, luego avanza a la derecha sorteando las paredes.",
  },
  {
    id: 4,
    title: "Bucle básico",
    description: "Usa el bucle for para repetir acciones sin escribir tanto.",
    grid: [
      ["start", "empty", "empty", "empty", "empty", "goal"],
    ],
    startPos: { x: 0, y: 0 },
    startDir: "right",
    goalPos: { x: 5, y: 0 },
    availableCmds: ["move", "loop-start", "loop-end"],
    maxCmds: 4,
    xp: 50,
    hint: "for(5) { Avanzar } — el bucle repite Avanzar 5 veces.",
  },
  {
    id: 5,
    title: "Zigzag",
    description: "Recoge todas las monedas en el camino zigzag.",
    grid: [
      ["start", "coin",  "coin",  "empty", "wall" ],
      ["wall",  "wall",  "empty", "coin",  "wall" ],
      ["wall",  "wall",  "empty", "coin",  "goal" ],
    ],
    startPos: { x: 0, y: 0 },
    startDir: "right",
    goalPos: { x: 4, y: 2 },
    coins: [
      { x: 1, y: 0 }, { x: 2, y: 0 },
      { x: 3, y: 1 },
      { x: 3, y: 2 },
    ],
    availableCmds: ["move", "turn"],
    maxCmds: 12,
    xp: 60,
    hint: "Avanza, baja, avanza y baja de nuevo. Sigue el camino.",
  },
  {
    id: 6,
    title: "Obstáculos",
    description: "Usa el if para esquivar obstáculos automáticamente.",
    grid: [
      ["start", "empty", "wall",  "empty", "goal" ],
      ["wall",  "empty", "empty", "empty", "wall" ],
    ],
    startPos: { x: 0, y: 0 },
    startDir: "right",
    goalPos: { x: 4, y: 0 },
    availableCmds: ["move", "turn", "if-obstacle"],
    maxCmds: 8,
    xp: 70,
    hint: "if(obstáculo) { girar derecha } te hace rodear la pared.",
  },
];

// ── CMD definitions ───────────────────────────────────────────────────────────
const CMD_DEFS: Record<string, Omit<Cmd, "id">> = {
  "move":         { type: "move",        label: "Avanzar",       icon: "⬆️" },
  "turn-right":   { type: "turn",        label: "Girar →",       icon: "↩️", dir: "right" },
  "turn-left":    { type: "turn",        label: "Girar ←",       icon: "↪️", dir: "left"  },
  "loop-start":   { type: "loop-start",  label: "for ( 3 )",     icon: "🔁", times: 3     },
  "loop-end":     { type: "loop-end",    label: "} fin for",     icon: "⏹️"               },
  "if-obstacle":  { type: "if-obstacle", label: "si obstáculo →","icon": "🚧"              },
};

const TURN_MAP: Record<Dir, Record<"left" | "right", Dir>> = {
  up:    { left: "left",  right: "right" },
  down:  { left: "right", right: "left"  },
  left:  { left: "down",  right: "up"    },
  right: { left: "up",    right: "down"  },
};

const DELTA: Record<Dir, { dx: number; dy: number }> = {
  up:    { dx: 0,  dy: -1 },
  down:  { dx: 0,  dy:  1 },
  left:  { dx: -1, dy:  0 },
  right: { dx:  1, dy:  0 },
};

const DIR_EMOJI: Record<Dir, string> = {
  up: "🤖", down: "🤖", left: "🤖", right: "🤖",
};
const DIR_ROTATE: Record<Dir, string> = {
  up: "rotate(-90deg)", right: "rotate(0deg)",
  down: "rotate(90deg)", left: "rotate(180deg)",
};

let cmdCounter = 0;
function makeCmd(key: string, overrides?: Partial<Cmd>): Cmd {
  const def = CMD_DEFS[key];
  return { ...def, id: `cmd-${++cmdCounter}`, ...overrides } as Cmd;
}

// ── Main component ────────────────────────────────────────────────────────────
interface Props {
  level: Level;
  onComplete: (xp: number) => void;
}

type Phase = "edit" | "running" | "success" | "fail";

export default function RobotGame({ level, onComplete }: Props) {
  const ROWS = level.grid.length;
  const COLS = level.grid[0].length;

  // program = list of cmds the user built
  const [program, setProgram] = useState<Cmd[]>([]);
  const [phase, setPhase] = useState<Phase>("edit");

  // runtime state
  const [robotPos, setRobotPos] = useState(level.startPos);
  const [robotDir, setRobotDir] = useState<Dir>(level.startDir);
  const [collectedCoins, setCollectedCoins] = useState<Set<string>>(new Set());
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [trail, setTrail] = useState<{ x: number; y: number }[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [dragOver, setDragOver] = useState<number | null>(null);
  const [shakeProg, setShakeProg] = useState(false);

  const runRef = useRef(false);

  const reset = useCallback(() => {
    runRef.current = false;
    setPhase("edit");
    setRobotPos(level.startPos);
    setRobotDir(level.startDir);
    setCollectedCoins(new Set());
    setActiveStep(null);
    setTrail([]);
  }, [level]);

  useEffect(() => { reset(); setProgram([]); }, [level.id]);

  // ── Execution engine ───────────────────────────────────────────────────────
  const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

  const runProgram = async () => {
    if (program.length === 0) {
      setShakeProg(true);
      setTimeout(() => setShakeProg(false), 600);
      return;
    }
    setPhase("running");
    runRef.current = true;

    let pos = { ...level.startPos };
    let dir: Dir = level.startDir;
    let coins = new Set<string>();
    let trail: { x: number; y: number }[] = [{ ...pos }];

    const isWall = (x: number, y: number) =>
      x < 0 || y < 0 || x >= COLS || y >= ROWS || level.grid[y][x] === "wall";

    const step = async (idx: number) => {
      if (!runRef.current) return;
      setActiveStep(idx);
      await sleep(380);
    };

    const execute = async (cmds: Cmd[]): Promise<"ok" | "crash"> => {
      let i = 0;
      while (i < cmds.length) {
        if (!runRef.current) return "ok";
        const cmd = cmds[i];

        if (cmd.type === "move") {
          await step(i);
          const { dx, dy } = DELTA[dir];
          const nx = pos.x + dx, ny = pos.y + dy;
          if (isWall(nx, ny)) return "crash";
          pos = { x: nx, y: ny };
          trail = [...trail, { ...pos }];
          setRobotPos({ ...pos });
          setTrail([...trail]);
          const coinKey = `${pos.x},${pos.y}`;
          if (level.coins?.some((c) => c.x === pos.x && c.y === pos.y)) {
            coins = new Set([...coins, coinKey]);
            setCollectedCoins(new Set(coins));
          }
          i++;

        } else if (cmd.type === "turn") {
          await step(i);
          dir = TURN_MAP[dir][(cmd.dir === "left" ? "left" : "right")];
          setRobotDir(dir);
          i++;

        } else if (cmd.type === "loop-start") {
          // find matching loop-end
          let depth = 1, j = i + 1;
          while (j < cmds.length && depth > 0) {
            if (cmds[j].type === "loop-start") depth++;
            if (cmds[j].type === "loop-end") depth--;
            j++;
          }
          const body = cmds.slice(i + 1, j - 1);
          const times = cmd.times ?? 3;
          for (let t = 0; t < times; t++) {
            const res = await execute(body);
            if (res === "crash") return "crash";
          }
          i = j;

        } else if (cmd.type === "if-obstacle") {
          await step(i);
          const { dx, dy } = DELTA[dir];
          const blocked = isWall(pos.x + dx, pos.y + dy);
          if (blocked) {
            dir = TURN_MAP[dir]["right"];
            setRobotDir(dir);
          }
          i++;

        } else {
          i++;
        }
      }
      return "ok";
    };

    const result = await execute(program);
    if (!runRef.current) return;

    setActiveStep(null);

    if (result === "crash") {
      setPhase("fail");
      return;
    }

    const reachedGoal = pos.x === level.goalPos.x && pos.y === level.goalPos.y;
    const allCoins = !level.coins || level.coins.every((c) => coins.has(`${c.x},${c.y}`));

    if (reachedGoal && allCoins) {
      setPhase("success");
      setTimeout(() => onComplete(level.xp), 800);
    } else {
      setPhase("fail");
    }
  };

  // ── Program editing ────────────────────────────────────────────────────────
  const addCmd = (key: string) => {
    if (program.length >= level.maxCmds) return;
    setProgram((p) => [...p, makeCmd(key)]);
  };

  const removeCmd = (id: string) => {
    setProgram((p) => p.filter((c) => c.id !== id));
  };

  const moveCmd = (fromIdx: number, toIdx: number) => {
    setProgram((p) => {
      const next = [...p];
      const [item] = next.splice(fromIdx, 1);
      next.splice(toIdx, 0, item);
      return next;
    });
  };

  // ── Available command buttons ──────────────────────────────────────────────
  const availableKeys: string[] = [];
  for (const t of level.availableCmds) {
    if (t === "move")        availableKeys.push("move");
    if (t === "turn")        availableKeys.push("turn-right", "turn-left");
    if (t === "loop-start")  availableKeys.push("loop-start");
    if (t === "loop-end")    availableKeys.push("loop-end");
    if (t === "if-obstacle") availableKeys.push("if-obstacle");
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  const CELL = 52; // px

  const cellColor: Record<CellType, string> = {
    empty: "bg-slate-800/60 border-slate-700/40",
    wall:  "bg-slate-900 border-slate-800",
    goal:  "bg-green-900/60 border-green-500/50",
    start: "bg-indigo-900/40 border-indigo-500/30",
    coin:  "bg-slate-800/60 border-slate-700/40",
  };

  return (
    <div className="flex flex-col gap-6">
      {/* ── Grid ──────────────────────────────────────────────────────── */}
      <div className="flex justify-center">
        <div
          className="relative border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${COLS}, ${CELL}px)`,
            gridTemplateRows: `repeat(${ROWS}, ${CELL}px)`,
            background: "#0a0d18",
          }}
        >
          {level.grid.map((row, y) =>
            row.map((cell, x) => {
              const isRobot = robotPos.x === x && robotPos.y === y;
              const isCoin = level.coins?.some((c) => c.x === x && c.y === y);
              const coinKey = `${x},${y}`;
              const coinCollected = collectedCoins.has(coinKey);
              const isTrail = trail.some((t) => t.x === x && t.y === y) && !isRobot;

              return (
                <div
                  key={`${x}-${y}`}
                  className={`relative border flex items-center justify-center transition-all duration-200
                    ${cellColor[cell]}
                    ${cell === "wall" ? "" : isTrail ? "bg-indigo-500/10" : ""}
                  `}
                  style={{ width: CELL, height: CELL }}
                >
                  {/* Trail dot */}
                  {isTrail && (
                    <div className="w-2 h-2 rounded-full bg-indigo-400/40" />
                  )}

                  {/* Goal flag */}
                  {cell === "goal" && (
                    <span className={`text-2xl transition-all duration-300 ${phase === "success" ? "animate-bounce-in scale-125" : ""}`}>
                      🚩
                    </span>
                  )}

                  {/* Wall */}
                  {cell === "wall" && (
                    <div className="w-full h-full bg-gradient-to-br from-slate-700/50 to-slate-900/80 flex items-center justify-center">
                      <div className="grid grid-cols-3 gap-0.5 opacity-20">
                        {Array.from({ length: 9 }).map((_, i) => (
                          <div key={i} className="w-3 h-2 bg-slate-400 rounded-sm" />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Coin */}
                  {isCoin && !coinCollected && cell !== "wall" && (
                    <span className="text-lg absolute">🪙</span>
                  )}

                  {/* Robot */}
                  {isRobot && (
                    <div
                      className={`absolute inset-0 flex items-center justify-center z-10 transition-all duration-300
                        ${phase === "running" ? "animate-pulse" : ""}
                        ${phase === "fail" ? "animate-shake" : ""}
                      `}
                    >
                      <div
                        className="text-2xl transition-transform duration-300 drop-shadow-lg"
                        style={{ transform: DIR_ROTATE[robotDir] }}
                      >
                        🤖
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ── Program area ────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
              Tu programa
            </span>
            <span className={`text-xs px-2 py-0.5 rounded-full border font-mono
              ${program.length >= level.maxCmds
                ? "border-red-500/40 text-red-400 bg-red-500/10"
                : "border-white/10 text-slate-500"}`}>
              {program.length}/{level.maxCmds}
            </span>
          </div>
          {program.length > 0 && phase === "edit" && (
            <button
              onClick={() => setProgram([])}
              className="text-xs text-slate-600 hover:text-red-400 transition-colors"
            >
              🗑 limpiar
            </button>
          )}
        </div>

        {/* Program slots */}
        <div
          className={`min-h-[52px] rounded-xl border border-dashed p-2 flex flex-wrap gap-2 transition-all
            ${shakeProg ? "animate-shake border-red-500/50 bg-red-500/5" : "border-white/10 bg-white/[0.02]"}
            ${dragOver === -1 ? "border-indigo-400/50 bg-indigo-500/5" : ""}
          `}
          onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = "move"; setDragOver(-1); }}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(null);
            const newKey = e.dataTransfer.getData("new-cmd");
            if (newKey) { addCmd(newKey); return; }
          }}
        >
          {program.length === 0 && (
            <p className="text-slate-600 text-xs m-auto">
              Haz clic en los bloques de abajo para agregar instrucciones
            </p>
          )}
          {program.map((cmd, idx) => {
            const isActive = activeStep === idx;
            const isLoop = cmd.type === "loop-start" || cmd.type === "loop-end";
            return (
              <div
                key={cmd.id}
                draggable={phase === "edit"}
                onDragStart={(e) => e.dataTransfer.setData("prog-idx", String(idx))}
                onDragEnd={(e) => {
                  // dropEffect === "none" means dropped outside any valid target
                  if (e.dataTransfer.dropEffect === "none") {
                    removeCmd(cmd.id);
                  }
                }}
                onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); e.dataTransfer.dropEffect = "move"; setDragOver(idx); }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const from = e.dataTransfer.getData("prog-idx");
                  if (from !== "") moveCmd(Number(from), idx);
                  setDragOver(null);
                }}
                className={`group flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-mono
                  cursor-grab active:cursor-grabbing select-none transition-all duration-150
                  ${isActive
                    ? "border-yellow-400 bg-yellow-400/20 scale-110 shadow-[0_0_15px_rgba(234,179,8,0.4)]"
                    : isLoop
                    ? "border-purple-500/50 bg-purple-500/10 text-purple-300"
                    : "border-indigo-400/30 bg-indigo-500/10 text-indigo-200 hover:border-indigo-400/60"
                  }
                  ${dragOver === idx ? "scale-105 border-white/40" : ""}
                  ${phase !== "edit" ? "cursor-default" : ""}
                `}
              >
                <span>{cmd.icon}</span>
                <span>{cmd.label}</span>
                {phase === "edit" && (
                  <button
                    onClick={() => removeCmd(cmd.id)}
                    className="ml-1 text-slate-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 text-[10px]"
                  >
                    ✕
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Available blocks */}
        <div className="flex flex-wrap gap-2">
          {availableKeys.map((key) => {
            const def = CMD_DEFS[key];
            const disabled = phase !== "edit" || program.length >= level.maxCmds;
            const isLoop = def.type === "loop-start" || def.type === "loop-end";
            return (
              <button
                key={key}
                disabled={disabled}
                onClick={() => addCmd(key)}
                draggable={!disabled}
                onDragStart={(e) => {
                  e.dataTransfer.setData("new-cmd", key);
                }}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-mono
                  transition-all duration-150 select-none
                  ${disabled
                    ? "opacity-30 cursor-not-allowed"
                    : isLoop
                    ? "border-purple-500/40 bg-purple-500/10 text-purple-300 hover:border-purple-400/70 hover:bg-purple-500/20 hover:scale-105 cursor-grab"
                    : "border-indigo-400/30 bg-indigo-500/10 text-indigo-200 hover:border-indigo-400/60 hover:bg-indigo-500/20 hover:scale-105 cursor-grab"
                  }`}
              >
                <span>{def.icon}</span>
                <span>{def.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Controls ──────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3">
        {phase === "edit" && (
          <button
            onClick={runProgram}
            className="relative flex-1 py-3 rounded-xl font-bold text-sm overflow-hidden group transition-all"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 group-hover:from-green-500 group-hover:to-emerald-500 transition-all" />
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 shadow-[0_0_25px_rgba(34,197,94,0.4)] transition-opacity" />
            <span className="relative flex items-center justify-center gap-2">
              ▶ Ejecutar programa
            </span>
          </button>
        )}

        {(phase === "running") && (
          <button
            onClick={() => { runRef.current = false; reset(); }}
            className="flex-1 py-3 rounded-xl font-bold text-sm border border-red-500/40 text-red-400 hover:bg-red-500/10 transition-all"
          >
            ⏹ Detener
          </button>
        )}

        {(phase === "fail") && (
          <>
            <button
              onClick={reset}
              className="relative flex-1 py-3 rounded-xl font-bold text-sm overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 group-hover:from-indigo-500 group-hover:to-purple-500" />
              <span className="relative">↺ Reintentar</span>
            </button>
            <button
              onClick={() => { reset(); setProgram([]); }}
              className="px-4 py-3 rounded-xl font-semibold text-sm border border-white/10 text-slate-400 hover:border-white/20 hover:text-white transition-all"
            >
              🗑 Limpiar
            </button>
          </>
        )}

        {phase === "success" && (
          <div className="flex-1 py-3 rounded-xl text-center font-bold text-green-400 border border-green-500/40 bg-green-500/10 animate-pop-in">
            🎉 ¡Nivel superado! +{level.xp} XP
          </div>
        )}

        {phase === "edit" && (
          <button
            onClick={() => setShowHint(!showHint)}
            className="px-4 py-3 rounded-xl border border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10 transition-all text-sm"
          >
            💡
          </button>
        )}
      </div>

      {/* Fail message */}
      {phase === "fail" && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm animate-pop-in">
          <p className="font-bold mb-0.5">💥 El robot chocó o no llegó a la meta</p>
          <p className="text-xs text-red-400/80">Revisa tu programa e inténtalo de nuevo.</p>
        </div>
      )}

      {/* Hint */}
      {showHint && (
        <div className="p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/25 text-yellow-300 text-sm animate-pop-in">
          💡 {level.hint}
        </div>
      )}
    </div>
  );
}

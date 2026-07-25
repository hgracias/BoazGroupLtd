"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";

import { corridors, type Corridor, type Point } from "@/lib/content/corridors";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------
 * Projection: real lat/lng → SVG space, so the schematic keeps the true
 * geographic relationship between Dar es Salaam and each destination.
 * ---------------------------------------------------------------------- */

const VIEW = { w: 900, h: 620 };
const BOUNDS = { west: 28.5, east: 40.6, north: 1.6, south: -8.2 };
const PAD = { x: 70, y: 60, w: 760, h: 500 };

function project({ lat, lng }: { lat: number; lng: number }) {
  const x = ((lng - BOUNDS.west) / (BOUNDS.east - BOUNDS.west)) * PAD.w + PAD.x;
  const y = ((BOUNDS.north - lat) / (BOUNDS.north - BOUNDS.south)) * PAD.h + PAD.y;
  return { x, y };
}

/** Catmull-Rom → cubic bezier, so corridors read as roads rather than zig-zags. */
function smoothPath(points: { x: number; y: number }[]) {
  if (points.length < 2) return "";
  let d = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;
  for (let i = 0; i < points.length - 1; i += 1) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }
  return d;
}

function borderIndex(corridor: Corridor) {
  const index = corridor.waypoints.findIndex((point) =>
    corridor.borderPost.startsWith(point.name)
  );
  return index === -1 ? corridor.waypoints.length - 2 : index;
}

// Rwanda is deliberately unlabelled: Kigali, Rusumo and the Goma leg all fall
// inside ~80px here, and a country label in that corner collides with one of
// them on every route. Those city labels already identify the territory.
const countryLabels = [
  { name: "TANZANIA", lat: -6.4, lng: 34.6 },
  { name: "KENYA", lat: -0.4, lng: 38.4 },
  { name: "UGANDA", lat: 1.35, lng: 31.4 },
  { name: "BURUNDI", lat: -4.4, lng: 30.3 },
  { name: "DR CONGO", lat: -4.6, lng: 28.65 },
];

const lake = {
  topLeft: project({ lat: 0.45, lng: 31.6 }),
  bottomRight: project({ lat: -2.9, lng: 34.9 }),
};

export function CorridorMap({ className }: { className?: string }) {
  const [active, setActive] = React.useState<string>(corridors[0].slug);
  const reduceMotion = useReducedMotion();
  const activeCorridor = corridors.find((c) => c.slug === active) ?? corridors[0];
  const dar = project(corridors[0].waypoints[0]);

  return (
    <div className={cn("w-full", className)}>
      <div
        role="group"
        aria-label="Select a corridor"
        className="mb-5 flex flex-wrap gap-2"
      >
        {corridors.map((corridor) => {
          const isActive = corridor.slug === active;
          return (
            <button
              key={corridor.slug}
              type="button"
              onClick={() => setActive(corridor.slug)}
              aria-pressed={isActive}
              className={cn(
                "flex min-h-11 items-center gap-2.5 rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
                isActive
                  ? "border-gold-500 bg-gold-500 text-navy-900"
                  : "border-white/20 bg-white/5 text-white/70 hover:border-white/40 hover:text-white"
              )}
            >
              <span
                aria-hidden="true"
                className={cn(
                  "rounded px-1.5 py-0.5 text-[10px] font-bold tracking-wider",
                  isActive ? "bg-navy-900/15 text-navy-900" : "bg-white/10 text-white/80"
                )}
              >
                {corridor.countryCode}
              </span>
              {corridor.destination}
            </button>
          );
        })}
      </div>

      {/* Below ~700px the map scrolls horizontally rather than shrinking its
          labels into illegibility. */}
      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-navy-950/60">
        <svg
          viewBox={`0 0 ${VIEW.w} ${VIEW.h}`}
          preserveAspectRatio="xMidYMid meet"
          className="h-auto w-full min-w-[680px]"
          role="img"
          aria-label={`Route map of the Dar es Salaam to ${activeCorridor.destination} corridor via ${activeCorridor.borderPost}`}
        >
          <defs>
            <pattern id="map-grid" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
            </pattern>
            <linearGradient id="ocean" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#2B348C" stopOpacity="0" />
              <stop offset="100%" stopColor="#3D4599" stopOpacity="0.45" />
            </linearGradient>
            <radialGradient id="origin-glow">
              <stop offset="0%" stopColor="#C9962E" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#C9962E" stopOpacity="0" />
            </radialGradient>
          </defs>

          <rect width={VIEW.w} height={VIEW.h} fill="url(#map-grid)" />
          <rect x="760" y="0" width="140" height={VIEW.h} fill="url(#ocean)" />
          <text
            x="872"
            y="120"
            className="fill-white/25"
            fontSize="13"
            letterSpacing="3"
            transform="rotate(90 872 120)"
            textAnchor="start"
          >
            INDIAN OCEAN
          </text>

          {/* Lake Victoria — geographic anchor for the western corridors. */}
          <ellipse
            cx={(lake.topLeft.x + lake.bottomRight.x) / 2}
            cy={(lake.topLeft.y + lake.bottomRight.y) / 2}
            rx={(lake.bottomRight.x - lake.topLeft.x) / 2}
            ry={(lake.bottomRight.y - lake.topLeft.y) / 2}
            fill="#3D4599"
            fillOpacity="0.3"
            stroke="#616AB6"
            strokeOpacity="0.35"
          />
          <text
            x={(lake.topLeft.x + lake.bottomRight.x) / 2}
            y={(lake.topLeft.y + lake.bottomRight.y) / 2}
            textAnchor="middle"
            className="fill-white/40"
            fontSize="13"
            letterSpacing="1.5"
          >
            Lake Victoria
          </text>

          {countryLabels.map((label) => {
            const { x, y } = project(label);
            return (
              <text
                key={label.name}
                x={x}
                y={y}
                textAnchor="middle"
                className="fill-white/25"
                fontSize="14"
                letterSpacing="3"
                fontWeight="600"
              >
                {label.name}
              </text>
            );
          })}

          {/* Inactive corridors sit behind, as faint context. */}
          {corridors.map((corridor) => {
            if (corridor.slug === active) return null;
            const d = smoothPath(corridor.waypoints.map(project));
            return (
              <path
                key={corridor.slug}
                d={d}
                fill="none"
                stroke="#8E94D0"
                strokeOpacity="0.25"
                strokeWidth="2"
                strokeLinecap="round"
              />
            );
          })}

          <ActiveRoute corridor={activeCorridor} reduceMotion={Boolean(reduceMotion)} />

          {/* Origin: Dar es Salaam */}
          <circle cx={dar.x} cy={dar.y} r="34" fill="url(#origin-glow)" />
          <circle cx={dar.x} cy={dar.y} r="8" fill="#C9962E" stroke="#14173F" strokeWidth="2" />
          <text
            x={dar.x + 16}
            y={dar.y + 1}
            textAnchor="start"
            className="fill-white"
            fontSize="16"
            fontWeight="600"
          >
            Dar es Salaam
          </text>
          <text
            x={dar.x + 16}
            y={dar.y + 20}
            textAnchor="start"
            className="fill-gold-400"
            fontSize="12"
          >
            Origin · Port &amp; HQ
          </text>
        </svg>
      </div>

      <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4">
        <MapStat label="Distance" value={`${activeCorridor.distanceKm.toLocaleString()} km`} />
        <MapStat label="Transit time" value={activeCorridor.transitDays} />
        <MapStat label="Border post" value={activeCorridor.borderPost} />
        <MapStat label="Departures" value={activeCorridor.departures} />
      </dl>
    </div>
  );
}

function ActiveRoute({
  corridor,
  reduceMotion,
}: {
  corridor: Corridor;
  reduceMotion: boolean;
}) {
  const points = corridor.waypoints.map(project);
  const d = smoothPath(points);
  const borderAt = borderIndex(corridor);
  const destination = points[points.length - 1];
  const border = points[borderAt];
  const borderPoint: Point = corridor.waypoints[borderAt];

  // Some crossings sit almost on top of their destination — the Grande
  // Barrière is a few hundred metres from central Goma. Drawing both markers
  // there produces an unreadable pile, so the border is named under the
  // destination instead.
  const borderHugsDestination =
    Math.hypot(destination.x - border.x, destination.y - border.y) < 22;

  return (
    <g key={corridor.slug}>
      <path d={d} fill="none" stroke="#C9962E" strokeOpacity="0.18" strokeWidth="10" strokeLinecap="round" />
      <motion.path
        d={d}
        fill="none"
        stroke="#C9962E"
        strokeWidth="3"
        strokeLinecap="round"
        initial={reduceMotion ? false : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.1, ease: "easeInOut" }}
      />
      <path
        d={d}
        fill="none"
        stroke="#FBF6EA"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="2 22"
        className={reduceMotion ? undefined : "animate-dash-flow"}
        opacity="0.9"
      />

      {/* Intermediate stops */}
      {points.slice(1, -1).map((point, index) => {
        const isBorder = index + 1 === borderAt;
        if (isBorder) return null;
        return (
          <g key={corridor.waypoints[index + 1].name}>
            <circle cx={point.x} cy={point.y} r="4" fill="#14173F" stroke="#E3C374" strokeWidth="2" />
            <text x={point.x} y={point.y + 20} textAnchor="middle" className="fill-white/60" fontSize="11">
              {corridor.waypoints[index + 1].name}
            </text>
          </g>
        );
      })}

      {/* Border post */}
      <g className={borderHugsDestination ? "hidden" : undefined}>
        <rect
          x={border.x - 7}
          y={border.y - 7}
          width="14"
          height="14"
          rx="3"
          fill="#14173F"
          stroke="#FFFFFF"
          strokeWidth="2"
          transform={`rotate(45 ${border.x} ${border.y})`}
        />
        <text
          x={border.x + 16}
          y={border.y - 1}
          textAnchor="start"
          className="fill-white"
          fontSize="12"
          fontWeight="600"
        >
          {borderPoint.name}
        </text>
        <text
          x={border.x + 16}
          y={border.y + 14}
          textAnchor="start"
          className="fill-white/50"
          fontSize="11"
        >
          Border post
        </text>
      </g>

      {/* Destination */}
      <circle cx={destination.x} cy={destination.y} r="26" fill="#C9962E" fillOpacity="0.12" />
      <circle cx={destination.x} cy={destination.y} r="8" fill="#FFFFFF" stroke="#C9962E" strokeWidth="3" />
      <text
        x={destination.x}
        y={destination.y - 22}
        textAnchor="middle"
        className="fill-white"
        fontSize="16"
        fontWeight="600"
      >
        {corridor.destination}
      </text>
      <text
        x={destination.x}
        y={destination.y - 38}
        textAnchor="middle"
        className="fill-gold-400"
        fontSize="11"
        letterSpacing="1"
      >
        {corridor.transitDays.toUpperCase()}
      </text>
      {borderHugsDestination ? (
        <text
          // Nudged clear of the preceding stop's label, which sits close by
          // when the crossing hugs the destination.
          x={destination.x - 30}
          y={destination.y + 26}
          textAnchor="middle"
          className="fill-white/60"
          fontSize="11"
        >
          via {borderPoint.name}
        </text>
      ) : null}
    </g>
  );
}

function MapStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/45">
        {label}
      </dt>
      <dd className="mt-1 text-sm font-semibold text-white">{value}</dd>
    </div>
  );
}

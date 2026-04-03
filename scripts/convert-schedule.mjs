#!/usr/bin/env node

import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const inputPath = process.argv[2];
if (!inputPath) {
  console.error("Usage: node scripts/convert-schedule.mjs <input.json>");
  process.exit(1);
}

const data = JSON.parse(readFileSync(resolve(inputPath), "utf-8"));

function slugify(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function mapLevel(level) {
  const map = {
    BEGINNER: "débutant",
    INTERMEDIATE: "intermédiaire",
    ADVANCED: "avancé",
  };
  return map[level] || "débutant";
}

function mapTrack(track) {
  const map = { Conference: "conference", Amphi: "auditorium" };
  return map[track] || "conference";
}

function detectType(formats) {
  if (!formats || formats.length === 0) return "conférence";
  const fmt = formats[0].toLowerCase();
  if (fmt.includes("atelier") || fmt.includes("workshop")) return "atelier";
  return "conférence";
}

function stripMarkdown(text) {
  if (!text) return "";
  return text
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/\[(.*?)\]\(.*?\)/g, "$1")
    .replace(/^#+\s+/gm, "")
    .replace(/^\s*[-*]\s+/gm, "")
    .replace(/\n{2,}/g, " ")
    .replace(/\n/g, " ")
    .replace(/\s{2,}/g, " ")
    .replace(/[📣📈😱🤖💡🔥✨🎯🚀🧠💻🎉👀🏆]+/gu, "")
    .trim();
}

function mapCategories(categories) {
  if (!categories || categories.length === 0) return "Autres";
  return categories[0];
}

function toLocalTime(isoString) {
  // Conference Hall times are stored with Z suffix but represent local times
  return isoString.replace(/\.000Z$/, "").replace(/Z$/, "");
}

// Group sessions by start time to detect solo slots (span all rooms)
const sessionsByStart = new Map();
for (const session of data.sessions) {
  const start = session.start;
  if (!sessionsByStart.has(start)) sessionsByStart.set(start, []);
  sessionsByStart.get(start).push(session);
}

// Extract unique speakers
const speakersMap = new Map();
for (const session of data.sessions) {
  if (!session.proposal) continue;
  for (const speaker of session.proposal.speakers) {
    if (speaker.name === "TODO") continue;
    const id = slugify(speaker.name);
    if (!speakersMap.has(id)) {
      speakersMap.set(id, {
        id,
        name: speaker.name,
        role: "",
        company: speaker.company || "",
        bio: stripMarkdown(speaker.bio) || "",
        ...(speaker.picture ? { photo: speaker.picture } : {}),
      });
    }
  }
}

// Build program entries
const program = [];
for (const session of data.sessions) {
  const speakerIds = [];
  let level = "débutant";
  let type = "conférence";
  let description = session.title;
  let theme = "Événement";

  if (session.proposal) {
    for (const speaker of session.proposal.speakers) {
      if (speaker.name !== "TODO") {
        speakerIds.push(slugify(speaker.name));
      }
    }
    level = mapLevel(session.proposal.level);
    type = detectType(session.proposal.formats);
    description = stripMarkdown(session.proposal.abstract) || session.title;
    theme = mapCategories(session.proposal.categories);
  }

  // Sessions alone in their time slot span all rooms
  const isAloneInSlot = sessionsByStart.get(session.start).length === 1;
  const roomId = isAloneInSlot ? "all" : mapTrack(session.track);

  program.push({
    id: slugify(session.title),
    title: session.title,
    description,
    speakerIds,
    startTime: toLocalTime(session.start),
    endTime: toLocalTime(session.end),
    roomId,
    theme,
    level,
    type,
  });
}

// Sort by start time, then by room
program.sort((a, b) => {
  const t = a.startTime.localeCompare(b.startTime);
  if (t !== 0) return t;
  return a.roomId.localeCompare(b.roomId);
});

// Detect gaps between sessions and insert breaks
const LUNCH_THRESHOLD_MIN = 60;
const BREAK_THRESHOLD_MIN = 15;

// Collect all end times and next start times
const allEndTimes = program.map((p) => new Date(p.endTime).getTime());
const allStartTimes = program.map((p) => new Date(p.startTime).getTime());
const latestEndBySlot = new Map();
const earliestStartBySlot = new Map();

for (const p of program) {
  const end = new Date(p.endTime).getTime();
  const start = new Date(p.startTime).getTime();
  const endKey = p.startTime;
  if (!latestEndBySlot.has(endKey) || end > latestEndBySlot.get(endKey)) {
    latestEndBySlot.set(endKey, end);
  }
}

// Get unique sorted start times
const uniqueStarts = [...new Set(program.map((p) => p.startTime))].sort();

for (let i = 0; i < uniqueStarts.length - 1; i++) {
  // Latest end time for current slot
  const currentSlotEnd = Math.max(
    ...program
      .filter((p) => p.startTime === uniqueStarts[i])
      .map((p) => new Date(p.endTime).getTime()),
  );
  const nextSlotStart = new Date(uniqueStarts[i + 1]).getTime();
  const gapMin = (nextSlotStart - currentSlotEnd) / 60000;

  if (gapMin >= BREAK_THRESHOLD_MIN) {
    const breakStart = new Date(currentSlotEnd);
    const breakEnd = new Date(nextSlotStart);
    const pad = (n) => String(n).padStart(2, "0");
    const fmt = (d) =>
      `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    const isLunch = gapMin >= LUNCH_THRESHOLD_MIN;

    program.push({
      id: isLunch ? "pause-dejeuner" : `pause-${fmt(breakStart).slice(11, 16).replace(":", "h")}`,
      title: isLunch ? "Pause déjeuner" : "Pause",
      description: isLunch
        ? "Buffet et networking."
        : "",
      speakerIds: [],
      startTime: fmt(breakStart),
      endTime: fmt(breakEnd),
      roomId: "all",
      theme: "Networking",
      level: "débutant",
      type: "conférence",
    });
  }
}

// Re-sort after adding breaks
program.sort((a, b) => {
  const t = a.startTime.localeCompare(b.startTime);
  if (t !== 0) return t;
  return a.roomId.localeCompare(b.roomId);
});

const speakers = Array.from(speakersMap.values());

writeFileSync(
  "src/data/program.json",
  JSON.stringify(program, null, 2) + "\n",
);
writeFileSync(
  "src/data/speakers.json",
  JSON.stringify(speakers, null, 2) + "\n",
);

console.log(
  `Generated ${program.length} program entries → src/data/program.json`,
);
console.log(`Generated ${speakers.length} speakers → src/data/speakers.json`);

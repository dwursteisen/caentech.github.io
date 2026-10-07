interface TalkData {
  id: string;
  title: string;
  description: string;
  speakers: {
    name: string;
    role: string;
    company: string;
    bio: string;
    photo: string;
  }[];
  startTime: string;
  endTime: string;
  room: { name: string; color: string };
  theme: string;
  level: string;
  type: string;
  photos: string[];
  videoUrl: string | null;
}

const modal = document.getElementById("talk-modal")!;
const modalTitle = document.getElementById("modal-title")!;
const modalMeta = document.getElementById("modal-meta")!;
const modalBody = document.getElementById("modal-body")!;

let talksData: TalkData[] = [];
let triggerElement: HTMLElement | null = null;

const dataScript = document.getElementById("talks-data");
if (dataScript) {
  talksData = JSON.parse(dataScript.textContent || "[]");
}

const YOUTUBE_ICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="12" height="12" fill="currentColor" aria-hidden="true"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>`;

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Paris",
  });
}

function escapeHtml(text: string): string {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function populateModal(talk: TalkData) {
  modalTitle.textContent = talk.title;

  modalMeta.innerHTML = `
    <span class="Tag" style="background-color: ${escapeHtml(talk.room.color)}; color: white;">${escapeHtml(talk.room.name)}</span>
    <span class="Tag">${formatTime(talk.startTime)} – ${formatTime(talk.endTime)}</span>
    <span class="Tag theme">${escapeHtml(talk.theme)}</span>
    <span class="Tag level">${escapeHtml(talk.level)}</span>
    <span class="Tag type">${escapeHtml(talk.type)}</span>
  `;
  if (talk.videoUrl) {
    modalMeta.innerHTML += `<a class="Tag video" href="${escapeHtml(talk.videoUrl)}" target="_blank" rel="noopener">${YOUTUBE_ICON} Voir le replay</a>`;
  }

  const descriptionHtml = talk.description.trim().startsWith("<")
    ? talk.description
    : `<p>${escapeHtml(talk.description)}</p>`;
  let bodyHtml = `<div class="Modal-description">${descriptionHtml}</div>`;

  for (const speaker of talk.speakers) {
    bodyHtml += `
      <div class="Modal-speaker">
        <img class="Modal-speakerPhoto" src="${escapeHtml(speaker.photo || '/images/placeholder-avatar.svg')}" alt="${escapeHtml(speaker.name)}" width="64" height="64" loading="lazy" />
        <div>
          <div class="Modal-speakerName">${escapeHtml(speaker.name)}</div>
          <div class="Modal-speakerRole">${escapeHtml(speaker.role)} — ${escapeHtml(speaker.company)}</div>
          <div class="Modal-speakerBio">${escapeHtml(speaker.bio)}</div>
        </div>
      </div>
    `;
  }

  if (talk.photos.length > 0) {
    let photosHtml = `
      <h3 class="Modal-photosTitle">En images</h3>
      <div class="Modal-photos">
    `;
    for (const src of talk.photos) {
      photosHtml += `<a class="Modal-photo" href="${escapeHtml(src)}" target="_blank" rel="noopener" aria-label="Voir la photo en grand"><img src="${escapeHtml(src)}" alt="Photo prise pendant « ${escapeHtml(talk.title)} »" width="400" height="267" loading="lazy" /></a>`;
    }
    photosHtml += "</div>";
    bodyHtml += photosHtml;
  }

  modalBody.innerHTML = bodyHtml;
}

function openModal() {
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";

  // Focus the close button
  const closeBtn = modal.querySelector<HTMLButtonElement>("[data-modal-close]");
  closeBtn?.focus();
}

function closeModal() {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";

  // Remove hash without adding history entry
  history.replaceState(null, "", window.location.pathname);

  triggerElement?.focus();
  triggerElement = null;
}

function openTalkById(id: string) {
  const talk = talksData.find((t) => t.id === id);
  if (!talk) return;
  populateModal(talk);
  openModal();
}

// Click handlers on calendar slots (links inside a slot, like the replay tag,
// keep their own behavior)
document.addEventListener("click", (e) => {
  if ((e.target as HTMLElement).closest("a")) return;
  const slot = (e.target as HTMLElement).closest<HTMLElement>(
    "[data-talk-id]"
  );
  if (!slot) return;

  const id = slot.getAttribute("data-talk-id");
  if (!id) return;

  triggerElement = slot;
  window.location.hash = `talk-${id}`;
});

// Keyboard activation on calendar slots
document.addEventListener("keydown", (e) => {
  if (e.key !== "Enter" && e.key !== " ") return;
  if ((e.target as HTMLElement).closest("a")) return;
  const slot = (e.target as HTMLElement).closest<HTMLElement>(
    "[data-talk-id]"
  );
  if (!slot) return;

  e.preventDefault();
  const id = slot.getAttribute("data-talk-id");
  if (!id) return;

  triggerElement = slot;
  window.location.hash = `talk-${id}`;
});

// Close triggers
modal.addEventListener("click", (e) => {
  const target = e.target as HTMLElement;
  if (target.closest("[data-modal-close]") || target === modal.querySelector(".Modal-overlay")) {
    closeModal();
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal.classList.contains("open")) {
    closeModal();
  }
});

// Focus trap
modal.addEventListener("keydown", (e) => {
  if (e.key !== "Tab") return;

  const focusable = modal.querySelectorAll<HTMLElement>(
    'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
  );
  if (focusable.length === 0) return;

  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
});

// Hash-based routing
function handleHash() {
  const hash = window.location.hash;
  if (hash.startsWith("#talk-")) {
    const id = hash.slice(6);
    openTalkById(id);
  } else if (modal.classList.contains("open")) {
    closeModal();
  }
}

window.addEventListener("hashchange", handleHash);
// On page load
handleHash();

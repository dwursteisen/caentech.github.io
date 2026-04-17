interface SpeakerSession {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
}

interface SpeakerData {
  id: string;
  name: string;
  role: string;
  company: string;
  bio: string;
  photo: string;
  sessions: SpeakerSession[];
}

const modal = document.getElementById("speaker-modal");
if (modal) {
  const titleEl = document.getElementById("speaker-modal-title")!;
  const roleEl = document.getElementById("speaker-modal-role")!;
  const photoEl = document.getElementById("speaker-modal-photo") as HTMLImageElement;
  const bioEl = document.getElementById("speaker-modal-bio")!;
  const sessionsEl = document.getElementById("speaker-modal-sessions")!;
  const sessionsListEl = document.getElementById("speaker-modal-sessions-list")!;

  let speakers: SpeakerData[] = [];
  const dataScript = document.getElementById("speakers-data");
  if (dataScript) {
    speakers = JSON.parse(dataScript.textContent || "[]");
  }

  let triggerElement: HTMLElement | null = null;

  function formatTime(iso: string) {
    return new Date(iso).toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function escapeHtml(text: string): string {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  function populate(speaker: SpeakerData) {
    titleEl.textContent = speaker.name;
    const roleParts = [speaker.role, speaker.company].filter(Boolean);
    roleEl.textContent = roleParts.join(" — ");
    roleEl.hidden = roleParts.length === 0;
    photoEl.src = speaker.photo;
    photoEl.alt = speaker.name;
    bioEl.textContent = speaker.bio || "Bio à venir.";

    if (speaker.sessions.length === 0) {
      sessionsEl.hidden = true;
      sessionsListEl.innerHTML = "";
      return;
    }

    sessionsEl.hidden = false;
    sessionsListEl.innerHTML = speaker.sessions
      .map(
        (s) =>
          `<li><span class="SpeakerModal-sessionsTime">${formatTime(s.startTime)} – ${formatTime(s.endTime)}</span>${escapeHtml(s.title)}</li>`,
      )
      .join("");
  }

  function open() {
    modal!.classList.add("open");
    modal!.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    const closeBtn = modal!.querySelector<HTMLButtonElement>("[data-modal-close]");
    closeBtn?.focus();
  }

  function close() {
    modal!.classList.remove("open");
    modal!.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    triggerElement?.focus();
    triggerElement = null;
  }

  function openById(id: string) {
    const speaker = speakers.find((s) => s.id === id);
    if (!speaker) return;
    populate(speaker);
    open();
  }

  document.addEventListener("click", (e) => {
    const card = (e.target as HTMLElement).closest<HTMLElement>("[data-speaker-id]");
    if (!card) return;
    const id = card.getAttribute("data-speaker-id");
    if (!id) return;
    triggerElement = card;
    openById(id);
  });

  modal.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;
    if (
      target.closest("[data-modal-close]") ||
      target === modal.querySelector(".Modal-overlay")
    ) {
      close();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("open")) {
      close();
    }
  });

  modal.addEventListener("keydown", (e) => {
    if (e.key !== "Tab") return;
    const focusable = modal.querySelectorAll<HTMLElement>(
      'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])',
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
}

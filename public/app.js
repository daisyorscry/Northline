const menuButton = document.querySelector(".menu-button");
const navigation = document.querySelector(".site-header nav");

menuButton?.addEventListener("click", () => {
  const isOpen = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!isOpen));
  navigation?.classList.toggle("is-open", !isOpen);
});

const escapeHtml = (value) => String(value).replace(/[&<>'"]/g, (character) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"
})[character]);

async function loadProjects() {
  const target = document.querySelector("#project-list");
  if (!target) return;

  try {
    const response = await fetch("/api/projects");
    if (!response.ok) throw new Error("Could not load work");
    const { data, total } = await response.json();
    document.querySelector("#project-count").textContent = `${total} recent collaborations`;
    target.innerHTML = data.map((project) => `
      <article class="project project--${escapeHtml(project.accent)}">
        <div class="project-meta"><span>${escapeHtml(project.number)}</span><span>${escapeHtml(project.category)}</span></div>
        <div class="project-art" aria-hidden="true"><span>${escapeHtml(project.title.slice(0, 1))}</span></div>
        <div class="project-info">
          <h2>${escapeHtml(project.title)}</h2>
          <p>${escapeHtml(project.summary)}</p>
          <span>${escapeHtml(project.year)} ↗</span>
        </div>
      </article>`).join("");
  } catch {
    target.innerHTML = '<p class="error-message">The work list is taking a minute. Try refreshing the page.</p>';
  }
}

async function loadNotes() {
  const target = document.querySelector("#note-list");
  if (!target) return;
  try {
    const response = await fetch("/api/notes");
    const { data } = await response.json();
    target.innerHTML = data.map((note) => `
      <article class="note-card"><p>${escapeHtml(note.date)} · ${escapeHtml(note.readTime)}</p><h3>${escapeHtml(note.title)}</h3><span>Read note ↗</span></article>`).join("");
  } catch {
    target.innerHTML = '<p class="error-message">Notes are temporarily unavailable.</p>';
  }
}

document.querySelector("#inquiry-form")?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const button = form.querySelector("button");
  const status = document.querySelector("#form-status");
  const values = Object.fromEntries(new FormData(form));
  button.disabled = true;
  button.firstChild.textContent = "Sending… ";

  try {
    const response = await fetch("/api/inquiries", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(values)
    });
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.message);
    status.textContent = payload.message;
    form.reset();
  } catch {
    status.textContent = "Something went wrong. Please check the details and try again.";
  } finally {
    button.disabled = false;
    button.firstChild.textContent = "Send the short version ";
  }
});

loadProjects();
loadNotes();

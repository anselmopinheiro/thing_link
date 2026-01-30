const overlay = document.getElementById("overlay");
const closeBtn = document.getElementById("close");
const stage = document.getElementById("stage");

const mTitle = document.getElementById("mTitle");
const mText = document.getElementById("mText");
const mActions = document.getElementById("mActions");
const mVideo = document.getElementById("mVideo");

function openModal(item){
  mTitle.textContent = item.title || "Info";
  mText.textContent = item.text || "";
  mActions.innerHTML = "";
  mVideo.innerHTML = "";

  if (item.linkUrl && item.linkUrl.trim() !== "") {
    const a = document.createElement("a");
    a.className = "btn";
    a.href = item.linkUrl;
    a.target = "_blank";
    a.rel = "noopener";
    a.textContent = (item.linkText && item.linkText.trim() !== "") ? item.linkText : "Abrir link";
    mActions.appendChild(a);
  }

  if (item.videoEmbed && item.videoEmbed.trim() !== "") {
    mVideo.innerHTML = `
      <div class="videoWrap">
        <iframe
          src="${item.videoEmbed}"
          title="Vídeo"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen></iframe>
      </div>
    `;
  }

  overlay.style.display = "flex";
  closeBtn.focus();
}

function closeModal(){
  overlay.style.display = "none";
  mVideo.innerHTML = "";
}

closeBtn.addEventListener("click", closeModal);
overlay.addEventListener("click", (e) => {
  if (e.target === overlay) closeModal();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});

function createHotspot(id, pos){
  const btn = document.createElement("button");
  btn.className = "hotspot";
  btn.type = "button";
  btn.dataset.id = id;
  btn.textContent = id;
  btn.style.left = `${pos.left}%`;
  btn.style.top = `${pos.top}%`;
  btn.setAttribute("aria-label", `Ponto ${id}`);
  return btn;
}

fetch("data.json")
  .then(r => r.json())
  .then(data => {
    Object.keys(data).sort((a,b)=>Number(a)-Number(b)).forEach(id => {
      const item = data[id];
      const pos = item.pos;
      if (!pos) return;
      const btn = createHotspot(id, pos);
      btn.addEventListener("click", () => openModal(item));
      stage.appendChild(btn);
    });
  });

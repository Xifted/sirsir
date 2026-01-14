function copy(btn) {
  const pwd = btn.previousElementSibling.dataset.pwd;
  navigator.clipboard.writeText(pwd);
}

const menu = document.getElementById("cooldown-menu");
const idInput = document.getElementById("cooldown-id");

document.querySelectorAll(".cooldown-btn").forEach(btn => {
  btn.addEventListener("click", e => {
    const rect = btn.getBoundingClientRect();

    idInput.value = btn.dataset.id;

    menu.style.top = rect.bottom + 6 + "px";
    menu.style.left = rect.left + "px";

    menu.classList.remove("hidden");
  });
});

document.addEventListener("click", e => {
  if (!menu.contains(e.target) && !e.target.classList.contains("cooldown-btn")) {
    menu.classList.add("hidden");
  }
});

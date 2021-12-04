const _root = document.documentElement;
const _theme_switch = document.querySelector("#theme-switch");
let { matches: isDark } = window.matchMedia("(prefers-color-scheme: dark)");

_theme_switch.querySelector("input").checked = isDark;

_theme_switch.addEventListener("change", () => {
  isDark = !isDark;
  _root.classList.toggle("dark-theme", isDark);
  _root.classList.toggle("light-theme", !isDark);
});

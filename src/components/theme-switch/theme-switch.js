const root = document.documentElement;
const theme_switch = document.querySelector("#theme-switch");
const lsGet = (p) => localStorage.getItem(p);
const lsSet = (k, v) => localStorage.setItem(k, v);

let isDark = lsGet("isDark");

if (isDark == "true") isDark = true;
if (isDark == "false") isDark = false;
if (isDark == null)
  // don't set
  isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

const showState = (isDark) => {
  root.classList.toggle("dark-theme", isDark);
  root.classList.toggle("light-theme", !isDark);
  lsSet("isDark", isDark);
};

const changeHandler = () => {
  isDark = !isDark;
  showState(isDark);
};

theme_switch.addEventListener("change", changeHandler);

/* MAIN */
theme_switch.querySelector("input").checked = isDark;
showState(isDark);

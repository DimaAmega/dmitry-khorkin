const root = document.documentElement;
const theme_switch = document.querySelector("#theme-switch");
const iconsImgs = document.querySelectorAll("#inst-icon,#vk-icon,#youtube-icon");
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
  iconsImgs.forEach((e) => (e.style = `filter: invert(${isDark ? 1 : 0});`));
  lsSet("isDark", isDark);
};

const changeHandler = () => {
  isDark = !isDark;
  showState(isDark);
};

///////////////////////////
//        MAIN
///////////////////////////

if (theme_switch) {
  theme_switch.addEventListener("change", changeHandler);
  theme_switch.querySelector("input").checked = isDark;
  showState(isDark);
}

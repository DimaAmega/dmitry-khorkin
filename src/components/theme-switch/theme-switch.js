const root = document.documentElement
const theme_switch = document.querySelector('#theme-switch')
const iconsImgs = document.querySelectorAll('#inst-icon,#vk-icon,#youtube-icon,#tiktok-icon')
const lsGet = (p) => localStorage.getItem(p)
const lsSet = (k, v) => localStorage.setItem(k, v)

let isDark = lsGet('isDark')

if (isDark == 'true') isDark = true
if (isDark == 'false') isDark = false
if (isDark == null)
  // don't set
  isDark = window.matchMedia('(prefers-color-scheme: dark)').matches

const setState = (isDark) => {
  root.classList.toggle('dark-theme', isDark)
  root.classList.toggle('light-theme', !isDark)
  iconsImgs.forEach((e) => (e.style = `filter: invert(${isDark ? 1 : 0});`))
  lsSet('isDark', isDark)
}

const changeHandler = () => {
  isDark = !isDark
  setState(isDark)
}

///////////////////////////
//        MAIN
///////////////////////////

if (theme_switch) {
  theme_switch.addEventListener('change', changeHandler)
  theme_switch.querySelector('input').checked = isDark
  setState(isDark)
}

const MAX_SCROLL = 800

window.addEventListener('scroll', () => {
  const scroll = Math.min(window.scrollY, MAX_SCROLL)
  const opacity = 1 - scroll / MAX_SCROLL

  if (opacity === 0 && theme_switch.style.display === 'none') {
    return
  }

  theme_switch.setAttribute('style', `opacity: ${opacity};`)

  if (opacity === 0) {
    theme_switch.setAttribute('style', `display: none;`)
  }
})

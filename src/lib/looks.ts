export const NIGHT_KEY = "bb-night";

export function applyNight(night: boolean) {
  document.documentElement.classList.toggle("dark", night);
}

export const LOOK_BOOT = `(function(){try{var n=localStorage.getItem("${NIGHT_KEY}")==="1";document.documentElement.classList.toggle("dark",n);}catch(e){}})();`;

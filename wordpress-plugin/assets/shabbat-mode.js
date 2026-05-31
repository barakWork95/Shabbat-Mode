(async function ShabbatMode() {
  const config = window.ShabbatModeConfig || {};

  const CITY = config.city || "Tel Aviv";
  const LANGUAGE = config.language || "he";
  const BG_COLOR = config.bgColor || "#1a1a2e";
  const TEXT_COLOR = config.textColor || "#ffffff";
  const SHOW_TIME = config.showTime !== false;

  const TRANSLATIONS = {
    he: {
      title: "האתר סגור לכבוד השבת",
      subtitle: "נשמח לשרת אתכם במוצאי שבת",
      havdalahText: (time) => `האתר יחזור לפעילות במוצאי שבת בשעה ${time}`,
    },
    en: {
      title: "The site is closed for Shabbat",
      subtitle: "We'll be happy to serve you after Shabbat",
      havdalahText: (time) => `The site will reopen after Shabbat at ${time}`,
    },
  };

  async function getShabbatTimes(city) {
    const url = `https://www.hebcal.com/shabbat?cfg=json&city=${encodeURIComponent(city)}&M=on`;
    const res = await fetch(url);
    const data = await res.json();

    const candles = data.items.find((i) => i.category === "candles");
    const havdalah = data.items.find((i) => i.category === "havdalah");

    if (!candles || !havdalah) throw new Error("לא נמצאו זמני שבת");

    return {
      start: new Date(candles.date),
      end: new Date(havdalah.date),
    };
  }

  function showBlockScreen(havdalahTime) {
    const lang = TRANSLATIONS[LANGUAGE] || TRANSLATIONS["he"];
    const dir = LANGUAGE === "he" ? "rtl" : "ltr";

    const timeString = havdalahTime.toLocaleTimeString(
      LANGUAGE === "he" ? "he-IL" : "en-US",
      { hour: "2-digit", minute: "2-digit" },
    );

    const overlay = document.createElement("div");
    overlay.id = "shabbat-mode-overlay";
    overlay.style.cssText = `
      position: fixed;
      inset: 0;
      z-index: 999999;
      background: ${BG_COLOR};
      color: ${TEXT_COLOR};
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-family: Arial, sans-serif;
      text-align: center;
      padding: 2rem;
      direction: ${dir};
    `;

    overlay.innerHTML = `
      <div style="font-size: 3rem; margin-bottom: 1rem;">✡️</div>
      <h1 style="font-size: 2rem; margin-bottom: 0.5rem;">${lang.title}</h1>
      <p style="font-size: 1.1rem; opacity: 0.8;">${lang.subtitle}</p>
      ${
        SHOW_TIME
          ? `<p style="margin-top: 1.5rem; font-size: 1rem; opacity: 0.6;">
            ${lang.havdalahText(timeString)}
           </p>`
          : ""
      }
    `;

    document.body.appendChild(overlay);
    document.body.style.overflow = "hidden";
  }

  try {
    const { start, end } = await getShabbatTimes(CITY);
    const now = new Date();

    if (now >= start && now <= end) {
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () =>
          showBlockScreen(end),
        );
      } else {
        showBlockScreen(end);
      }
    }
  } catch (err) {
    console.warn("ShabbatMode: שגיאה בטעינת זמני שבת", err.message);
  }
})();

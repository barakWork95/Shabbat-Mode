const HEBCAL_API = "https://www.hebcal.com/shabbat";

function normalizeCity(city) {
  return city.trim().toLowerCase().replace(/\s+/g, "_");
}

async function getShabbatTimes(city = "Tel Aviv") {
  const url = `${HEBCAL_API}?cfg=json&city=${encodeURIComponent(
    city.trim()
  )}&M=on`;

  const response = await fetch(url);
  const data = await response.json();

  if (!data.items || data.items.length === 0) {
    throw new Error(`לא נמצאו זמני שבת עבור העיר: ${city}`);
  }

  const candles = data.items.find((i) => i.category === "candles");
  const havdalah = data.items.find((i) => i.category === "havdalah");

  if (!candles || !havdalah) {
    throw new Error(`לא נמצאו זמני כניסה/יציאת שבת עבור: ${city}`);
  }

  return {
    city: data.location?.title || city,
    start: new Date(candles.date),
    end: new Date(havdalah.date),
  };
}

async function isShabbatNow(city = "Tel Aviv") {
  const { start, end } = await getShabbatTimes(city);
  const now = new Date();
  return now >= start && now <= end;
}

module.exports = { getShabbatTimes, isShabbatNow, normalizeCity };

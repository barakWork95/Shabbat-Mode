const { getShabbatTimes, isShabbatNow } = require("../core/shabbat-core");

async function run() {
  const cities = [
    "Tel Aviv",
    "tel aviv",
    "TEL AVIV",
    "Jerusalem",
    "New York",
    "London",
    "Netanya",
  ];

  for (const city of cities) {
    try {
      const times = await getShabbatTimes(city);
      console.log(`\n📍 ${times.city}`);
      console.log("   כניסת שבת:", times.start.toLocaleString("he-IL"));
      console.log("   יציאת שבת:", times.end.toLocaleString("he-IL"));
    } catch (err) {
      console.error(`❌ שגיאה עבור "${city}":`, err.message);
    }
  }

  const result = await isShabbatNow("Tel Aviv");
  console.log("\nהאם עכשיו שבת בתל אביב?", result ? "✅ כן" : "❌ לא");
}

run().catch(console.error);

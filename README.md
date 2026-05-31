# Shabbat Mode 🕍

Automatically blocks your website during Shabbat hours.
Works for any city in the world.

---

## Installation

### Option 1 – WordPress Plugin

1. Copy the `wordpress-plugin/` folder into your WordPress plugins directory:
   `wp-content/plugins/shabbat-mode/`
2. Go to **Plugins** in your WordPress dashboard and activate **Shabbat Mode**
3. Go to **Settings → Shabbat Mode** and configure your city and preferences

### Option 2 – Universal JavaScript Snippet

1. Copy the contents of `snippet/shabbat-snippet.js`
2. Paste it before the closing `</body>` tag in your website's HTML
3. Change the `CITY` variable at the top of the snippet to your city name

---

## Configuration

| Setting     | Description                            | Default    |
| ----------- | -------------------------------------- | ---------- |
| `city`      | Your city name (in English)            | `Tel Aviv` |
| `language`  | Display language: `he` or `en`         | `he`       |
| `bgColor`   | Background color of the block screen   | `#1a1a2e`  |
| `textColor` | Text color of the block screen         | `#ffffff`  |
| `showTime`  | Show Havdalah time on the block screen | `true`     |

---

## How It Works

The plugin fetches Shabbat times for your city from the [Hebcal API](https://www.hebcal.com),
and automatically displays a block screen from candle lighting until Havdalah.

No manual updates needed — times are always accurate and update every week automatically.

---

## Supported Platforms

- WordPress (plugin)
- Any HTML website (JS snippet)

---

## License

GPL-2.0+

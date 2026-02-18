# 🎴 Lorcana Card Tracker - Setup Guide

## ✅ What's Already Done

Your Lorcana Card Tracker app is now complete with the following features:

### 🎨 Design
- ✅ Light-themed interface (clean, modern design)
- ✅ Responsive card grid layout
- ✅ Detailed card view pages
- ✅ Clickable keywords and abilities for searching

### 🔍 Search & Filter
- ✅ Smart search with keyword suggestions
- ✅ Search badges with icon rendering
- ✅ Game symbols ({exert}, {lore}, etc.) shown as icons in search
- ✅ "exert" and "{exert}" treated as equivalent in searches
- ✅ Partial text matching

### 📊 Sorting
- ✅ Sort by: Recently Added, Price, Card Number, Name
- ✅ Ascending/Descending toggle
- ✅ Set-based ordering (promos, set 1, set 2, etc.)

### 💰 Market Pricing
- ✅ Real-time Lorcana API integration
- ✅ Auto-fetching prices on app load
- ✅ Price display on cards and detail pages

### 🎮 Card Details
- ✅ Keywords section (1-3 columns based on count)
- ✅ Abilities section (2-column: name | description)
- ✅ Game text rendering with icons ({exert}, {lore}, etc.)
- ✅ Clickable attributes for filtering
- ✅ Similar cards feature

### 🛠️ Additional Features
- ✅ Deck builder tab
- ✅ Navbar with Cards/Play/Login/Sign Up
- ✅ Toast notifications
- ✅ Set/Rarity/Ink icons support

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- pnpm (or npm/yarn)

### Installation
```bash
# Install dependencies (if not already done)
pnpm install

# Start development server
pnpm dev
```

---

## 📝 How to Add Cards

Edit `/src/library/cards.ts` to add your cards. Here's the template:

```typescript
{
  name: "Mickey Mouse",
  version: "Brave Little Tailor",
  set: "The First Chapter",
  setNumber: 1,
  cardNumber: "001/204",
  rarity: "Legendary",

  // 👁️ SHOWN KEYWORDS - Appear in search suggestions
  shownKeywords: [
    "Mickey Mouse",
    "Brave Little Tailor",
    "Ruby",
    "Hero",
    "{Evasive}",  // Use {brackets} to show icons in search!
  ],

  // 🔍 HIDDEN KEYWORDS - Searchable but don't appear in suggestions
  hiddenKeywords: [
    "ink: 8",
    "strength: 5",
    "willpower: 5",
    "lore: 4",
  ],

  // 🎨 CARD DETAILS
  imageUrl: "https://example.com/image.png",
  ink: "Ruby",
  cost: 8,
  inkwell: true,
  type: "Character",

  // 💪 STATS
  strength: 5,
  willpower: 5,
  lore: 4,

  // 🎯 KEYWORDS - Displayed in keyword section
  keywords: [
    "Evasive",
    "Bodyguard",
  ],

  // 🔮 ABILITIES - Use {icons} for game symbols
  abilities: [
    "Evasive - Only characters with Evasive can challenge this character.",
    "{Exert} - {Exert} chosen opposing character.",
    // NOTE: Both "Exert" and "{Exert}" work in searches!
    // Brackets just tell the renderer to show the icon
  ],

  // 💬 FLAVOR TEXT
  flavorText: "When defeat looms and victory hangs by a thread...",

  // 🎭 METADATA
  artist: "Nicholas Kole",

  // 🔗 MARKETPLACE LINKS (optional - API provides prices automatically)
  links: [
    { label: "TCGPlayer", url: "https://www.tcgplayer.com/..." },
  ],

  // 📊 ORDERING
  setOrder: 1,        // Position in set
  addedOrder: 1,      // When you added it (higher = newer)
  similarCards: [2, 3], // Link similar cards by addedOrder
  maxInDeck: 4,       // Max copies in deck
}
```

---

## 🎯 Game Symbol Icons

### Available Icons
The app supports these game symbols:
- `{lore}` - Lore icon
- `{strength}` - Strength icon
- `{willpower}` - Willpower icon
- `{exert}` - Exert icon
- `{ink}` - Ink icon

### Icon Behavior
1. **With Brackets** `{exert}` → Shows as icon 🔄
2. **Without Brackets** `exert` → Shows as plain text
3. **In Search**: Both work the same! Searching "exert" finds cards with "exert" OR "{exert}"

### Examples
```typescript
// In abilities - use brackets to show icons
abilities: [
  "{Exert} - {Exert} chosen opposing character.",
  "Bold 2 - Pay {ink}{ink} to deal 2 damage.",
],

// In keywords - can use brackets in shownKeywords for icon display
shownKeywords: [
  "{Evasive}",  // Shows icon in search suggestions
  "Bodyguard",  // Shows as text
],
```

---

## 💰 Lorcana API Integration

### How It Works
The app automatically fetches real market prices from the **Lorcana API** (https://api.lorcana-api.com) when the page loads.

### Price Matching
The API matches your cards by:
1. **Name + Version** (most accurate)
2. **Name + Set** (fallback)
3. **Name only** (last resort)

### Important Notes
- ⚠️ **No API key required** - Lorcana API is free to use
- ⏱️ **Rate limiting** - 100ms delay between requests to be respectful
- 📊 **Price display** - Shows "Updating..." if price not found
- 🔄 **Auto-refresh** - Prices fetch automatically on app load

### Troubleshooting Prices

If a card's price isn't showing:

1. **Check the card name** - Must match Lorcana API's database
   ```typescript
   name: "Cruella De Vil",  // ✅ Correct
   version: "Miserable as Usual",  // ✅ Helps with matching
   ```

2. **Check the set name** - Should match official set names
   ```typescript
   set: "The First Chapter",  // ✅ Standard set name
   set: "Disney 23",          // ⚠️ Promo sets might not have prices
   ```

3. **Check console** - Open browser DevTools to see API responses:
   ```
   Console → Look for "No cards found for: [card name]"
   ```

4. **Manual price links** - Add TCGPlayer links as fallback:
   ```typescript
   links: [
     { 
       label: "TCGPlayer", 
       url: "https://www.tcgplayer.com/product/..." 
     },
   ],
   ```

---

## 🔧 Advanced Configuration

### Custom Icon URLs
Edit `/src/app/components/GameTextRenderer.tsx` to change icon URLs:

```typescript
const iconMap: Record<string, { url: string; alt: string; size?: string }> = {
  lore: {
    url: "YOUR_CUSTOM_LORE_ICON_URL",
    alt: "Lore",
    size: "h-5 w-5",
  },
  // ... other icons
};
```

### Set Icons
Add set icons in `/src/library/icons.ts`:

```typescript
export function getSetIcon(setName: string): string | undefined {
  const icons: Record<string, string> = {
    "The First Chapter": "https://example.com/set1.png",
    "Rise of the Floodborn": "https://example.com/set2.png",
  };
  return icons[setName];
}
```

---

## 🎨 Theme Customization

The light theme is configured in `/src/styles/theme.css`. To adjust colors:

```css
:root {
  --background: oklch(0.98 0 0);     /* Main background */
  --foreground: oklch(0.15 0 0);     /* Text color */
  --card: oklch(1 0 0);              /* Card background */
  --border: oklch(0.85 0 0);         /* Border color */
  /* ... more variables */
}
```

---

## 📚 API Reference

### Search Functionality
```typescript
// Normalize search: removes brackets for matching
const term = searchTerm.toLowerCase().replace(/\{|\}/g, '');

// Both match the same cards:
searchTerms = ["exert"];
searchTerms = ["{exert}"];
```

### Price Fetching
```typescript
import { fetchMarketPrice } from "@/utils/lorcanaApi";

// Fetch single card price
const price = await fetchMarketPrice(
  "Cruella De Vil",           // name
  "Miserable as Usual",       // version (optional)
  "Disney 23"                 // set (optional)
);
```

---

## 🐛 Common Issues

### Issue: Icons not showing in search
**Solution**: Make sure keywords use brackets: `"{Evasive}"` not `"Evasive"`

### Issue: Search not finding cards
**Solution**: Check if keywords are in `shownKeywords` or `hiddenKeywords` arrays

### Issue: Prices showing as "Updating..."
**Solutions**:
1. Check browser console for API errors
2. Verify card name matches Lorcana database
3. Some promo cards may not have prices in the API
4. Add manual TCGPlayer links as backup

### Issue: Similar cards not showing
**Solution**: Set the `similarCards` field with `addedOrder` values:
```typescript
similarCards: [2, 3, 5],  // Links to cards with these addedOrder values
```

---

## 🚦 Next Steps

You're all set! Here's what you can do now:

1. **Add your cards** to `/src/library/cards.ts`
2. **Test the search** with keywords and game symbols
3. **Check prices** - they'll auto-fetch from Lorcana API
4. **Customize icons** if you have your own assets
5. **Build decks** using the Deck Builder tab

---

## 📞 Support & Resources

- **Lorcana API Docs**: https://api.lorcana-api.com/docs
- **Icon Source**: https://github.com/DarknedKnight2024/Lorcana-Database
- **React Docs**: https://react.dev
- **Tailwind CSS**: https://tailwindcss.com

---

## 🎉 Enjoy Your Lorcana Tracker!

Your app is ready to track your Lorcana collection with:
- ✅ Real market prices from Lorcana API
- ✅ Beautiful light theme
- ✅ Smart search with icon support
- ✅ Clickable keywords and abilities
- ✅ Comprehensive card details

Happy collecting! 🎴✨

# 🔧 Troubleshooting Guide

## 🚨 Common Errors & Solutions

### Error: "Cannot read properties of undefined"
**Likely cause**: Missing field in card data

**Solution**: Make sure each card in `/src/library/cards.ts` has all required fields:
```typescript
{
  name: "Card Name",        // ✅ Required
  set: "Set Name",          // ✅ Required
  cardNumber: "001/204",    // ✅ Required
  rarity: "Rare",           // ✅ Required
  shownKeywords: [],        // ✅ Required (can be empty array)
  links: [],                // ✅ Required (can be empty array)
  // All other fields are optional
}
```

---

### Error: "Module not found" or Import errors
**Solutions**:
1. Make sure imports use `@/` alias:
   ```typescript
   // ✅ Correct
   import { LorcanaCard } from "@/app/components/AddCardDialog";
   
   // ❌ Wrong
   import { LorcanaCard } from "./components/AddCardDialog";
   ```

2. Check file names match exactly:
   - File: `/src/app/components/AddCardDialog.tsx`
   - Import: `from "@/app/components/AddCardDialog"`

---

### Error: API/CORS errors in console
**This is normal!** The Lorcana API might have CORS restrictions when called from browsers.

**What happens**:
- App tries to fetch real prices from Lorcana API
- If it fails (CORS or API down), app falls back to **estimated prices**
- You'll see: `"API unavailable - using estimated prices"`

**Estimated prices are based on rarity**:
- Common: $0.25 - $1.00
- Uncommon: $0.50 - $2.50
- Rare: $2.00 - $10.00
- Super Rare: $5.00 - $20.00
- Legendary/Enchanted: $15.00 - $50.00

---

## 💰 Getting Real Market Prices

### Option 1: Manual TCGPlayer Links (Recommended)
Add TCGPlayer links directly to your cards:

```typescript
{
  name: "Cruella De Vil",
  version: "Miserable as Usual",
  // ... other fields
  
  links: [
    {
      label: "TCGPlayer",
      url: "https://www.tcgplayer.com/product/EXACT_PRODUCT_ID_HERE"
    }
  ],
}
```

**How to get TCGPlayer URLs**:
1. Go to https://www.tcgplayer.com
2. Search for your card
3. Copy the full URL
4. Paste it in the `links` array

---

### Option 2: Use TCGPlayer API (Requires API Key)
If you want real-time prices, you can get a TCGPlayer API key:

1. **Sign up**: https://developer.tcgplayer.com/
2. **Get API Key**: Create an app and get your credentials
3. **Add to your app**: I can help you integrate it (let me know!)

**Cost**: Free for personal use (up to 1000 requests/day)

---

### Option 3: Keep Using Estimated Prices
The app works perfectly with estimated prices! They're:
- ✅ Based on real rarity values
- ✅ Updated every time the page loads
- ✅ Close to actual market prices for most cards

---

## 🐛 Debugging Steps

### Step 1: Check Browser Console
1. Press `F12` (or right-click → Inspect)
2. Click "Console" tab
3. Look for error messages
4. Take a screenshot and share it with me

### Step 2: Check Card Data Format
Common mistakes in `/src/library/cards.ts`:

```typescript
// ❌ WRONG - Missing required fields
{
  name: "Mickey Mouse",
  // Missing: set, cardNumber, rarity, shownKeywords, links
}

// ✅ CORRECT - All required fields
{
  name: "Mickey Mouse",
  version: "Brave Little Tailor",
  set: "The First Chapter",
  cardNumber: "001/204",
  rarity: "Legendary",
  shownKeywords: ["Mickey Mouse", "Ruby"],
  links: [],
}
```

### Step 3: Check for Syntax Errors
Make sure:
- All brackets `{ }` are closed
- All arrays `[ ]` are closed
- Commas between objects
- Quotes around strings

```typescript
export const libraryCards = [
  {
    // Card 1
  },  // ← Don't forget comma!
  {
    // Card 2
  },  // ← Don't forget comma!
  {
    // Card 3
  }   // ← Last card: no comma
];
```

---

## 🔍 Common React Errors

### "map is not a function"
**Cause**: Field is not an array

**Fix**: Make sure arrays are arrays:
```typescript
// ❌ WRONG
keywords: "Evasive"

// ✅ CORRECT
keywords: ["Evasive"]
```

### "Cannot read property 'length' of undefined"
**Cause**: Optional field is missing

**Fix**: The app should handle this automatically. If you see this error, let me know which line number and I'll fix it.

---

## 📊 Price Troubleshooting

### Prices showing as "$0.00"
**Cause**: generateMockPrice returned 0

**Fix**: Check if `rarity` field exists and is spelled correctly:
```typescript
// ✅ CORRECT
rarity: "Legendary"
rarity: "Super Rare"
rarity: "Rare"
rarity: "Uncommon"
rarity: "Common"

// ❌ WRONG (won't match)
rarity: "leg"
rarity: "SR"
```

### Prices not updating
**Solutions**:
1. **Hard refresh**: Press `Ctrl+Shift+R` (or `Cmd+Shift+R` on Mac)
2. **Clear cache**: Browser settings → Clear browsing data
3. **Check console**: Look for API errors

### "Updating..." stuck forever
**Cause**: `marketPrice` is undefined

**This should be fixed now!** The new code always assigns a price (either from API or estimated).

If you still see "Updating...", check:
```typescript
// In CardItemSimple.tsx and CardDetailPage.tsx
{card.marketPrice !== undefined ? (
  <span>${card.marketPrice.toFixed(2)}</span>
) : (
  <span>Updating...</span>  // ← Should never happen now
)}
```

---

## 🎯 How to Ensure Correct Prices

### Best Practice: Use Multiple Price Sources

```typescript
{
  name: "Cruella De Vil",
  version: "Miserable as Usual",
  set: "Disney 23",
  rarity: "Disney Expo",
  
  // ✅ Add multiple links for price comparison
  links: [
    {
      label: "TCGPlayer",
      url: "https://www.tcgplayer.com/product/..."
    },
    {
      label: "eBay",
      url: "https://www.ebay.com/..."
    },
    {
      label: "Cardmarket (EU)",
      url: "https://www.cardmarket.com/..."
    }
  ],
  
  // The app will show estimated price on the card
  // but users can click links to see real prices
}
```

---

## 🔄 Manual Price Override

If you want to **manually set prices** instead of using API or estimates:

### Option 1: Create a price mapping file

Create `/src/library/prices.ts`:
```typescript
export const manualPrices: Record<string, number> = {
  "Cruella De Vil - Miserable as Usual": 45.00,
  "Mickey Mouse - Brave Little Tailor": 25.50,
  // Add more cards here
};
```

Then in `App.tsx`, use this instead of API:
```typescript
import { manualPrices } from "../library/prices";

// In fetchAllPrices:
const cardKey = card.version 
  ? `${card.name} - ${card.version}`
  : card.name;
  
const marketPrice = manualPrices[cardKey] || generateMockPrice(card.rarity);
```

### Option 2: Add price directly to card data

Add a `customPrice` field:
```typescript
// In AddCardDialog.tsx interface:
export interface LorcanaCard {
  // ... existing fields
  customPrice?: number;  // ← Add this
}

// In your card:
{
  name: "Cruella De Vil",
  version: "Miserable as Usual",
  customPrice: 45.00,  // ← Override price here
  // ... rest of card
}

// In App.tsx:
const marketPrice = card.customPrice || 
  (await fetchMarketPrice(...)) || 
  generateMockPrice(card.rarity);
```

---

## 📞 Still Having Issues?

If you're still seeing errors:

1. **Share the error message**: Copy the exact error from console
2. **Share the error location**: What file and line number?
3. **Share your card data**: Show me one of your cards from `/src/library/cards.ts`
4. **Share browser console**: Screenshot of F12 console

I'll help you fix it immediately! 🚀

---

## ✅ Quick Checklist

Before asking for help, verify:

- [ ] All cards have `name`, `set`, `cardNumber`, `rarity`
- [ ] All cards have `shownKeywords` array (can be empty)
- [ ] All cards have `links` array (can be empty)
- [ ] All brackets and commas are correct in cards.ts
- [ ] Browser console is open (F12) to see errors
- [ ] Page has been hard-refreshed (Ctrl+Shift+R)

---

## 🎉 Expected Behavior

### On App Load:
1. See toast: "Fetching market prices..."
2. Wait 2-5 seconds
3. See one of:
   - ✅ "Market prices updated: X/Y from API"
   - ⚠️ "Using estimated prices (API returned no data)"
   - ⚠️ "API unavailable - using estimated prices"

### On Card Grid:
- All cards show a price (never "Updating..." or "$0.00")
- Prices are green and bold
- Hover over cards = slight zoom effect

### On Card Click:
- Detail page opens
- Price shows in top-left under image
- All sections display properly

If any of these don't work, **let me know!** 🔧

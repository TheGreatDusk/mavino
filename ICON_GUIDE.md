# 🎯 Game Symbol Icon Guide

## Quick Reference: Brackets = Icons

### The Rule
- **`{exert}`** → Shows icon 🔄
- **`exert`** → Shows as plain text

### Why It Works This Way
The brackets `{}` are a visual cue that tells the renderer to replace the text with an icon. Without brackets, it's just regular text. This gives you full control over when icons appear.

---

## 🔍 In Search

### Both Work the Same!
When searching, the app treats these as **identical**:
- Searching: `"exert"` 
- Searching: `"{exert}"`
- **Result**: Both find cards containing "exert" or "{exert}"

### Example
```typescript
// In your card data:
shownKeywords: ["{Evasive}", "exert", "Rush"],

// All these searches find the card:
- Search: "evasive" ✅
- Search: "{evasive}" ✅
- Search: "Evasive" ✅
- Search: "{Evasive}" ✅
- Search: "exert" ✅
- Search: "{exert}" ✅
```

---

## 📝 In Card Data

### Keywords Field
```typescript
keywords: [
  "Evasive",      // Displays as text in Keywords section
  "Bodyguard",    // Displays as text in Keywords section
  "Rush",         // Displays as text in Keywords section
]
```
**Note**: The `keywords` field is for display only. It doesn't support icons. Use plain text here.

### Shown Keywords (Search Suggestions)
```typescript
shownKeywords: [
  "{Evasive}",    // 🔄 Shows icon in search dropdown
  "Bodyguard",    // Shows as text in search dropdown
  "{Exert}",      // 🔄 Shows icon in search dropdown
]
```
**Use icons here!** This is where search suggestions display, so icons make it visually clear.

### Abilities Field
```typescript
abilities: [
  // ✅ WITH ICONS (recommended for game actions)
  "{Exert} - {Exert} chosen opposing character.",
  // Displays as: [🔄 icon] - [🔄 icon] chosen opposing character.
  
  // ✅ WITH ICONS (for costs)
  "Bold 2 - Pay {ink}{ink} to deal 2 damage to chosen character.",
  // Displays as: Bold 2 - Pay [💧 icon][💧 icon] to deal 2 damage...
  
  // ✅ MIXED (icons + text)
  "Evasive - Only characters with Evasive can challenge this character.",
  // Displays as: Evasive - Only characters with Evasive can challenge...
  
  // ✅ PLAIN TEXT (no game symbols)
  "Draw 2 cards when this character enters play.",
  // Displays as: Draw 2 cards when this character enters play.
]
```

---

## 🎨 Visual Examples

### Example 1: Exert Ability
```typescript
// ❌ DON'T DO THIS (no icons)
abilities: [
  "Exert - Exert chosen opposing character."
]
// Displays: Exert - Exert chosen opposing character. (all text)

// ✅ DO THIS (with icons)
abilities: [
  "{Exert} - {Exert} chosen opposing character."
]
// Displays: [🔄] - [🔄] chosen opposing character. (with icons)
```

### Example 2: Ink Cost
```typescript
// ❌ DON'T DO THIS
abilities: [
  "Bold 2 - Pay 2 ink to deal 2 damage."
]
// Displays: Bold 2 - Pay 2 ink to deal 2 damage. (all text)

// ✅ DO THIS
abilities: [
  "Bold 2 - Pay {ink}{ink} to deal 2 damage."
]
// Displays: Bold 2 - Pay [💧][💧] to deal 2 damage. (with icons)
```

### Example 3: Stats Reference
```typescript
// ✅ GOOD (with icons for stats)
abilities: [
  "Challenge +2 - This character gets +2 {strength} while challenging."
]
// Displays: Challenge +2 - This character gets +2 [⚔️] while challenging.

// ✅ ALSO GOOD (text reference)
flavorText: "His strength is unmatched in all the land."
// Displays: His strength is unmatched in all the land. (flavor text is always plain)
```

---

## 📊 Available Icons

| Keyword | Icon Code | What It Shows |
|---------|-----------|---------------|
| Exert | `{exert}` | 🔄 Rotation icon |
| Lore | `{lore}` | 📖 Lore icon |
| Strength | `{strength}` | ⚔️ Strength icon |
| Willpower | `{willpower}` | 🛡️ Willpower icon |
| Ink | `{ink}` | 💧 Ink icon |

---

## 🎯 Best Practices

### 1. Use Icons for Game Actions
```typescript
// ✅ GOOD
"{Exert} - {Exert} chosen opposing character."
"{Exert}, Pay {ink}{ink} - Draw 2 cards."
```

### 2. Use Text for Keyword Names (in abilities)
```typescript
// ✅ GOOD (mixing is fine!)
"Evasive - Only characters with Evasive can challenge this character."
// "Evasive" at start is the ability name (clear and readable)
// "Evasive" in text is the game term (also clear)
```

### 3. Use Icons in Costs
```typescript
// ✅ GOOD
"Pay {ink}{ink}{ink} to draw 3 cards."
"Sing this song for {ink}{ink} less."
```

### 4. Use Icons in Search Keywords
```typescript
// ✅ GOOD (helps visually identify game actions)
shownKeywords: [
  "Mickey Mouse",
  "Ruby",
  "{Evasive}",     // 🔄 Shows icon in search
  "{Bodyguard}",   // 🛡️ Shows icon in search
]
```

---

## 🔄 Real-World Example

Here's a complete card setup:

```typescript
{
  name: "Stitch",
  version: "Rock Star",
  set: "The First Chapter",
  cardNumber: "123/204",
  rarity: "Rare",
  
  // Search suggestions with icons
  shownKeywords: [
    "Stitch",
    "Rock Star",
    "Sapphire",
    "{Evasive}",      // 🔄 Icon in search
    "{Reckless}",     // 🔄 Icon in search
  ],
  
  // Hidden search terms (no icons needed)
  hiddenKeywords: [
    "ink: 3",
    "strength: 2",
    "willpower: 3",
    "lore: 1",
  ],
  
  // Card stats
  ink: "Sapphire",
  cost: 3,
  inkwell: true,
  type: "Character",
  strength: 2,
  willpower: 3,
  lore: 1,
  
  // Keywords (display only - plain text)
  keywords: [
    "Evasive",
    "Reckless",
  ],
  
  // Abilities (with icons for game actions)
  abilities: [
    "Evasive - Only characters with Evasive can challenge this character.",
    "Reckless - This character can't quest and must challenge if able.",
    "{Exert} - Deal 1 damage to chosen character.",
    // Note: Keyword names are plain text, but game actions use icons
  ],
  
  flavorText: "He's got a new sound!",
  artist: "John Doe",
  
  links: [
    { label: "TCGPlayer", url: "https://..." }
  ],
  
  setOrder: 123,
  addedOrder: 5,
  maxInDeck: 4,
}
```

### What This Looks Like:

**Search Suggestions:**
- Stitch
- Rock Star  
- Sapphire
- [🔄 Evasive icon]
- [🔄 Reckless icon]

**Keywords Section (on card detail page):**
- Evasive
- Reckless

**Abilities Section:**
- Evasive - Only characters with Evasive can challenge this character.
- Reckless - This character can't quest and must challenge if able.
- [🔄] - Deal 1 damage to chosen character.

---

## 💡 Pro Tips

1. **Consistency**: Pick a style and stick with it across all your cards
2. **Readability**: Use icons for game symbols, text for ability names
3. **Search**: Add both `{Exert}` (for icon display) to shownKeywords
4. **Abilities**: Use `{exert}` in ability text for actions
5. **Flavor Text**: Never needs icons (it's flavor, not mechanics!)

---

## 🎓 Summary

| Context | Use Brackets? | Example |
|---------|---------------|---------|
| Ability game action | ✅ Yes | `"{Exert} - {Exert} target"` |
| Ability name | ❌ No | `"Evasive - Only..."` |
| Search keywords | ✅ Yes | `"{Evasive}"` |
| Keywords field | ❌ No | `["Evasive", "Rush"]` |
| Costs | ✅ Yes | `"Pay {ink}{ink}"` |
| Flavor text | ❌ No | `"He's unstoppable!"` |
| Hidden keywords | ❌ No | `"ink: 3"` |

**Remember**: Brackets = Icons. No brackets = Text. Search ignores brackets automatically! 🎯

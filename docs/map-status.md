# Map Status

Tracks the content tier and sync state of all maps in the atlas.

---

## Upstream sync

| Field | Value |
|-------|-------|
| **lastUpstreamSync** | 2026-04-01 |
| **mapCount (ours)** | 64 |
| **source** | https://github.com/openfront/openfront |

Update `lastUpstreamSync` every time the upstream repo is checked for new maps, even if none were added.

---

## Content tiers

| Tier | Description |
|------|-------------|
| **rich** | Full Geography/History + Strategy (Best Spawns, Avoid, Insights) + Fun Facts |
| **standard** | Most sections present, shorter or fewer subsections |
| **concise** | Complete but brief — typical for arcade/tourney/fantasy maps |

---

## Map list

| Slug | Title | Category | Tier | Lines |
|------|-------|----------|------|-------|
| achiran | Achiran | fantasy | concise | 33 |
| aegean | Aegean | regional | rich | 49 |
| africa | Africa | continental | standard | 47 |
| alps | Alps | regional | rich | 49 |
| amazonriver | Amazon River | regional | rich | 49 |
| arctic | Arctic | regional | rich | 49 |
| asia | Asia | continental | rich | 49 |
| australia | Australia | continental | rich | 49 |
| baikal | Baikal | regional | rich | 49 |
| baikalnukewars | Baikal Nuke Wars | arcade | concise | 33 |
| beringstrait | Bering Strait | regional | standard | 48 |
| betweentwoseas | Between Two Seas | regional | rich | 49 |
| blacksea | Black Sea | regional | rich | 49 |
| bosphorusstraits | Bosphorus Straits | regional | rich | 49 |
| britannia | Britannia | regional | standard | 47 |
| britanniaclassic | Britannia Classic | regional | rich | 49 |
| deglaciatedantarctica | Deglaciated Antarctica | regional | standard | 37 |
| didier | Didier | fantasy | concise | 33 |
| didierfrance | Didier France | fantasy | concise | 33 |
| eastasia | East Asia | regional | rich | 49 |
| europe | Europe | continental | standard | 47 |
| europeclassic | Europe Classic | regional | rich | 49 |
| falklandislands | Falkland Islands | regional | rich | 49 |
| faroeislands | Faroe Islands | regional | rich | 49 |
| fourislands | Four Islands | fantasy | concise | 33 |
| gatewaytotheatlantic | Gateway to the Atlantic | regional | rich | 49 |
| giantworldmap | Giant World Map | regional | rich | 49 |
| gulfofstlawrence | Gulf of St. Lawrence | regional | rich | 49 |
| halkidiki | Halkidiki | regional | rich | 49 |
| hawaii | Hawaii | regional | rich | 49 |
| iceland | Iceland | regional | rich | 49 |
| italia | Italia | regional | rich | 49 |
| japan | Japan | regional | rich | 49 |
| lemnos | Lemnos | regional | rich | 49 |
| lisbon | Lisbon | regional | rich | 49 |
| manicouagan | Manicouagan | regional | rich | 49 |
| mars | Mars | fantasy | standard | 39 |
| mediterranean | Mediterranean | regional | rich | 49 |
| mena | MENA | regional | rich | 49 |
| milkyway | Milky Way | fantasy | standard | 37 |
| montreal | Montreal | regional | rich | 49 |
| newyorkcity | New York City | regional | rich | 53 |
| niledelta | Nile Delta | regional | rich | 53 |
| northamerica | North America | continental | standard | 47 |
| oceania | Oceania | regional | rich | 53 |
| pangaea | Pangaea | fantasy | standard | 39 |
| passage | Passage | arcade | concise | 32 |
| pluto | Pluto | fantasy | concise | 32 |
| sanfrancisco | San Francisco | regional | rich | 53 |
| sierpinski | Sierpinski | arcade | concise | 32 |
| southamerica | South America | regional | rich | 53 |
| straitofgibraltar | Strait of Gibraltar | regional | standard | 44 |
| straitofhormuz | Strait of Hormuz | regional | rich | 53 |
| surrounded | Surrounded | arcade | concise | 32 |
| svalmel | Svalmel | fantasy | concise | 32 |
| thebox | The Box | arcade | concise | 32 |
| tourney1 | Tourney1 | arcade | concise | 32 |
| tourney2 | Tourney2 | arcade | concise | 32 |
| tourney3 | Tourney3 | arcade | concise | 32 |
| tourney4 | Tourney4 | arcade | concise | 32 |
| tradersdream | Traders Dream | fantasy | concise | 33 |
| twolakes | Two Lakes | regional | rich | 50 |
| world | World | continental | standard | 44 |
| yenisei | Yenisei | regional | rich | 53 |

---

## Content coverage summary

| Tier | Count |
|------|-------|
| rich | 43 |
| standard | 11 |
| concise | 16 |
| **Total** | **64** |

---

## Notes

- `Lines` is the raw line count of the `.md` file and is used as a rough proxy for content depth.
  It will change as content is edited; treat tier as the canonical status, not line count.
- Concise maps (arcade/tourney/some fantasy) are intentionally brief — they don't need History sections.
- When upgrading a map from concise → standard → rich, update both the `Tier` column and the `Lines` count here.

# Map Status

Tracks all active upstream maps in the atlas, plus legacy maps removed from the current upstream roster.

---

## Upstream sync

| Field | Value |
|-------|-------|
| **lastUpstreamSync** | 2026-05-04 |
| **upstreamCommit** | 8ea3426 |
| **activeMapCount (ours)** | 75 |
| **legacyMapCount (ours)** | 1 |
| **source** | https://github.com/openfrontio/OpenFrontIO |

Update `lastUpstreamSync` every time the upstream repo is checked for map changes, even if none were added.
Active map stats come from upstream `resources/maps/<slug>/manifest.json`, categories from `src/core/game/Game.ts`, and playlist frequency from `src/server/MapPlaylist.ts`.

---

## Active map list

All 75 active upstream maps have atlas data, thumbnails, and English editorial content.

| Slug | Title | Category |
|------|-------|----------|
| achiran | Achiran | fantasy |
| aegean | Aegean | regional |
| africa | Africa | continental |
| alps | Alps | regional |
| amazonriver | Amazon River | regional |
| antarctica | Antarctica | continental |
| archipelagosea | Archipelago Sea | regional |
| arctic | Arctic | regional |
| asia | Asia | continental |
| australia | Australia | regional |
| baikal | Baikal | regional |
| baikalnukewars | Baikal (Nuke Wars) | fantasy |
| bajacalifornia | Baja California | regional |
| beringsea | Bering Sea | regional |
| beringstrait | Bering Strait | regional |
| betweentwoseas | Between Two Seas | regional |
| blacksea | Black Sea | regional |
| bosphorusstraits | Bosphorus Straits | regional |
| britannia | Britannia | regional |
| britanniaclassic | Britannia (Classic) | regional |
| caucasus | Caucasus | regional |
| conakry | Conakry | regional |
| deglaciatedantarctica | Deglaciated Antarctica | fantasy |
| didier | Didier | arcade |
| didierfrance | Didier (France) | arcade |
| dyslexdria | Dyslexdria | fantasy |
| eastasia | East Asia | regional |
| europe | Europe | continental |
| europeclassic | Europe (Classic) | continental |
| falklandislands | Falkland Islands | regional |
| faroeislands | Faroe Islands | regional |
| fourislands | Four Islands | fantasy |
| gatewaytotheatlantic | Gateway to the Atlantic | regional |
| giantworldmap | Giant World Map | continental |
| greatlakes | Great Lakes | regional |
| gulfofstlawrence | Gulf of St. Lawrence | regional |
| halkidiki | Halkidiki | regional |
| hawaii | Hawaii | regional |
| iceland | Iceland | regional |
| italia | Italia | regional |
| japan | Japan | regional |
| lemnos | Lemnos | regional |
| lisbon | Lisbon | regional |
| losangeles | Los Angeles | regional |
| luna | Luna | fantasy |
| manicouagan | Manicouagan | regional |
| marenostrum | Mare Nostrum | regional |
| mars | Mars | fantasy |
| mena | MENA | regional |
| milkyway | Milky Way | fantasy |
| montreal | Montreal | regional |
| newyorkcity | New York City | regional |
| niledelta | Nile Delta | regional |
| northamerica | North America | continental |
| oceania | Oceania | continental |
| pangaea | Pangaea | fantasy |
| passage | Passage | fantasy |
| pluto | Pluto | fantasy |
| sanfrancisco | San Francisco | regional |
| sierpinski | Sierpinski | arcade |
| southamerica | South America | continental |
| straitofgibraltar | Strait of Gibraltar | regional |
| straitofhormuz | Strait of Hormuz | regional |
| straitofmalacca | Strait of Malacca | regional |
| surrounded | Surrounded | fantasy |
| svalmel | Svalmel | fantasy |
| thebox | The Box | arcade |
| tourney1 | Tourney 2 Teams | tournament |
| tourney2 | Tourney 3 Teams | tournament |
| tourney3 | Tourney 4 Teams | tournament |
| tourney4 | Tourney 8 Teams | tournament |
| tradersdream | Traders Dream | fantasy |
| twolakes | Two Lakes | regional |
| world | World | continental |
| yenisei | Yenisei | regional |

---

## Legacy map list

Legacy maps were present in a prior atlas sync but are no longer active upstream. Keep them browsable, but do not count them as active upstream maps.

| Slug | Title | Last Category | Replacement | Marked Legacy |
|------|-------|---------------|-------------|---------------|
| mediterranean | Mediterranean | regional | marenostrum | 2026-05-04 |

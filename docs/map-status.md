# Map Status

Tracks all active upstream maps in the atlas, plus legacy maps removed from the current upstream roster.

---

## Upstream sync

| Field | Value |
|-------|-------|
| **lastUpstreamSync** | 2026-07-12 |
| **upstreamRef** | main |
| **upstreamCommit** | e57939a |
| **activeMapCount (ours)** | 105 |
| **legacyMapCount (ours)** | 1 |
| **source** | https://github.com/openfrontio/OpenFrontIO |

Update `lastUpstreamSync` every time the upstream repo is checked for map changes, even if none were added.
Active map stats come from upstream `resources/maps/<slug>/manifest.json`; category and playlist metadata are generated from `map-generator/assets/maps/<slug>/info.json` into `src/core/game/Maps.gen.ts`.

The atlas follows upstream `main`, matching previous syncs. At this sync, the latest stable tag (`v0.32.9`) contained 95 maps; 10 additional official map assets were present only on `main`.

---

## Active map list

All 105 active upstream maps have atlas data and light/dark raster assets. Every map has English editorial content, and all 30 maps added in this sync have matching French editorial content.

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
| balkans | Balkans | regional |
| beringsea | Bering Sea | regional |
| beringstrait | Bering Strait | regional |
| betweentwoseas | Between Two Seas | regional |
| blacksea | Black Sea | regional |
| bosphorusstraits | Bosphorus Straits | regional |
| branchingpaths | Branching Paths | arcade |
| britannia | Britannia | regional |
| britanniaclassic | Britannia (Classic) | regional |
| caribbean | Caribbean | regional |
| caspiansea | Caspian Sea | regional |
| caucasus | Caucasus | regional |
| china | China | regional |
| choppingblock | Chopping Block | arcade |
| conakry | Conakry | regional |
| danishstraits | Danish Straits | regional |
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
| germany | Germany | regional |
| giantworldmap | Giant World Map | continental |
| greatlakes | Great Lakes | regional |
| gulfofstlawrence | Gulf of St. Lawrence | regional |
| halkidiki | Halkidiki | regional |
| hawaii | Hawaii | regional |
| hongkong | Hong Kong | regional |
| iceland | Iceland | regional |
| indiansubcontinent | Indian Subcontinent | regional |
| irishsea | Irish Sea | regional |
| italia | Italia | regional |
| japan | Japan | regional |
| juandefucastrait | Juan De Fuca Strait | regional |
| korea | Korea | regional |
| labyrinth | Labyrinth | arcade |
| lemnos | Lemnos | regional |
| levant | Levant | regional |
| lisbon | Lisbon | regional |
| losangeles | Los Angeles | regional |
| luna | Luna | fantasy |
| manicouagan | Manicouagan | regional |
| marenostrum | Mare Nostrum | regional |
| mars | Mars | fantasy |
| mena | MENA | regional |
| middleeast | Middle East | regional |
| milkyway | Milky Way | fantasy |
| mississippiriver | Mississippi River | regional |
| montreal | Montreal | regional |
| newyorkcity | New York City | regional |
| niledelta | Nile Delta | regional |
| northamerica | North America | continental |
| northwestpassage | Northwest Passage | regional |
| oceania | Oceania | continental |
| onion | Onion | arcade |
| pangaea | Pangaea | fantasy |
| passage | Passage | fantasy |
| pluto | Pluto | fantasy |
| russia | Russia | regional |
| sanfrancisco | San Francisco | regional |
| scandinavia | Scandinavia | regional |
| sierpinski | Sierpinski | arcade |
| southamerica | South America | continental |
| southeastasia | Southeast Asia | regional |
| straitofgibraltar | Strait of Gibraltar | regional |
| straitofhormuz | Strait of Hormuz | regional |
| straitofmalacca | Strait of Malacca | regional |
| surrounded | Surrounded | fantasy |
| svalmel | Svalmel | fantasy |
| taiwanstrait | Taiwan Strait | regional |
| thebox | The Box | arcade |
| tierradelfuego | Tierra Del Fuego | regional |
| titan | Titan | fantasy |
| tourney1 | Tourney 2 Teams | tournament |
| tourney2 | Tourney 3 Teams | tournament |
| tourney3 | Tourney 4 Teams | tournament |
| tourney4 | Tourney 8 Teams | tournament |
| tradersdream | Traders Dream | fantasy |
| twolakes | Two Lakes | regional |
| unitedstates | United States | regional |
| venice | Venice | regional |
| warshipwarship | Warship Warship | arcade |
| world | World | continental |
| worldinverted | World Inverted | fantasy |
| yellowsea | Yellow Sea | regional |
| yenisei | Yenisei | regional |

---

## Legacy map list

Legacy maps were present in a prior atlas sync but are no longer active upstream. Keep them browsable, but do not count them as active upstream maps.

| Slug | Title | Last Category | Replacement | Marked Legacy |
|------|-------|---------------|-------------|---------------|
| mediterranean | Mediterranean | regional | marenostrum | 2026-05-04 |

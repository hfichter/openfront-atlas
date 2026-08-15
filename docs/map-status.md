# Map Status

Tracks all active upstream maps in the atlas, plus legacy maps removed from the current upstream roster.

---

## Upstream sync

| Field | Value |
|-------|-------|
| **lastUpstreamSync** | 2026-08-15 |
| **upstreamRef** | main |
| **upstreamCommit** | b6c194e |
| **activeMapCount (ours)** | 118 |
| **legacyMapCount (ours)** | 1 |
| **source** | https://github.com/openfrontio/OpenFrontIO |

Update `lastUpstreamSync` every time the upstream repo is checked for map changes, even if none were added.
Active map stats and playlist metadata come from upstream `resources/maps/<slug>/manifest.json`. Atlas keeps its own five-category navigation taxonomy and optional geographic pin metadata when those upstream-owned fields are refreshed.

The atlas follows upstream `main`, matching previous syncs. This sync added 13 official maps and refreshed upstream-owned stats, nation metadata, thumbnails, terrain renders, and referenced flags for the full active roster.

---

## Active map list

All 118 active upstream maps have Atlas data, English and French editorial content, and light/dark raster assets.

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
| balkhash | Balkhash | regional |
| baltics | Baltics | regional |
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
| clearwaterlakes | Clearwater Lakes | regional |
| conakry | Conakry | regional |
| crimea | Crimea | regional |
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
| fingerlakes | Finger Lakes | regional |
| fourislands | Four Islands | fantasy |
| france | France | regional |
| gatewaytotheatlantic | Gateway to the Atlantic | regional |
| germany | Germany | regional |
| giantworldmap | Giant World Map | continental |
| greatlakes | Great Lakes | regional |
| gulfofguinea | Gulf Of Guinea | regional |
| gulfofstlawrence | Gulf of St. Lawrence | regional |
| halkidiki | Halkidiki | regional |
| hawaii | Hawaii | regional |
| hecatestrait | Hecate Strait | regional |
| hongkong | Hong Kong | regional |
| iceland | Iceland | regional |
| indiansubcontinent | Indian Subcontinent | regional |
| irishsea | Irish Sea | regional |
| italia | Italia | regional |
| japan | Japan | regional |
| juandefucastrait | Juan De Fuca Strait | regional |
| korea | Korea | regional |
| labyrinth | Labyrinth | arcade |
| lasvegasstrip | Las Vegas Strip | regional |
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
| morethanluck | More Than Luck | arcade |
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
| sol | Sol | fantasy |
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
| vietnam | Vietnam | regional |
| warshipwarship | Warship Warship | arcade |
| world | World | continental |
| worldinverted | World Inverted | fantasy |
| yangtzeriver | Yangtze River | regional |
| yellowsea | Yellow Sea | regional |
| yenisei | Yenisei | regional |

---

## Legacy map list

Legacy maps were present in a prior atlas sync but are no longer active upstream. Keep them browsable, but do not count them as active upstream maps.

| Slug | Title | Last Category | Replacement | Marked Legacy |
|------|-------|---------------|-------------|---------------|
| mediterranean | Mediterranean | regional | marenostrum | 2026-05-04 |

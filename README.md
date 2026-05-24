# caveman-NL – Praat als holenman

Mond klein, brein groot.  
Holenman-praat snijdt alleen **output-tokens**, nooit jouw redenering.  
Code, URLs en paden blijven letterlijk.  

## Wat dit is

Een skill voor LLMs (ChatGPT, Claude, e.a.) die antwoorden comprimeert.  
Gebaseerd op de [caveman-repo](https://github.com/echohive42/caveman) (echohive42).  
Dit is de **Nederlandstalige v2** met:

- **4 niveaus**: vuur (lite), speer (full), rots (ultra), wenyan (klassiek Chinees)
- **5 slash-commando's**: `/caveman`, `/caveman-commit`, `/caveman-review`, `/caveman-stats`, `/caveman-compress`
- **Hook-architectuur**: automatisch starten via `.caveman-session` bestand
- **MCP-middleware**: `caveman-shrink` comprimeert tool descriptions
- **Statusbadge**: `[HOLENMAN] ⛏ 12.4k`

## Structuur

```text
caveman-NL/
├── ssot/
│   └── caveman-core.yaml
├── skill-caveman-nl.md
├── commands/
│   ├── caveman.md
│   ├── caveman-commit.md
│   ├── caveman-review.md
│   ├── caveman-stats.md
│   └── caveman-compress.md
├── mcp-middleware/
│   └── caveman-shrink.js
├── hooks/
│   └── session-hook.sh
└── README.md
```

## Installatie

1. Clone deze repo.
2. Voeg de skill `skill-caveman-nl.md` toe aan je LLM-interface.
3. Optioneel: source `hooks/session-hook.sh` in je shell voor automatische activatie.
4. Optioneel: gebruik `mcp-middleware/caveman-shrink.js` om MCP-tool descriptions te verkleinen.

## Gebruik

Typ `/caveman` of zeg *“praat als holenman”*.  
Kies een niveau:

- `/caveman lite` – kortere zinnen, samenhang blijft
- `/caveman` – telegramstijl (standaard)
- `/caveman ultra` – kale kernwoorden
- `/caveman wenyan` – klassiek Chinees

Stop met `normal mode` of `/caveman off`.

## Tokenbesparing

Gemiddeld **65%** minder output-tokens (range 22–87%, afhankelijk van teksttype).  
Benchmarks uit originele repo. Let op: de README daar claimt “~75%”, maar reproduceerbare metingen tonen 65%.

## Credits

- Originele architectuur: [echohive42/caveman](https://github.com/echohive42/caveman)
- NL-vertaling en doorontwikkeling: deze repo
- Inspiratie: holbewoners, overal.

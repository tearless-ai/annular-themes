# The theme format

A theme is one JSON object in a file that ends in `.annulartheme`.
This page describes format 4, the one Annular 1.2 reads and writes.

Three things are worth knowing before the tables.

- **Every key is optional except `id`.** A key you leave out takes the value in the Default column.
  A missing `palette` or `typography` takes the Annular theme's.
- **Annular is forgiving.** It ignores a key it does not know, and it pulls a number that is out of range back into range. A theme never breaks the app.
  The check in this repo is stricter, so that a typo is found instead of quietly doing nothing.
- **Sizes scale.** Lengths in points are for the Medium widget size, and Annular scales them for Small and Large. Sizes called a ratio or a scale are a fraction of the ring's diameter.

## Top level

| Key | Kind | Default | What it does |
| --- | --- | --- | --- |
| `schemaVersion` | whole number | `1` | The format the file was written for. Write `4`. |
| `id` | text | required | The theme's identity. Use a reverse domain of your own, such as `com.yourname.night-shift`. Ids that start with `app.annular.` belong to the built-in themes. When an id is already taken on someone's Mac, Annular imports the theme under a fresh one, so nothing is overwritten. |
| `name` | text | the `id` | The name shown in the app. |
| `author` | text | empty | Shown under the name. |
| `layout` | `vertical`, `horizontal`, `composite` | `vertical` | Rings in a column, rings in a row, or one large ring for the tightest limit with the others inside it. |
| `palette` | object | the Annular theme's | [Colors](#palette). |
| `typography` | object | the Annular theme's | [Fonts](#typography). |
| `panel` | object | see below | [The surface behind the rings](#panel). |
| `ring` | object | see below | [The rings](#ring). |
| `labels` | object | see below | [The words next to the rings](#labels). |
| `states` | object | see below | [Stale and empty readings](#states). |
| `expanded` | object | see below | [The panel that opens on a click](#expanded). |
| `menuBar` | object | see below | [The menu bar item](#menubar). |
| `keepAwake` | object | see below | [The keep-awake mark](#keepawake). |

## Colors

A color is text: `#rrggbb`, or `#rrggbbaa` with transparency, where `aa` is `00` for clear and `ff` for solid.
`#161920b8` is a dark blue-grey at 72 percent.

## `palette`

| Key | Default | Used for |
| --- | --- | --- |
| `background` | `#161920b8` | The panel behind the rings. |
| `border` | `#ffffff14` | The panel's outline. |
| `track` | `#ffffff1a` | The part of a ring that is not filled. |
| `normal` | `#4fc3b8` | A ring below its warning threshold. |
| `warning` | `#e8b04b` | A ring past its warning threshold. |
| `critical` | `#f0654e` | A ring past its critical threshold. |
| `label` | `#e9ecf1` | Numbers and main text. |
| `muted` | `#8b95a3` | Captions and quiet text. |
| `accent` | `#4fc3b8` | The header glyph, the accent stripe, the keep-awake mark when it is on. |

Ring colors carry meaning, so keep `normal`, `warning`, and `critical` easy to tell apart, also for people who do not see red and green well.
The thresholds themselves are the person's setting, not the theme's.

## `typography`

Three roles, each with the same keys: `display` (numbers and percents), `label` (the short words next to rings), and `caption` (reset times and small text in the open panel).

| Key | Kind | Default | What it does |
| --- | --- | --- | --- |
| `family` | text | `System` | The font family, by the name Font Book shows. `System` is the system font. |
| `fallbacks` | list of text | none | Tried in order when `family` is not on the Mac, then the system font. Name fonts every Mac has, such as `Avenir Next` or `Helvetica Neue`. |
| `weight` | 100 to 900 | `400` | As in CSS: 400 is regular, 700 is bold. |
| `tracking` | number | `0` | Letter spacing in em. `0.14` is wide, `-0.02` is slightly tight. |
| `italic` | true or false | `false` | |

These families ship inside Annular, so they work on every Mac: Manrope, Instrument Serif, Newsreader, Barlow Condensed, IBM Plex Sans, and IBM Plex Mono.

## `panel`

| Key | Kind | Default | What it does |
| --- | --- | --- | --- |
| `material` | `solid`, `translucent`, `none` | `solid` | `translucent` puts the background color over a blur of what is behind it. `none` draws no panel at all: the rings float on the desktop. |
| `cornerRadius` | points | `0` | |
| `borderWidth` | points | `0` | `0` draws no outline. |
| `shadow` | true or false | `false` | |
| `padding` | points | `14` | Space between the panel's edge and the rings. |
| `accent` | `none`, `edgeStripe`, `statusBar` | `none` | `edgeStripe` is a stripe in the accent color on the side that faces the middle of the screen. `statusBar` is a bar across the top in the color of the tightest limit. |
| `accentWidth` | points | `3` | |

## `ring`

| Key | Kind | Default | What it does |
| --- | --- | --- | --- |
| `diameterRatio` | number | `1` | The ring's diameter, as a fraction of the widget size's own ring diameter. `0.875` is a little smaller. |
| `strokeRatio` | number | `0.1` | How thick the filled arc is, as a fraction of the diameter. |
| `trackStrokeRatio` | number | same as `strokeRatio` | How thick the unfilled track is. Smaller than `strokeRatio` gives a hairline track under a bold arc. |
| `cap` | `round`, `butt` | `butt` | The shape of the arc's ends. |
| `segments` | whole number | `0` | `0` is one solid arc. `30` cuts the ring into 30 pieces, like a gauge. |
| `segmentGapRatio` | 0 to 0.9 | `0.25` | The gap between segments, as a fraction of one segment's pitch. |
| `glow` | true or false | `false` | A soft glow behind the arc, in the arc's color. |
| `tick` | true or false | `false` | A dot at the end of the arc. |
| `numberPlacement` | `inside`, `below`, `none` | `inside` | Where the percent goes. |
| `numberColor` | `label`, `state` | `label` | `state` colors the number like its ring. |
| `percentSign` | true or false | `false` | `62%` instead of `62`. |
| `numberScale` | 0.1 to 0.6 | `0.28` | The number's size, as a fraction of the diameter. |

## `labels`

| Key | Kind | Default | What it does |
| --- | --- | --- | --- |
| `style` | `short`, `word` | `word` | `5H` and `7D`, or `Session` and `Week`. |
| `placement` | `below`, `inside`, `none` | `below` | |
| `uppercase` | true or false | `true` | |
| `suffix` | text | empty | A glyph after a short label, such as `.` |
| `scale` | 0.08 to 0.4 | `0.16` | The label's size, as a fraction of the diameter. |

## `states`

| Key | Kind | Default | What it does |
| --- | --- | --- | --- |
| `staleOpacity` | 0.1 to 1 | `0.6` | How faded the rings are while the numbers are old. |
| `placeholder` | text | `--` | Shown in place of a number that is not known yet. |

## `expanded`

The panel that opens on a click, with a bar, a reset time, and a forecast for each limit.

| Key | Kind | Default | What it does |
| --- | --- | --- | --- |
| `width` | 240 to 900 points | `440` | |
| `barHeight` | 1 to 32 points | `8` | |
| `barCornerRadius` | points | `4` | |
| `rowSpacing` | points | `14` | The gap between limits. |
| `uppercase` | true or false | `true` | For the header, the labels, and the captions. |
| `headerGlyph` | text | `§` | A glyph before the provider's name, in the accent color. Empty for none. |
| `showHeader` | true or false | `true` | |
| `showForecast` | true or false | `true` | The line that says when a limit will be reached at the current pace. |
| `showFooter` | true or false | `true` | |
| `dividers` | true or false | `true` | Hairlines between limits. |
| `sparkline` | `line`, `area`, `none` | `line` | The small history chart in each row. |
| `percentScale` | 0.2 to 1 | `0.56` | The large percent's size, as a fraction of the ring diameter. |
| `labelScale` | 0.1 to 0.4 | `0.19` | |
| `captionScale` | 0.1 to 0.4 | `0.165` | |
| `material` | `solid`, `translucent`, `none` | the panel's | A surface for the open panel that differs from the compact one. |
| `background` | color | the palette's | A fill for the open panel that differs from the compact one. |

## `menuBar`

| Key | Kind | Default | What it does |
| --- | --- | --- | --- |
| `style` | `percent`, `ring`, `both` | `both` | The tightest limit as a colored number, as a small ring, or both. |
| `percentSign` | true or false | `true` | |

## `keepAwake`

The small mark above the rings that shows, and switches, whether Annular keeps the Mac awake.
Idle it is an outline in the muted color; on, it fills with the accent color.

| Key | Kind | Default | What it does |
| --- | --- | --- | --- |
| `visible` | true or false | `true` | |
| `shape` | `square`, `rounded`, `circle` | `rounded` | |
| `size` | 6 to 24 points | `10` | |

## Older and newer formats

Annular reads themes written for formats 1 to 3 and saves them as format 4.
A theme from a newer format than the app knows still loads, with a note in the app, and keys the app does not know at the top level survive an export unchanged.

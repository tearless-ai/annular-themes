# Sharing a theme

Thank you for making one.

## What to add

1. Your theme, as `themes/community/your-theme.annulartheme`.
   Export it from Annular (Settings, Appearance, Export), or write it by hand from [FORMAT.md](FORMAT.md).
2. A picture of it, as `img/community/your-theme.png`, with the same name as the theme file.
   A screenshot of the corner rings is right. Crop it close, and keep it under 500 KB.

## The rules

- The file name is lower case words joined by hyphens, like `night-shift.annulartheme`.
- `id` is yours alone. A reverse domain works well: `com.yourname.night-shift`.
  Ids that start with `app.annular.` belong to the built-in themes.
- `name` and `author` are filled in. `author` can be a name or a handle; it is shown in the app.
- Ring colors mean something in Annular: `normal`, `warning`, and `critical` must stay easy to tell apart, also for people who do not see red and green well.
- Fonts: name any font you like, and give `fallbacks` that every Mac has, because most people will not have yours.
  Do not add font files to this repo.
- No logos, brand names, or artwork that belongs to somebody else.
- One theme per pull request.

## The check

Every pull request runs `node tools/validate.mjs`. You can run it yourself; it needs Node 20 or newer and no packages.
It is stricter than the app on purpose. Annular ignores a key it does not know, so a typo would do nothing, silently. Here it is an error.

## License

By opening a pull request you agree that your theme and its picture are shared under this repo's [license](LICENSE).

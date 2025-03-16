# `<script-ts>`
A web component to be able to use typescript in simple web pages.

After seeing the announcement for 
[--eraseableSyntaxOnly in typescript 5.8](https://devblogs.microsoft.com/typescript/announcing-typescript-5-8/#the---erasablesyntaxonly-option)
it gave me the idea that maybe node should not be the only one capable of such
feats.

**"roadmap"**
- [x] use [ts-blank-space](https://github.com/bloomberg/ts-blank-space) to
      replace types with whitespace
- [ ] pass attributes to the underlying script tag
- [ ] reduce bundle size
- [ ] figure out distribution
- [ ] syntax highlighting on github pages

## Usage
Load the web component by grabbing the bundle and use `<script-ts>` just like 
the regular `<script>` tag.

```html
<script src="https://petii.github.io/script-ts/script-ts.min.js"></script>
...
<script-ts>
  // while inlining typescript technically works there's not a lot of support for it
  const foo: string = 'bar';
</script-ts>
<!-- loading files directly means that development can be easier -->
<script-ts src="you-script.ts"></script-ts>
```

> [!CAUTION]
> To get tsc to play along nicely, the component removes (comments out) `import` statements which could have unintended side effects.

`<script-ts>` can emit log messages if the `script-ts-log=enable` query param is set.

## Development
~~Unfortunately it's not as easy as loading up the file but serving it locally should work: `npx serve --cors`~~

# `<script-ts>`
A web component to be able to use typescript in simple web pages.

After seeing the announcement for [--eraseableSyntaxOnly in typescript 5.8](https://devblogs.microsoft.com/typescript/announcing-typescript-5-8/#the---erasablesyntaxonly-option) it gave me the idea that maybe node should not be the only one capable of such feats.

**Current features:**
- [x] uses [ts-blank-space](https://github.com/bloomberg/ts-blank-space) to replace types with whitespace
- [ ] pass attributes to the underlying script tag
- [ ] figure out distribution + licensing
- [ ] reduce bundle size

## Usage
Load the web component and use `<script-ts>` just like you would the regular `<script>` tag.

```html
<script src="https://cdn.jsdelivr.net/gh/petii/script-ts/script-ts.min.js"></script>
...
<script-ts>
  // while inlining typescript technically works there's not a lot of support for it
  // in IDEs or syntax highlight
  const foo: string = 'bar';
</script-ts>
<!-- loading files however could help with development -->
<script-ts src="you-script.ts"></script-ts>
```

> [!CAUTION]
> To get typescript to play along nicely the component removes (comments out) `import` statements which could have unintended side effects.

## Development
~~Unfortunately it's not as easy as loading up the file but serving it locally should work: `npx serve --cors`~~

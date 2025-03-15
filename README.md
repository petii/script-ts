# `<script-ts>`
A web component to be able to use typescript in simple web pages.

After seeing the announcement for [--eraseableSyntaxOnly in typescript 5.8](https://devblogs.microsoft.com/typescript/announcing-typescript-5-8/#the---erasablesyntaxonly-option) it gave me the idea that maybe node should not be the only one capable of such feats.

**Current features:**
- [x] remove `//` comments
- [x] remove some types after `:`
- [ ] remove type casts
- [ ] ... and everything else related to erasing syntax
- [ ] pass attributes to the underlying script tag

## Usage
Load the web component to your file and use `<script-ts>` just like you would the regular `<script>` tag.

```html
<script src="https://cdn.jsdelivr.net/gh/petii/script-ts@master/script-ts.js"></script>
```

## Development
Unfortunately it's not as easy as loading up the file but serving it locally should work:

```shell
npx serve --cors
```

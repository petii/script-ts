function eraseSyntax(contents) {
  let lines = contents.split(/;|\n/).map(l => l.trim()).filter(l => l.length > 0);
  lines = lines.map(l => {
    l = l.replace(/\/\/.*$/, '');
    return l.replaceAll(/:[ a-z0-9]+/gi, '')
  })
  return lines.join(';');
}

console.log([JSON.stringify(location), location.toString(), location.hostname, location.port])

class ScriptTsStandalone extends HTMLElement {
  constructor() {
    super();

    this.reader = new FileReader();
    this.reader.onload = () => {
      this.log('reader', this.reader, this.reader.result);
    }
  }

  log(...args) {
    const maybeId = this.attributes.getNamedItem('id')?.value
    console.debug(`[ScriptTsStandalone${maybeId ? `#${maybeId}` : ''}]`, ...args);
  }

  connectedCallback() {
    // console.log("Custom element added to page.", this, this.attributes);
    setTimeout(() => {
      if (this.parentElement != document.body) {
        throw new Error(`<script-ts> wrapped in ${this.parentElement}`);
      } else if (this.children.length > 0) {
        throw new Error(`<script-ts> has children`);
      }
      this.style = `display: none;`;

      const maybeSrc = this.attributes.getNamedItem('src');
      if (maybeSrc != null) {
        this.log('src', maybeSrc.value)
        fetch(`${maybeSrc.value}`).then(response => response.text())
          .then((data) => {
            const actualScript = document.createElement('script');
            actualScript.innerText = eraseSyntax(data);
            this.log(
              actualScript.innerText
            );;
            document.body.appendChild(actualScript);
          });
        return;
      }

      const actualScript = document.createElement('script');
      actualScript.innerText = eraseSyntax(this.firstChild.data);
      this.log(
        'actualScript = ', actualScript.innerText
      );;
      document.body.appendChild(actualScript);
    });
  }

  disconnectedCallback() {
    console.log("Custom element removed from page.");
  }

  adoptedCallback() {
    console.log("Custom element moved to new page.");
  }

  attributeChangedCallback(name, oldValue, newValue) {
    console.log(`Attribute ${name} has changed.`);
  }
}

customElements.define("script-ts", ScriptTsStandalone);
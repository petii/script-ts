function eraseSyntax(contents) {
  let lines = contents.split(/;|\n/).map(l => l.trim());
  lines = lines.map(l => {
    l = l.replace(/\/\/.*$/, '');
    return l.replaceAll(/:[ a-z0-9<>\[\]]+/gi, '')
  })
  return `${lines.filter(l => l.length > 0).join(';')};`;
}

class ScriptTsStandalone extends HTMLElement {
  constructor() {
    super();
    this.shouldProcess = false;
  }

  log(...args) {
    const maybeId = this.attributes.getNamedItem('id')?.value
    console.debug(`[ScriptTsStandalone${maybeId ? `#${maybeId}` : ''}]`, ...args);
  }

  connectedCallback() {
    setTimeout(() => {
      if (this.parentElement != document.body) {
        throw new Error(`<script-ts> wrapped in ${this.parentElement}`);
      } else if (this.children.length > 0) {
        throw new Error(`<script-ts> has children`);
      }
      this.style = `display: none;`;
      this.shouldProcess = true;
    });

    const maybeSrc = this.attributes.getNamedItem('src');
    if (maybeSrc != null) {
      this.log('src =', maybeSrc.value)
      fetch(`${maybeSrc.value}`).then(response => response.text())
        .then((data) => {
          const actualScript = document.createElement('script');
          actualScript.text = eraseSyntax(data);
          this.log({originalScript : data, actualScript: actualScript.text});
          document.body.appendChild(actualScript);
        });
      return;
    } else {
      setTimeout(()=>{
        if (!this.shouldProcess) return;
        const actualScript = document.createElement('script');
        actualScript.text = this.firstChild && eraseSyntax(this.firstChild.data);
        this.log({originalScript : this.firstChild.data, actualScript: actualScript.text});
        document.body.appendChild(actualScript);
      });
    }
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
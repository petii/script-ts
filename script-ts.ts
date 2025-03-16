import tsBlankSpace from "ts-blank-space";

function setTimeoutAsync(ms?: Parameters<typeof setTimeout>[1]) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

class ScriptTs extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.extractSource().then((source) => {
      const actualScript = document.createElement("script");
      actualScript.text = tsBlankSpace(source);
      this.textContent = "";
      this.appendChild(actualScript);
    });
  }

  async extractSource() {
    const maybeSrc = this.attributes.getNamedItem("src");
    if (maybeSrc != null) {
      return (await fetch(`${maybeSrc.value}`)).text();
    } else {
      await setTimeoutAsync();
      return this.firstChild?.textContent ?? "";
    }
  }
}

customElements.define("script-ts", ScriptTs);

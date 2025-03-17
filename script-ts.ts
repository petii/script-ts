import tsBlankSpace from "ts-blank-space";

function setTimeoutAsync(ms?: Parameters<typeof setTimeout>[1]) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export class ScriptTs extends HTMLElement {
  static observedAttributes: string[] = ["src"];

  public originalSource: string;
  public actualScript: HTMLScriptElement;

  constructor() {
    super();
  }

  log(
    level: Extract<
      keyof typeof console,
      "log" | "debug" | "error" | "trace" | "warn" | "info"
    >,
    ...args: unknown[]
  ) {
    // silence console messages unless explicitly asked for
    if (!location.search?.includes("script-ts-log=enable")) {
      return;
    }

    const maybeId = this.attributes.getNamedItem("id")?.value;
    const maybeSrc = this.attributes.getNamedItem("src")?.value;
    const logDecorator =
      maybeId != null ? `#${maybeId}` : maybeSrc != null ? `@${maybeSrc}` : "";

    console[level](`[ScriptTs${logDecorator}]`, ...args);
  }

  removeImports = ScriptTs.removeImports;
  removeTypes = ScriptTs.removeTypes;

  hasSrc() {
    return this.attributes.getNamedItem("src") != null;
  }

  connectedCallback() {
    this.log("debug", "connectedCallback");
    // at this point we know the src attribute but the attributeChangedCallback will also fire
    this.hasSrc() ||
      this.extractSource().then((source) => {
        this.updateScript(source);
      });
  }

  attributeChangedCallback(name: string, oldValue: unknown, newValue: unknown) {
    this.log("debug", `attribute = ${name}`, `${oldValue} -> ${newValue}`);
    switch (name) {
      case "src":
        this.extractSource().then((source) => {
          this.updateScript(source);
        });
        break;
      default:
        this.log("warn", `change to attribute "${name}" not handled`)
    }
  }

  async extractSource() {
    const maybeSrc = this.attributes.getNamedItem("src");
    if (maybeSrc != null) {
      this.originalSource = await (await fetch(`${maybeSrc.value}`)).text();
    } else {
      await setTimeoutAsync();
      this.originalSource = this.firstChild?.textContent ?? "";
    }
    return this.originalSource;
  }

  static removeImports(source: string) {
    return source
      .replaceAll("import", "// import")
      .replaceAll("export", "/* export */");
  }

  static removeTypes(source: string) {
    return tsBlankSpace(source);
  }

  updateScript(source: string) {
    try {
      if (this.actualScript != null) {
        this.removeChild(this.actualScript);
      }
      this.textContent = "";

      source = ScriptTs.removeImports(source);
      source = ScriptTs.removeTypes(source);
      this.log("debug", "updateScript ", `source = ${source}`);

      this.actualScript = document.createElement("script");
      this.actualScript.text = source;
      this.appendChild(this.actualScript);
    } catch (e) {
      this.log("error", "updateScript", e);
      throw e;
    }
  }
}

customElements.define("script-ts", ScriptTs);

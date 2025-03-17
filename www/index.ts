import m from "mithril";

import { type ScriptTs } from "../script-ts";

// styled components
export const code_fullwidth = `code[style=width:100%]`;
export const p_justify = `p[style=text-align:justify]`;

const scriptTs = customElements.get("script-ts") as unknown as ScriptTs;

function scriptTsDisplay(source: string): string {
  return `<script>
${scriptTs.removeTypes(scriptTs.removeImports(source))}
</script>`;
}

function wrapInScope(source: string): string {
  return `try {
${source}
} catch {}`;
}

const exampleCode = `const outputElement: HTMLElement = document.querySelector('#output');
outputElement.innerText = ' should add this ↓ component to the DOM';`;

function componentDisplay(source: string) {
  return m("pre", m(code_fullwidth, scriptTsDisplay(source)));
}

function truncateLines(text: string, startOrEnd: number, maybeEnd?: number) {
  const lines = text.split("\n");

  if (maybeEnd == null) {
    maybeEnd = Math.min(startOrEnd, lines.length);
    startOrEnd = 0;
  } else {
    maybeEnd = Math.min(maybeEnd, lines.length);
  }
  let startElision = startOrEnd > 0 ? ["..."] : [];
  let endElision = maybeEnd < lines.length ? ["..."] : [];

  return [
    ...startElision,
    ...lines.slice(startOrEnd, maybeEnd),
    ...endElision,
  ].join("\n");
}

const header = m(
  "header",
  m("hgroup", [
    m("h1", m(code_fullwidth, "<script-ts>")),
    m(
      p_justify,
      `Have you ever found yourself needing to put together a simple webpage
          but never really put in the effort to become somewhat capable in javascript?
          No? Nevertheless, using typescript without all the hassle of 
          compiling, bundling etc. should not be a node exclusive.`,
    ),
  ]),
);

const content = m("main", [
  m("section[id=site]", [
    m("hgroup", [
      m("h3", m("code", "but why?")),
      m(p_justify, [
        `Because as good as javascript tooling is`,
        m("sup[style=font-style:italic]", "[citation needed]"),
        ` I do prefer working with the help of typescript. This page is
        an example as it's an SPA written with `,
        m("a[href=https://mithril.js.org]", "mithril.js"),
        ` plus types!`,
      ]),
    ]),

    m("details", [
      m("summary", "source(s)"),
      m(
        "div",
        {
          style: {
            display: "flex",
            flexDirection: "row",
            gap: "var(--pico-spacing)",
          },
        },
        [
          m("pre", { style: { flexBasis: 0, flexGrow: 1 } }, [
            ".ts",
            m(
              "code",
              truncateLines(
                (document.querySelector("#app-src") as ScriptTs).originalSource,
                30,
              ),
            ),
          ]),
          m("pre", { style: { flexBasis: 0, flexGrow: 1 } }, [
            ".js",
            m(
              "code",
              truncateLines(
                (document.querySelector("#app-src") as ScriptTs).actualScript
                  .text,
                30,
              ),
            ),
          ]),
        ],
      ),
    ]),
  ]),
  m("section[id=demo]", [
    m("h3", m("label[for=sandbox]", m("code", "try it out"))),
    m(
      "textarea",
      {
        style: {
          fontFamily: "monospace",
          fontSize: "var(--pico-font-size)",
          color: "var(--pico-code-color)",
        },
        spellCheck: false,
        id: "sandbox",
        rows: 3,
        oninput: (node: Event) => {
          const textAreaContent =
            (node.target as HTMLTextAreaElement).value?.toString() ?? "";

          m.render(
            document.getElementById("results"),
            componentDisplay(textAreaContent),
          );

          (document.getElementById("result-script") as ScriptTs).updateScript(
            wrapInScope(textAreaContent),
          );
        },
      },
      exampleCode,
    ),
    m("details[open]", [
      m("summary", [m("code", "#output"), m("span[id=output]", "")]),
      m("div[id=results]", componentDisplay(exampleCode)),
      m("script-ts[id=result-script]", wrapInScope(exampleCode)),
    ]),
  ]),
]);

const footer = m("footer", m("h1", m(code_fullwidth, "</script-ts>")));

m.render(document.getElementById("app"), [header, content, footer]);

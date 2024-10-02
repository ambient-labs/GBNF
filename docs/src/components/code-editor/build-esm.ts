export function esm(templateStrings: TemplateStringsArray, ...substitutions: string[]) {
  let js = templateStrings.raw[0];
  for (let i = 0; i < substitutions.length; i++) {
    js += substitutions[i] + templateStrings.raw[i + 1];
  }
  return URL.createObjectURL(new Blob([js], { type: 'text/javascript' }));
}

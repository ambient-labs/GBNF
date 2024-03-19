export const getStringValue = (value: string, caseKind: 'lower' | 'upper' | 'any' | 'default') => {
  if (value === '') {
    return '';
  }
  const strings = ['"',];
  let i = 0;

  while (i < value.length) {
    if (value[i] === '\n') {
      strings[strings.length - 1] += '\\n';
    } else {
      if (/[a-zA-Z]/.test(value[i])) {
        if (caseKind === 'default') {
          strings[strings.length - 1] += value[i];
        } else if (caseKind === 'lower') {
          strings[strings.length - 1] += value[i].toLowerCase();
        } else if (caseKind === 'upper') {
          strings[strings.length - 1] += value[i].toUpperCase();
        } else if (caseKind === 'any') {
          const char = value[i];
          strings[strings.length - 1] += `"`;
          strings.push(`[${char.toLowerCase()}${char.toUpperCase()}]`);
          strings.push('"');
        }
      } else {
        strings[strings.length - 1] += value[i];
      }
    }
    i += 1;
  }
  strings[strings.length - 1] += '"';
  return strings.filter(str => {
    return str && str !== '"' && str !== '""';
  }).join(' ');
};

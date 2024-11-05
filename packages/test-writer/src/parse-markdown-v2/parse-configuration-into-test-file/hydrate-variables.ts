export const hydrateVariables = (lines: string | string[], variables: Record<string, unknown>): string[] => {
  return ([] as string[]).concat(lines).map((line) => {
    const regex = /\$(\w+)/g;
    return line.replace(regex, (match, variable) => {
      if (!(variable in variables)) {
        throw new Error(`No variable found for ${variable}`);
      }
      if (typeof variables[variable] === 'string') {
        return variables[variable];
      }
      if (typeof variables[variable] === 'boolean') {
        return variables[variable] ? 'true' : 'false';
      }
      if (variables[variable] === null) {
        return 'null';
      }
      if (variables[variable] === undefined) {
        return 'undefined';
      }
      if (typeof variables[variable] === 'number') {
        return variables[variable].toString();
      }
      if (Array.isArray(variables[variable])) {
        return JSON.stringify(variables[variable]);
      }
      if (typeof variables[variable] === 'object') {
        return JSON.stringify(variables[variable]);
      }
      throw new Error(`Variable ${variable} is not a string, it is ${typeof variables[variable]}`);
    });
  });
};

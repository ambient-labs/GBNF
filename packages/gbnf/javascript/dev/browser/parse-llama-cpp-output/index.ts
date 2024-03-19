const parseLlamaCPPOutput = (output) => output.split('\n').filter(Boolean).map(line => line.substring(9)).reduce((acc, line) => {
  const parts = line.split(' ');
  const stackId = parts.shift();
  if (!acc[stackId]) {
    acc[stackId] = [];
  }
  const type = parts.pop().split('LLAMA_GRETYPE_').pop();
  if (parts.length === 0 || type === 'END' || type === 'ALT') {
    acc[stackId].push({
      type,
    });
  } else if (type === 'CHAR' || type === 'CHAR_NOT') {
    acc[stackId].push({
      type,
      value: [parseInt(parts.pop(), 10)],
    });
  } else {
    acc[stackId].push({
      type,
      value: parseInt(parts.pop(), 10),
    });
  }

  return acc;
}, []);



parseLlamaCPPOutput(
  `

`)

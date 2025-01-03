```python
import pytest
from gbnf import GBNF
```

```javascript
import { describe, test, expect } from 'vitest';
import GBNF from 'gbnf';
```

# Grammars 

```javascript
const foo = 'FOO';
```

```python
foo = 'FOO'
```

## Describe block level 2

<!-- specify the language to parse it that way. Could be JSON, could be python, could be whatever -->

const cases = ["root ::= 1"];

```javascript
test.for(<%= cases =>)('Some test', ([grammar]) => {
  expect(grammar).toEqual(grammar);
});
```

```python
@pytest.mark.parameterize(("grammar"), <%= cases %>)
def foo_test(grammar):
  assert grammar == grammar
```

```json $cases2 
["root ::= 1"]
```
```python $cases2
["""root ::= 1"""]
```

```javascript
test.for(<%= cases2 =>)('Some test', ([grammar]) => {
  expect(grammar).toEqual(grammar);
});
```

```python
@pytest.mark.parameterize(("grammar"), <%= cases2 %>)
def foo_test(grammar):
  assert grammar == grammar
```

### Describe block level 3

```javascript
test('Some other test', () => {
  expect(1).toEqual(1);
});
```

```python
def some_test():
  assert 1 == 1
```


import { GenericSet } from './generic-set.js';
describe('GenericSet', () => {
  test('it instantiates', () => {
    expect(new GenericSet(() => 'foo')).toBeInstanceOf(GenericSet);
  });

  test('it iterates', () => {
    const set = new GenericSet((el) => el);
    set.add(1);
    set.add(2);
    set.add(3);
    expect([...set]).toEqual([1, 2, 3]);
  });

  test('it skips duplicates', () => {
    const set = new GenericSet((el) => el);
    set.add(1);
    set.add(1);
    set.add(1);
    expect([...set]).toEqual([1]);
  });

  test('it skips duplicates, based on a given key', () => {
    const set = new GenericSet<any, number>((el: { id: number }) => el.id);
    set.add({ id: 1 });
    set.add({ id: 1, foo: 'foo' });
    set.add({ id: 1, bar: 'bar' });
    expect([...set]).toEqual([{ id: 1 }]);
  });

  test('can delete', () => {
    const set = new GenericSet<any, number>((el: { id: number }) => el.id);
    set.add({ id: 1 });
    set.delete({ id: 1 });
    set.add({ id: 2, foo: 'foo' });
    set.add({ id: 2, bar: 'bar' });
    expect([...set]).toEqual([{ id: 2, foo: 'foo' }]);
  });
});

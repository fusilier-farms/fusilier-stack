import { capitalize } from "~/utils/capitalize";

test('should capitalize', () => {
  expect(capitalize('foobar')).toMatch('Foobar');
});

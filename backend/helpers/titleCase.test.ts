import { titleCase } from '../helpers/titleCase';

describe('titleCase', () => {
	it('should convert lowercase name to title case', () => {
		const result = titleCase('frodo baggins');
		expect(result).toEqual('Frodo Baggins');
	});

	it('should handle mixed case input', () => {
		const result = titleCase('FRODO baggins');
		expect(result).toEqual('Frodo Baggins');
	});

	it('should handle single word', () => {
		const result = titleCase('frodo');
		expect(result).toEqual('Frodo');
	});

	it('should handle multiple spaces between words', () => {
		const result = titleCase('frodo  baggins');
		expect(result).toEqual('Frodo  Baggins');
	});
});

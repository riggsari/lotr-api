import { slugify } from '../helpers/slugify';

describe('slugify', () => {
	it('should convert name to slug format with lowercase and hyphens', () => {
		const result = slugify('Frodo Baggins');
		expect(result).toEqual('frodo-baggins');
	});
});

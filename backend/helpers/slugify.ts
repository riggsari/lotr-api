/**
 * Converts a name string to a slug format
 * - Converts to lowercase
 * - Replaces spaces with hyphens
 * - Strips accents from characters
 * @param name - The name string to slugify
 * @returns The slugified name
 */
export function slugify(name: string): string {
	return name
		.toLowerCase()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/\s+/g, '-');
}

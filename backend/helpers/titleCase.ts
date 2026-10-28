/**
 * Converts a name string to title case format
 * - Capitalizes the first letter of each word
 * - Converts the rest to lowercase
 * @param name - The name string to convert to title case
 * @returns The title cased name
 */
export function titleCase(name: string): string {
	return name
		.split(' ')
		.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
		.join(' ');
}

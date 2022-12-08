export default function extractHostname(url: string): string {
	const urlObject = new URL(url);
	return urlObject.hostname;
}

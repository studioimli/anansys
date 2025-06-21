import "@tanstack/react-router"; // Import type definitions from the tanstack router library

declare module "@tanstack/react-router" {
	interface RouteMeta {
		title: string;
	}
} 
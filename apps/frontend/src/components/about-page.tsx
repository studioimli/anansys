import { Title } from "@mantine/core";
import { Route } from "../routes/about";

export function AboutPage() {
	const { title } = Route.useMeta();
	return (
		<div>
			<Title order={1}>{title}</Title>
			<p>This is the about page.</p>
		</div>
	);
} 
import { Title } from "@mantine/core";
import { Route } from "../routes/settings";

export function SettingsPage() {
	const { title } = Route.useMeta();
	return (
		<div>
			<Title order={1}>{title}</Title>
			<p>This is the settings page.</p>
		</div>
	);
} 
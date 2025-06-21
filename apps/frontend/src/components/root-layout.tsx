import { Link, Outlet, useRouter } from "@tanstack/react-router";
import { MantineProvider, AppShell, Burger, Group } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

import "@mantine/core/styles.css";

export function RootLayout() {
	const [opened, { toggle }] = useDisclosure();
	const router = useRouter();
	const routes = Object.values(router.routeTree.children ?? {});


	return (
		<MantineProvider>
			<AppShell
				header={{ height: 60 }}
				navbar={{ width: 300, breakpoint: "sm", collapsed: { mobile: !opened } }}
				padding="md"
			>
				<AppShell.Header>
					<Group h="100%" px="md">
						<Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
						Anansys
					</Group>
				</AppShell.Header>
				<AppShell.Navbar p="md">
					{routes.map((route) => {
						if (!route.options.meta?.title) return null;

						return (
							<Link key={route.id} to={route.path} className="[&.active]:font-bold">
								{route.options.meta.title}
							</Link>
						);
					})}
				</AppShell.Navbar>
				<AppShell.Main>
					<Outlet />
				</AppShell.Main>
			</AppShell>
		</MantineProvider>
	);
} 
import { Box } from '@chakra-ui/react';
import { Search } from 'lucide-react';

import { MonthNavigator } from '@/components/MonthNavigator';
import { Sidebar } from '@/components/Sidebar';
import { Button } from '@/components/ui/button';

export function Topbar() {
	return (
		<Box as="header" py={4}>
			<nav>
				<Box as="ul" listStyle="none" display="flex">
					<li>
						<Sidebar />
					</li>
					<li>
						<MonthNavigator />
					</li>
					<li style={{ marginLeft: 'auto' }}>
						<Button variant="ghost">
							<Search />
						</Button>
					</li>
				</Box>
			</nav>
		</Box>
	);
}

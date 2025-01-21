import { Box } from '@chakra-ui/react';
import { Menu, Search } from 'lucide-react';

import { Button } from '@/components/ui/button';

type TopbarProps = {
	onOpen: () => void;
};

export function Topbar({ onOpen }: TopbarProps) {
	return (
		<header>
			<nav>
				<Box as="ul" listStyle="none" display="flex">
					<li>
						<Button variant="ghost" onClick={onOpen}>
							<Menu />
						</Button>
					</li>
					<li style={{ marginLeft: 'auto' }}>
						<Button variant="ghost">
							<Search />
						</Button>
					</li>
				</Box>
			</nav>
		</header>
	);
}

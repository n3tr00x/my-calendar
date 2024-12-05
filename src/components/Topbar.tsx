import { HamburgerIcon, SearchIcon } from '@chakra-ui/icons';
import { Button, List, ListItem } from '@chakra-ui/react';

type TopbarProps = {
	onOpen: () => void;
};

export function Topbar({ onOpen }: TopbarProps) {
	return (
		<nav>
			<List display="flex">
				<ListItem>
					<Button variant="ghost" onClick={onOpen}>
						<HamburgerIcon />
					</Button>
				</ListItem>
				<ListItem ml="auto">
					<Button variant="ghost">
						<SearchIcon />
					</Button>
				</ListItem>
			</List>
		</nav>
	);
}

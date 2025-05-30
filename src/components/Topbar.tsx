import { Box, Heading, Image, List } from '@chakra-ui/react';

import logo from '@/assets/logo.png';
import { EventSearchDesktopPopover } from '@/components/EventSearchDesktopPopover';
import { EventSearchMobilePopover } from '@/components/EventSearchMobilePopover';
import { MonthNavigator } from '@/components/MonthNavigator';
import { Sidebar } from '@/components/Sidebar';
import { Button } from '@/components/ui/button';
import { useUpdateSelectedDate } from '@/store/date';

export function Topbar() {
	const today = new Date();
	const updateSelectedDate = useUpdateSelectedDate();

	return (
		<Box as="header" p={{ base: 4, lg: 6 }}>
			<List.Root
				listStyle="none"
				display="flex"
				alignItems="center"
				flexDirection="row"
				gap={{ lg: 4 }}
			>
				<List.Item>
					<Sidebar />
				</List.Item>
				<List.Item display={{ base: 'none', lg: 'flex' }} gap={2} alignItems="center">
					<Image src={logo} alt="logo" w={10} aspectRatio="square" />
					<Heading size="2xl">My Calendar</Heading>
				</List.Item>
				<List.Item>
					<MonthNavigator />
				</List.Item>
				<List.Item display="flex" ml="auto" gap={1}>
					<EventSearchMobilePopover />
					<EventSearchDesktopPopover />
					<Button
						variant="outline"
						size={{ base: 'xs', lg: 'md' }}
						rounded="sm"
						aspectRatio="square"
						onClick={() => updateSelectedDate(today)}
					>
						<Box>{today.getDate()}</Box>
					</Button>
				</List.Item>
			</List.Root>
		</Box>
	);
}

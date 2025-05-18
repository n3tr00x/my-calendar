import { Box, Flex, List } from '@chakra-ui/react';

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
			<List.Root listStyle="none" display="flex" justifyContent="space-between" flexDirection="row">
				<Flex>
					<List.Item>
						<Sidebar />
					</List.Item>
					<List.Item>
						<MonthNavigator />
					</List.Item>
				</Flex>
				<Flex gap={1}>
					<List.Item>
						<EventSearchMobilePopover />
						<EventSearchDesktopPopover />
					</List.Item>
					<List.Item marginLeft="auto" alignSelf="center">
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
				</Flex>
			</List.Root>
		</Box>
	);
}

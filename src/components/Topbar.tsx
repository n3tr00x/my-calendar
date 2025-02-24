import { Box, Flex } from '@chakra-ui/react';
import { Search } from 'lucide-react';

import { EventSearchPopover } from '@/components/EventSearchPopover';
import { MonthNavigator } from '@/components/MonthNavigator';
import { Sidebar } from '@/components/Sidebar';
import { Button } from '@/components/ui/button';
import { useUpdateSelectedDate } from '@/store/date';

export function Topbar() {
	const today = new Date();
	const updateSelectedDate = useUpdateSelectedDate();

	return (
		<Box as="header" p={4}>
			<nav>
				<Box as="ul" listStyle="none" display="flex" justifyContent="space-between">
					<Flex>
						<li>
							<Sidebar />
						</li>
						<li>
							<MonthNavigator />
						</li>
					</Flex>
					<Flex gap={1}>
						<li>
							<EventSearchPopover
								popoverTriggerComponent={
									<Button variant="ghost" size="xs" aspectRatio="square">
										<Search />
									</Button>
								}
							/>
						</li>
						<li style={{ marginLeft: 'auto' }}>
							<Button
								variant="outline"
								size="xs"
								rounded="sm"
								onClick={() => updateSelectedDate(today)}
							>
								<Box>{today.getDate()}</Box>
							</Button>
						</li>
					</Flex>
				</Box>
			</nav>
		</Box>
	);
}

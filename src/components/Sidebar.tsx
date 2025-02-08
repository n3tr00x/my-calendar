import { useNavigate } from 'react-router-dom';
import { Box, Flex, Image, Text } from '@chakra-ui/react';
import { LogOut, Menu, Plus } from 'lucide-react';

import logo from '@/assets/logo.png';
import { NewEventModal } from '@/components/NewEvent';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ColorModeButton } from '@/components/ui/color-mode';
import {
	DrawerBackdrop,
	DrawerBody,
	DrawerCloseTrigger,
	DrawerContent,
	DrawerFooter,
	DrawerHeader,
	DrawerRoot,
	DrawerTrigger,
} from '@/components/ui/drawer';
import { useSignOutAccount } from '@/hooks/appwrite';
import { useAuth } from '@/hooks/useAuth';

export function Sidebar() {
	const { user, removeAuthentication } = useAuth();
	const { mutateAsync: signOut } = useSignOutAccount();
	const navigate = useNavigate();

	const signOutHandler = async () => {
		const proceed = window.confirm('Are you sure you want to log out?');

		if (proceed) {
			await signOut();
			removeAuthentication();
			navigate('/sign-in', { replace: true });
		}
	};

	return (
		<DrawerRoot placement="start">
			<DrawerBackdrop />
			<DrawerTrigger asChild>
				<Button size="xs" variant="ghost">
					<Menu />
				</Button>
			</DrawerTrigger>
			<DrawerContent>
				<DrawerCloseTrigger />
				<DrawerHeader fontFamily="heading" fontSize="lg">
					<Flex alignItems="center" gap={2}>
						<Image src={logo} alt="logo" width="32px" aspectRatio="square" />
						My Calendar
					</Flex>
				</DrawerHeader>
				<DrawerBody>
					<NewEventModal
						dialogTriggerComponent={
							<Button variant="outline" colorPalette="blue" w="full" justifyContent="flex-start">
								<Plus /> Add event
							</Button>
						}
					/>
				</DrawerBody>
				<DrawerFooter justifyContent="space-between">
					<Box p={1}>
						<Flex>
							<Avatar name={user?.name} />
							<Text alignSelf="center" ml="8px">
								{user?.name}
							</Text>
						</Flex>
					</Box>
					<Box>
						<ColorModeButton px={4} minH={10} />
						<Button variant="ghost" onClick={signOutHandler}>
							<LogOut />
						</Button>
					</Box>
				</DrawerFooter>
			</DrawerContent>
		</DrawerRoot>
	);
}

import { useNavigate } from 'react-router-dom';
import { Box, Flex, Input, Text } from '@chakra-ui/react';
import { LogOut } from 'lucide-react';

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
} from '@/components/ui/drawer';
import { useSignOutAccount } from '@/hooks/appwrite';
import { useAuth } from '@/hooks/useAuth';

type SidebarProps = {
	isOpen: boolean;
	onClose: () => void;
};

export function Sidebar({ isOpen, onClose }: SidebarProps) {
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
		<DrawerRoot open={isOpen} onOpenChange={onClose} placement="start">
			<DrawerBackdrop />
			<DrawerContent>
				<DrawerCloseTrigger />
				<DrawerHeader>My Calendar</DrawerHeader>
				<DrawerBody>
					<Input placeholder="Type here..." />
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

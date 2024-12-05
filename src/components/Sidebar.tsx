import { useNavigate } from 'react-router-dom';
import {
	Avatar,
	Box,
	Button,
	Drawer,
	DrawerBody,
	DrawerCloseButton,
	DrawerContent,
	DrawerFooter,
	DrawerHeader,
	DrawerOverlay,
	Flex,
	Input,
	Text,
} from '@chakra-ui/react';

import { LogoutIcon } from '@/components/icons/Logout';
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
		await signOut();
		removeAuthentication();
		navigate('/sign-in');
	};

	return (
		<Drawer placement="left" isOpen={isOpen} onClose={onClose}>
			<DrawerOverlay />
			<DrawerContent>
				<DrawerCloseButton />
				<DrawerHeader>My Calendar</DrawerHeader>
				<DrawerBody>
					<Input placeholder="Type here..." />
				</DrawerBody>
				<DrawerFooter justifyContent="space-between">
					<Box p={1}>
						<Flex>
							<Avatar src="https://bit.ly/tioluwani-kolawole" size="sm" />
							<Text alignSelf="center" ml="8px">
								{user?.name}
							</Text>
						</Flex>
					</Box>
					<Button variant="ghost" onClick={signOutHandler}>
						<LogoutIcon fill="neutral.500" />
					</Button>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
}

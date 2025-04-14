import { Link, useNavigate } from 'react-router-dom';
import { Avatar, Box, Flex, Image, Text } from '@chakra-ui/react';
import { LogOut, Menu, Plus, Search } from 'lucide-react';

import logo from '@/assets/logo.png';
import { AlertDialog } from '@/components/AlertDialog';
import { NewEventModal } from '@/components/NewEvent';
// import {  } from '@/components/ui/avatar';
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
import { toaster } from '@/components/ui/toaster';
import { useSignOutAccount } from '@/hooks/appwrite';
import { useAuth } from '@/hooks/useAuth';

export function Sidebar() {
	const { user, removeAuthentication } = useAuth();
	const { mutateAsync: signOut } = useSignOutAccount();
	const navigate = useNavigate();

	const signOutHandler = async () => {
		await signOut();
		removeAuthentication();
		navigate('/sign-in', { replace: true });

		toaster.create({
			title: 'You have been logged out successfully.',
			type: 'success',
			placement: 'bottom-end',
			duration: 4000,
		});
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
					<Flex alignItems="center" gap={2} justifyContent="center">
						<Image src={logo} alt="logo" width="32px" aspectRatio="square" />
						My Calendar
					</Flex>
				</DrawerHeader>
				<DrawerBody display="flex" flexDirection="column" gap={4}>
					<NewEventModal
						dialogTriggerComponent={
							<Button variant="outline" colorPalette="blue" w="full" justifyContent="flex-start">
								<Plus /> Add event
							</Button>
						}
					/>
					<Button variant="outline" colorPalette="blue" w="full" justifyContent="flex-start">
						<Search /> Search events
					</Button>
				</DrawerBody>
				<DrawerFooter justifyContent="space-between">
					<Box>
						<Button variant="ghost" py={6}>
							<Link to="/settings">
								<Flex gap={1}>
									<Avatar.Root>
										<Avatar.Fallback name={user?.name} />
										<Avatar.Image src={user?.avatar || ''} />
									</Avatar.Root>
									<Text alignSelf="center" ml="8px">
										{user?.name}
									</Text>
								</Flex>
							</Link>
						</Button>
					</Box>
					<Box>
						<ColorModeButton px={4} size="md" />
						<AlertDialog
							alertTriggerComponent={
								<Button variant="ghost" size="md">
									<LogOut />
								</Button>
							}
							action={signOutHandler}
							actionButtonLabel="Log out"
							title="Leaving your account"
							description="Your session will be ended. Do you want to continue?"
						/>
					</Box>
				</DrawerFooter>
			</DrawerContent>
		</DrawerRoot>
	);
}

import { useState } from 'react';
import {
	ActionBar,
	Avatar,
	Box,
	FileUploadFileChangeDetails as FileChangeDetails,
	// FileUploadRoot,
	// FileUploadTrigger,
	Flex,
	Heading,
	HStack,
	Image,
	Portal,
	Text,
} from '@chakra-ui/react';
import { ArrowUpFromLine, LogOut } from 'lucide-react';

import { LogoutAlertDialog } from '@/components/LogoutAlertDialog';
import { Button } from '@/components/ui/button';
import { FileUploadRoot, FileUploadTrigger } from '@/components/ui/file-upload';
import { toaster } from '@/components/ui/toaster';
import { useSetAvatar } from '@/hooks/appwrite';
import { useAuth } from '@/hooks/useAuth';

export function MainProfileSettings() {
	const { user, checkUserAuthStatus } = useAuth();
	const { mutateAsync: setNewAvatar } = useSetAvatar();
	const [file, setFile] = useState<File | null>(null);
	const [isActionBarOpen, setIsActionBarOpen] = useState(false);

	const updateAvatarImage = async (file: File) => {
		await setNewAvatar(file);
		await checkUserAuthStatus();
	};

	const chooseImageHandler = (details: FileChangeDetails) => {
		const file = details.acceptedFiles?.[0];

		if (!file) {
			return toaster.error({ title: 'The file is not an image!' });
		}

		setIsActionBarOpen(true);
		setFile(file);
	};

	const saveAvatarHandler = () => {
		if (file) {
			toaster.promise(updateAvatarImage.bind(null, file), {
				success: {
					title: 'Avatar updated!',
					description: 'Your new avatar looks great.',
				},
				error: {
					title: 'Avatar update failed',
					description: 'There was a problem updating your avatar.',
				},
				loading: {
					title: 'Updating avatar...',
					description: 'Please wait while we update your avatar.',
				},
			});

			setIsActionBarOpen(false);
		}
	};

	return (
		<Flex
			as="section"
			flexDirection={{ base: 'column', lg: 'row' }}
			justifyContent="space-between"
			alignItems="center"
			gap={{ base: 6, lg: 16 }}
			my={4}
		>
			<HStack gap={6} justifyContent={{ base: 'flex-start', lg: 'center' }} w="full">
				<Avatar.Root size="2xl">
					<Avatar.Fallback name={user?.name} />
					<Avatar.Image src={user?.avatar || ''} />
				</Avatar.Root>
				<Box>
					<Heading size="3xl">{user?.name}</Heading>
					<Text fontSize="sm" color="gray.400">
						{user?.email}
					</Text>
				</Box>
			</HStack>
			<Flex w="full" gap={4} flexDirection={{ base: 'row', lg: 'column' }}>
				<FileUploadRoot onFileChange={chooseImageHandler} accept="image/*">
					<FileUploadTrigger asChild>
						<Button size="xs" variant="surface" colorPalette="blue" w="full">
							<ArrowUpFromLine />
							<Text>Change the avatar</Text>
						</Button>
					</FileUploadTrigger>
				</FileUploadRoot>
				<LogoutAlertDialog
					trigger={
						<Button size="xs" variant="surface" colorPalette="red" w={{ base: '1/2', lg: 'full' }}>
							<LogOut />
							<Text>Sign out</Text>
						</Button>
					}
				/>
			</Flex>

			<ActionBar.Root open={isActionBarOpen}>
				<Portal>
					<ActionBar.Positioner>
						<ActionBar.Content>
							<ActionBar.SelectionTrigger>
								<Image
									width="32px"
									src={file ? URL.createObjectURL(file) : undefined}
									alt="avatar"
								/>
								{file ? file.name : null}
							</ActionBar.SelectionTrigger>
							<ActionBar.Separator />
							<Button
								variant="outline"
								size="sm"
								onClick={() => {
									setIsActionBarOpen(false);
									setFile(null);
								}}
							>
								Cancel
							</Button>
							<Button variant="solid" colorPalette="blue" size="sm" onClick={saveAvatarHandler}>
								Set new avatar
							</Button>
						</ActionBar.Content>
					</ActionBar.Positioner>
				</Portal>
			</ActionBar.Root>
		</Flex>
	);
}

import { Box, Heading, RadioGroup, VStack } from '@chakra-ui/react';

import { ColorMode, useColorMode } from '@/components/ui/color-mode';

export function ThemeSelector() {
	const { colorMode, setColorMode } = useColorMode();

	const colorModes = [
		{
			value: 'light',
			label: 'Light theme',
		},
		{
			value: 'dark',
			label: 'Dark theme',
		},
	];

	return (
		<Box as="section" my={4}>
			<Heading as="h2" mb={4} size="lg">
				Theme Selector
			</Heading>
			<RadioGroup.Root
				colorPalette="blue"
				value={colorMode}
				onValueChange={event => setColorMode(event.value as ColorMode)}
			>
				<VStack alignItems="flex-start" gap={4}>
					{colorModes.map(mode => (
						<RadioGroup.Item key={mode.value} value={mode.value}>
							<RadioGroup.ItemHiddenInput />
							<RadioGroup.ItemIndicator />
							<RadioGroup.ItemText>{mode.label}</RadioGroup.ItemText>
						</RadioGroup.Item>
					))}
				</VStack>
			</RadioGroup.Root>
		</Box>
	);
}

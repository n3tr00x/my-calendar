import { Icon, IconProps } from '@chakra-ui/react';
import { ChevronLeft } from 'lucide-react';

export function ChevronLeftIcon(props: IconProps) {
	return (
		<Icon {...props}>
			<ChevronLeft />
		</Icon>
	);
}

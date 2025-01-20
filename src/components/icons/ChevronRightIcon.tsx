import { Icon, IconProps } from '@chakra-ui/react';
import { ChevronRight } from 'lucide-react';

export function ChevronRightIcon(props: IconProps) {
	return (
		<Icon {...props}>
			<ChevronRight />
		</Icon>
	);
}

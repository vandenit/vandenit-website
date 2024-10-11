import { useState } from 'react';
import { Flex, Button, Text, Box } from '@radix-ui/themes';
import { FaAngleUp, FaAngleDown } from 'react-icons/fa';
import { Link as RadixLink } from '@radix-ui/themes';
import Link from 'next/link';

export const TagFilterPanel = ({ tags }: { tags: string[] }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <Flex direction="column" gap="4" p="5">
      <Flex justify="between" align="center">
        <Button
          size="2"
          variant="ghost"
          color="gray"
          onClick={handleToggleCollapse}
          style={{ display: isCollapsed ? 'none' : 'inline-flex' }}
        >
          <Text size="1" color="gray">Hide Tags</Text> <FaAngleUp />
        </Button>
        <Button
          size="2"
          variant="ghost"
          color="gray"
          onClick={handleToggleCollapse}
          style={{ display: isCollapsed ? 'inline-flex' : 'none' }}
        >
          <Text size="1" color="gray">Show All Tags</Text> <FaAngleDown />
        </Button>
      </Flex>

      <Box style={{ display: isCollapsed ? 'none' : 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
        {tags.map((tag) => (
          <Text key={tag} size="1" weight="bold">
            <RadixLink asChild>
              <Link href={`/posts?tag=${tag}`}>{tag}</Link>
            </RadixLink>
          </Text>
        ))}
      </Box>
    </Flex>
  );
};

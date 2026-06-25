import { useState } from 'react';
import { Flex, Button, Text, Box, Container, Badge } from '@radix-ui/themes';
import { FaAngleUp, FaAngleDown, FaFilter } from 'react-icons/fa';
import Link from 'next/link';

export const TagFilterPanel = ({ tags }: { tags: string[] }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  if (tags.length === 0) return null;

  return (
    <Container>
      <Box mb="6" p="4" style={{ background: 'var(--gray-2)', borderRadius: 'var(--radius-3)' }}>
        <Flex justify="between" align="center" mb={isCollapsed ? "0" : "4"}>
          <Flex align="center" gap="2">
            <FaFilter size="0.9em" color="var(--gray-9)" />
            <Text size="3" weight="medium" color="gray">
              Filter by Topic
            </Text>
          </Flex>
          <Button
            size="2"
            variant="ghost"
            color="gray"
            onClick={handleToggleCollapse}
          >
            <Text size="2">
              {isCollapsed ? 'Show Tags' : 'Hide Tags'}
            </Text>
            {isCollapsed ? <FaAngleDown /> : <FaAngleUp />}
          </Button>
        </Flex>

        {!isCollapsed && (
          <Box>
            <Flex wrap="wrap" gap="2">
              <Badge size="2" variant="soft" color="gray">
                <Link href="/posts">All Posts</Link>
              </Badge>
              {tags.map((tag) => (
                <Badge key={tag} size="2" variant="soft" color="blue">
                  <Link href={`/posts?tag=${tag}`}>{tag}</Link>
                </Badge>
              ))}
            </Flex>
          </Box>
        )}
      </Box>
    </Container>
  );
};
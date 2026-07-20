import { Flex, Text, Container, Badge } from '@radix-ui/themes';
import { FaFilter } from 'react-icons/fa';
import Link from 'next/link';

export const TagFilterPanel = ({ tags }: { tags: string[] }) => {
  if (tags.length === 0) return null;

  return (
    <Container size="3" px="6" mb="6">
      <Flex align="center" gap="3" wrap="wrap">
        <Flex align="center" gap="2" style={{ flexShrink: 0 }}>
          <FaFilter size="0.8em" color="var(--gray-9)" />
          <Text size="2" weight="medium" color="gray">
            Filter:
          </Text>
        </Flex>
        <Flex gap="2" wrap="wrap">
          <Link href="/posts" style={{ textDecoration: 'none' }}>
            <Badge size="2" variant="solid" color="blue">
              All Posts
            </Badge>
          </Link>
          {tags.map((tag) => (
            <Link key={tag} href={`/posts?tag=${tag}`} style={{ textDecoration: 'none' }}>
              <Badge size="2" variant="soft" color="gray">
                {tag}
              </Badge>
            </Link>
          ))}
        </Flex>
      </Flex>
    </Container>
  );
};
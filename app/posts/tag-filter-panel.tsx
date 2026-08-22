import { Flex, Text, Container, Badge } from '@radix-ui/themes';
import { FaFilter } from 'react-icons/fa';
import Link from 'next/link';

export const TagFilterPanel = ({ tags, postsCount, currentTag }: { tags: string[]; postsCount: number; currentTag?: string }) => {
  // Hide filters when there's only one post or no multiple tags to filter between
  if (postsCount <= 1 || tags.length <= 1) return null;

  return (
    <Container size="3" px="6" mb="4">
      <Flex align="center" gap="3" wrap="wrap">
        <Flex align="center" gap="2" style={{ flexShrink: 0 }}>
          <FaFilter size="0.8em" color="var(--gray-9)" aria-hidden="true" />
          <Text size="2" weight="medium" color="gray">
            Filter:
          </Text>
        </Flex>
        <Flex gap="2" wrap="wrap">
          <Link href="/posts" style={{ textDecoration: 'none' }}>
            <Badge size="3" variant={!currentTag ? 'solid' : 'soft'} color="blue">
              All Posts
            </Badge>
          </Link>
          {tags.map((tag) => (
            <Link key={tag} href={`/posts?tag=${tag}`} style={{ textDecoration: 'none' }}>
              <Badge size="3" variant={currentTag === tag ? 'solid' : 'soft'} color={currentTag === tag ? 'blue' : 'gray'}>
                {tag}
              </Badge>
            </Link>
          ))}
        </Flex>
      </Flex>
    </Container>
  );
};
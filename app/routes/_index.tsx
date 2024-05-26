import { json, LoaderFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { useState } from 'react';
import styled from '@emotion/styled';

interface Story {
  id: number;
  title: string;
  url?: string;
  score: number;
  by: string;
  descendants: string;
}

interface NewsProps {
  stories: Story[];
}
const Container = styled.div`
  display: flex;
  justify-content: center;
`;
const MainTitle = styled.h1`
  padding: 5px;
  background-color: #ff6600;
  margin: 0;
  font-family: Verdana, Geneva, sans-serif;
  font-size: 20px;
`;

const NewsTitle = styled.h3`
  font-size: 18px;
  margin-bottom: 5px;
`;

const NewsLink = styled.a`
  text-decoration: none;
  color: #000000;
  font-family: Verdana, Geneva, sans-serif;
  font-weight: lighter;
`;
const Button = styled.button`
  padding: 5px;
  margin-top: 5px;
  border: 1px solid #ff6600;
  background-color: #ffffff;
  color: #ff6600;
  cursor: pointer;
  font-weight: bold;
  font-size: 13px;
  &:hover {
    background-color: #ff6600;
    color: #ffffff;
  }
`;
const Score = styled.p`
  margin-right: 5px;
`;
export let loader: LoaderFunction = async () => {
  try {
    const response = await fetch(
      'https://hacker-news.firebaseio.com/v0/topstories.json'
    );

    const storyIds = await response.json();

    const storiesPromises = storyIds.map(async (storyId: number) => {
      const storyResponse = await fetch(
        `https://hacker-news.firebaseio.com/v0/item/${storyId}.json`
      );
      return await storyResponse.json();
    });

    const stories = await Promise.all(storiesPromises);

    return json({ stories });
  } catch (error) {
    console.error('Error fetching data:', error);
    return json({ error: 'Error fetching data' });
  }
};

export default function News() {
  const { stories } = useLoaderData<NewsProps>();
  const storiesWithUrl = stories.filter((story) => story.url);
  const [visibleStories, setVisibleStories] = useState<number>(5);

  const showMore = () => {
    setVisibleStories((prev) => prev + 5);
  };
  if (process.env.NODE_ENV === 'development') {
    throw new Error('Sentry Test Error');
  }
  return (
    <Container>
      <div css={{ width: '80%', maxWidth: '800px' }}>
        <MainTitle>Top Stories</MainTitle>
        {storiesWithUrl.slice(0, visibleStories).map((story) => (
          <div
            key={story.id}
            css={{
              borderBottom: '1px solid #dcdcdc',
              padding: '10px',
              backgroundColor: '#f6f6ef',
            }}
          >
            <NewsTitle>
              <NewsLink href={story.url}>{story.title}</NewsLink>
            </NewsTitle>
            <div
              css={{
                display: 'flex',
                flexDirection: 'row',
                color: '#b5b4b0',
                justifyContent: 'space-between',
              }}
            >
              <Score>
                {story.score !== 0
                  ? story.score === 1
                    ? story.score + ' point'
                    : story.score + ' points'
                  : 'no points'}{' '}
                by {story.by}
              </Score>
              <p>
                {story.descendants && parseInt(story.descendants) !== 0
                  ? parseInt(story.descendants) === 1
                    ? story.descendants + ' comment'
                    : story.descendants + ' comments'
                  : 'no comments'}
              </p>
            </div>
          </div>
        ))}
        {visibleStories < storiesWithUrl.length && (
          <Button onClick={showMore}>Show More</Button>
        )}
      </div>
    </Container>
  );
}

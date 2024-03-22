import { json, LoaderFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { useState } from 'react';
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

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: '80%', maxWidth: '800px' }}>
        <h1
          style={{
            padding: '5px',
            backgroundColor: '#FF6600',
            margin: 0,
            fontFamily: 'Verdana, Geneva, sans-serif',
            fontSize: '20px',
          }}
        >
          Top Stories
        </h1>

        {storiesWithUrl.slice(0, visibleStories).map((story) => (
          <div
            key={story.id}
            style={{
              borderBottom: '1px solid #dcdcdc',
              padding: '10px',
              backgroundColor: '#f6f6ef',
            }}
          >
            <h3 style={{ fontSize: '18px', marginBottom: '5px' }}>
              <a
                href={story.url}
                style={{
                  textDecoration: 'none',
                  color: '#000000',
                  fontFamily: 'Verdana, Geneva, sans-serif',
                  fontWeight: 'lighter',
                }}
              >
                {story.title}
              </a>
            </h3>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                color: '#b5b4b0',
                justifyContent: 'space-between',
              }}
            >
              <p style={{ marginRight: '5px' }}>
                {story.score !== 0
                  ? story.score === 1
                    ? story.score + ' point'
                    : story.score + ' points'
                  : 'no points'}{' '}
                by {story.by}
              </p>
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
          <button
            onClick={showMore}
            style={{
              padding: '5px',
              marginTop: '5px',
              border: '1px solid #FF6600',
              backgroundColor: '#ffffff',
              color: '#FF6600',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '13px',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#FF6600';
              e.currentTarget.style.color = '#ffffff';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#ffffff';
              e.currentTarget.style.color = '#FF6600';
            }}
          >
            Show More
          </button>
        )}
      </div>
    </div>
  );
}

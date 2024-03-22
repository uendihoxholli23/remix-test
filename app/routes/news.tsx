import { json, LoaderFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

interface Story {
  id: number;
  title: string;
  url: string;
}

interface NewsProps {
  topStory: Story;
}

export let loader: LoaderFunction = async () => {
  try {
    const response = await fetch(
      'https://hacker-news.firebaseio.com/v0/topstories.json'
    );

    const storyIds = await response.json();

    const topStoryId = storyIds[0];
    console.log('Top Story ID:', topStoryId);

    const storyResponse = await fetch(
      `https://hacker-news.firebaseio.com/v0/item/${topStoryId}.json`
    );
    const topStory = await storyResponse.json();
    console.log('Top Story:', topStory);

    return json({ topStory });
  } catch (error) {
    console.error('Error fetching data:', error);
    return json({ error: 'Error fetching data' });
  }
};

export default function News() {
  const { topStory } = useLoaderData<NewsProps>();
  return (
    <div>
      <h1>Top Story</h1>
      <p>
        <a href={topStory.url}>Title: {topStory.title}</a>
      </p>
    </div>
  );
}

const express = require('express');
const axios = require('axios');
const router = express.Router();

// Function to fetch Reddit post
const getRedditAccessToken = async () => {
  const clientId = process.env.REDDIT_CLIENT_ID;
  const clientSecret = process.env.REDDIT_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('Missing Reddit client ID or secret in environment variables.');
  }

  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  const res = await axios.post(
    'https://www.reddit.com/api/v1/access_token',
    'grant_type=client_credentials',
    {
      headers: {
        Authorization: `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );

  return res.data.access_token;
};

const fetchRedditPosts = async () => {
  try {
    const token = await getRedditAccessToken();

    const redditRes = await axios.get('https://oauth.reddit.com/r/popular', {
      headers: {
        Authorization: `Bearer ${token}`,
        'User-Agent': 'creator-app/1.0 by Hemantsinghrajput',
      },
    });

    return redditRes.data.data.children.slice(0, 5).map((post: any) => ({
      id: post.data.id,
      title: post.data.title,
      link: `https://www.reddit.com${post.data.permalink}`,
      source: 'Reddit',
    }));
  } catch (error) {
    console.error('Error fetching Reddit posts:', error);
    return [];
  }
};

// Function to fetch Hacker News posts
const fetchHackerNewsPosts = async () => {
  try {
    const hnIdsRes = await axios.get('https://hacker-news.firebaseio.com/v0/topstories.json');
    const top5 = hnIdsRes.data.slice(0, 5); // Get the top 5 stories

    const hnPosts = await Promise.all(
      top5.map(id =>
        axios.get(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
      )
    );

    return hnPosts.map(post => ({
      id: post.data.id,
      title: post.data.title,
      link: post.data.url || `https://news.ycombinator.com/item?id=${post.data.id}`,
      source: 'Hacker News',
    }));
  } catch (error) {
    console.error('Error fetching Hacker News posts:', error);
    return [];
  }
};

// Route to fetch Reddit and Hacker News posts
router.get('/', async (req, res) => {
  try {
    const redditFeed = await fetchRedditPosts();
    const hackerNewsFeed = await fetchHackerNewsPosts();
    res.json([...redditFeed, ...hackerNewsFeed]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching feed' });
  }
});

module.exports = router;

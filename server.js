const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

// Enable CORS for your frontend
app.use(cors({
    origin: 'https://devamy.infinityfreeapp.com'
}));
app.use(express.json());

// Endpoint to fetch profile picture
app.get('/fetch-profile-pic', async (req, res) => {
    const profileUrl = req.query.url;

    // Validate URL
    if (!profileUrl || !profileUrl.match(/^https:\/\/kick\.com\/[a-zA-Z0-9_-]+$/)) {
        return res.status(400).json({ error: 'Invalid or missing Kick.com profile URL' });
    }

    try {
        const response = await axios.get(profileUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5',
                'Accept-Encoding': 'gzip, deflate, br',
                'Referer': 'https://kick.com/',
                'Connection': 'keep-alive',
                'DNT': '1'
            },
            timeout: 10000
        });

        // Extract img src using regex
        const regex = /<img[^>]+id="channel-avatar"[^>]+src="([^"]+)"/i;
        const match = response.data.match(regex);

        if (match && match[1]) {
            return res.json({ url: match[1] });
        } else {
            return res.status(404).json({ error: 'Profile picture not found' });
        }
    } catch (error) {
        console.error('Error fetching profile picture:', error.message);
        return res.status(500).json({ error: 'Failed to fetch profile picture' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

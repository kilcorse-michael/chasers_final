const environmentSpecificVariables = {
  development: {
    url: 'http://localhost:8080',
  },
  production: {
    url: 'https://chaserstoledo.com',
  },
};

module.exports = {
  title: 'Chasers Toledo',
  author: 'Michael Kilcorse',
  email: '',
  description: '',
  keywords: ['College Bar', 'Party', 'Toledo', 'Nightlife', 'Club', 'Dance club', 'Ohio', 'University of Toledo'],
  language: 'en-US',
  favicon: {
    widths: [32, 57, 76, 96, 128, 192, 228],
    format: 'png',
  },
  ...environmentSpecificVariables[process.env.ELEVENTY_ENV],
};

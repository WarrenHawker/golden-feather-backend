import { CreatorCreationData } from '../types/creator';

const dummyCreators: CreatorCreationData[] = [
  {
    name: 'GamerGal',
    description:
      'A passionate gamer sharing the latest gameplay strategies and tutorials.',
    videoUrl: 'https://youtube.com/gamergal',
    socials: {
      discord: 'https://discord.gg/gamergal',
      youtube: 'https://youtube.com/gamergal',
      twitch: 'https://twitch.tv/gamergal',
      twitter: 'https://twitter.com/gamergal',
    },
    tags: ['Gaming', 'Tutorials', 'Walkthroughs'],
    language: 'English',
    status: 'public',
  },
  {
    name: 'TechGuru',
    description:
      'Latest tech reviews, gadget unboxings, and tutorials for tech enthusiasts.',
    videoUrl: 'https://youtube.com/techguru',
    socials: {
      youtube: 'https://youtube.com/techguru',
      twitter: 'https://twitter.com/techguru',
      facebook: 'https://facebook.com/techguru',
    },
    tags: ['Technology', 'Reviews', 'Gadgets'],
    language: 'English',
    status: 'private',
  },
  {
    name: 'FoodieFiesta',
    description:
      'Exploring culinary delights and sharing easy-to-follow recipes.',
    videoUrl: 'https://youtube.com/foodiefiesta',
    socials: {
      youtube: 'https://youtube.com/foodiefiesta',
      instagram: 'https://instagram.com/foodiefiesta',
      facebook: 'https://facebook.com/foodiefiesta',
    },
    tags: ['Food', 'Recipes', 'Cooking'],
    language: 'Spanish',
    status: 'public',
  },
  {
    name: 'ArtisticMind',
    description:
      'A creative journey into the world of art, design, and inspiration.',
    videoUrl: 'https://youtube.com/artisticmind',
    socials: {
      instagram: 'https://instagram.com/artisticmind',
      youtube: 'https://youtube.com/artisticmind',
      twitter: 'https://twitter.com/artisticmind',
    },
    tags: ['Art', 'Design', 'Creativity'],
    language: 'French',
    status: 'private',
  },
  {
    name: 'FitnessFreak',
    description:
      'Daily fitness routines, health tips, and motivational content.',
    videoUrl: 'https://youtube.com/fitnessfreak',
    socials: {
      youtube: 'https://youtube.com/fitnessfreak',
      twitter: 'https://twitter.com/fitnessfreak',
      instagram: 'https://instagram.com/fitnessfreak',
    },
    tags: ['Fitness', 'Health', 'Motivation'],
    language: 'German',
    status: 'public',
  },
  {
    name: 'TravelWithMe',
    description:
      'Join me as I explore the world and share my travel experiences.',
    videoUrl: 'https://youtube.com/travelwithme',
    socials: {
      youtube: 'https://youtube.com/travelwithme',
      instagram: 'https://instagram.com/travelwithme',
    },
    tags: ['Travel', 'Vlogs', 'Adventure'],
    language: 'Italian',
    status: 'private',
  },
  {
    name: 'MusicMaestro',
    description:
      'Sharing my passion for music through covers and original compositions.',
    videoUrl: 'https://youtube.com/musicmaestro',
    socials: {
      youtube: 'https://youtube.com/musicmaestro',
      twitter: 'https://twitter.com/musicmaestro',
    },
    tags: ['Music', 'Covers', 'Originals'],
    language: 'English',
    status: 'public',
  },
  {
    name: 'EcoWarrior',
    description: 'Promoting sustainable living and environmental awareness.',
    videoUrl: 'https://youtube.com/ecowarrior',
    socials: {
      youtube: 'https://youtube.com/ecowarrior',
      instagram: 'https://instagram.com/ecowarrior',
    },
    tags: ['Environment', 'Sustainability', 'Green Living'],
    language: 'English',
    status: 'private',
  },
  {
    name: 'BookNook',
    description: 'Book reviews, recommendations, and all things literary.',
    videoUrl: 'https://youtube.com/booknook',
    socials: {
      twitter: 'https://twitter.com/booknook',
      instagram: 'https://instagram.com/booknook',
    },
    tags: ['Books', 'Reviews', 'Literature'],
    language: 'English',
    status: 'public',
  },
  {
    name: 'ScienceSavvy',
    description:
      'Explaining complex scientific concepts in an easy-to-understand manner.',
    videoUrl: 'https://youtube.com/sciencesavvy',
    socials: {
      youtube: 'https://youtube.com/sciencesavvy',
      twitter: 'https://twitter.com/sciencesavvy',
    },
    tags: ['Science', 'Education', 'Explainers'],
    language: 'English',
    status: 'private',
  },
  {
    name: 'CraftyHands',
    description: 'Creative DIY projects and craft tutorials for all ages.',
    videoUrl: 'https://youtube.com/craftyhands',
    socials: {
      youtube: 'https://youtube.com/craftyhands',
      instagram: 'https://instagram.com/craftyhands',
      facebook: 'https://facebook.com/craftyhands',
    },
    tags: ['Crafts', 'DIY', 'Tutorials'],
    language: 'English',
    status: 'public',
  },
  {
    name: 'PetPals',
    description: 'All about pets and how to take care of them.',
    videoUrl: 'https://youtube.com/petpals',
    socials: {
      youtube: 'https://youtube.com/petpals',
      instagram: 'https://instagram.com/petpals',
    },
    tags: ['Pets', 'Care', 'Tips'],
    language: 'English',
    status: 'private',
  },
  {
    name: 'HistoryBuff',
    description: 'Diving deep into historical events and figures.',
    videoUrl: 'https://youtube.com/historybuff',
    socials: {
      youtube: 'https://youtube.com/historybuff',
      twitter: 'https://twitter.com/historybuff',
    },
    tags: ['History', 'Education', 'Documentaries'],
    language: 'English',
    status: 'public',
  },
  {
    name: 'GamingGuru',
    description: 'Mastering video games one level at a time.',
    videoUrl: 'https://youtube.com/gamingguru',
    socials: {
      youtube: 'https://youtube.com/gamingguru',
      twitch: 'https://twitch.tv/gamingguru',
      twitter: 'https://twitter.com/gamingguru',
    },
    tags: ['Gaming', 'Walkthroughs', 'Reviews'],
    language: 'English',
    status: 'private',
  },
  {
    name: 'MindfulMeditation',
    description: 'Guided meditation sessions and mindfulness tips.',
    videoUrl: 'https://youtube.com/mindfulmeditation',
    socials: {
      youtube: 'https://youtube.com/mindfulmeditation',
      instagram: 'https://instagram.com/mindfulmeditation',
    },
    tags: ['Meditation', 'Mindfulness', 'Health'],
    language: 'English',
    status: 'public',
  },
  {
    name: 'TheFilmCritic',
    description: 'In-depth movie reviews and film industry insights.',
    videoUrl: 'https://youtube.com/thefilmcritic',
    socials: {
      youtube: 'https://youtube.com/thefilmcritic',
      twitter: 'https://twitter.com/thefilmcritic',
    },
    tags: ['Movies', 'Reviews', 'Entertainment'],
    language: 'English',
    status: 'private',
  },
  {
    name: 'CodingWizard',
    description: 'Learn programming with easy-to-follow tutorials.',
    videoUrl: 'https://youtube.com/codingwizard',
    socials: {
      youtube: 'https://youtube.com/codingwizard',
      twitter: 'https://twitter.com/codingwizard',
    },
    tags: ['Programming', 'Technology', 'Education'],
    language: 'English',
    status: 'public',
  },
  {
    name: 'PhotographyPro',
    description: 'Professional photography tips and gear reviews.',
    videoUrl: 'https://youtube.com/photographypro',
    socials: {
      youtube: 'https://youtube.com/photographypro',
      instagram: 'https://instagram.com/photographypro',
    },
    tags: ['Photography', 'Reviews', 'Gear'],
    language: 'English',
    status: 'private',
  },
  {
    name: 'MindGames',
    description: 'Puzzles, brain teasers, and logic games.',
    videoUrl: 'https://youtube.com/mindgames',
    socials: {
      youtube: 'https://youtube.com/mindgames',
      twitter: 'https://twitter.com/mindgames',
    },
    tags: ['Puzzles', 'Games', 'Education'],
    language: 'English',
    status: 'public',
  },
  {
    name: 'DanceMania',
    description: 'Dance tutorials and performances from around the world.',
    videoUrl: 'https://youtube.com/dancemania',
    socials: {
      youtube: 'https://youtube.com/dancemania',
      instagram: 'https://instagram.com/dancemania',
    },
    tags: ['Dance', 'Performances', 'Tutorials'],
    language: 'English',
    status: 'private',
  },
  {
    name: 'VeganVibes',
    description: 'Delicious vegan recipes and lifestyle tips.',
    videoUrl: 'https://youtube.com/veganvibes',
    socials: {
      youtube: 'https://youtube.com/veganvibes',
      instagram: 'https://instagram.com/veganvibes',
    },
    tags: ['Vegan', 'Cooking', 'Lifestyle'],
    language: 'English',
    status: 'public',
  },
  {
    name: 'LanguageLearner',
    description: 'Tips and resources for learning new languages.',
    videoUrl: 'https://youtube.com/languagelearner',
    socials: {
      youtube: 'https://youtube.com/languagelearner',
      twitter: 'https://twitter.com/languagelearner',
    },
    tags: ['Education', 'Languages', 'Learning'],
    language: 'Spanish',
    status: 'private',
  },
  {
    name: 'MotivationStation',
    description: 'Daily motivation and inspirational content.',
    videoUrl: 'https://youtube.com/motivationstation',
    socials: {
      youtube: 'https://youtube.com/motivationstation',
      twitter: 'https://twitter.com/motivationstation',
    },
    tags: ['Motivation', 'Inspiration', 'Self-Help'],
    language: 'English',
    status: 'public',
  },
  {
    name: 'GadgetGeek',
    description: 'The latest tech gadgets and how to use them.',
    videoUrl: 'https://youtube.com/gadgetgeek',
    socials: {
      youtube: 'https://youtube.com/gadgetgeek',
      twitter: 'https://twitter.com/gadgetgeek',
      instagram: 'https://instagram.com/gadgetgeek',
    },
    tags: ['Technology', 'Gadgets', 'Reviews'],
    language: 'English',
    status: 'private',
  },
  {
    name: 'AdventureAwaits',
    description: 'Exploring the great outdoors and sharing adventures.',
    videoUrl: 'https://youtube.com/adventureawaits',
    socials: {
      youtube: 'https://youtube.com/adventureawaits',
      instagram: 'https://instagram.com/adventureawaits',
    },
    tags: ['Travel', 'Adventure', 'Vlogs'],
    language: 'English',
    status: 'public',
  },
  {
    name: 'MindfulEating',
    description: 'Healthy eating tips and mindful nutrition advice.',
    videoUrl: 'https://youtube.com/mindfuleating',
    socials: {
      youtube: 'https://youtube.com/mindfuleating',
      instagram: 'https://instagram.com/mindfuleating',
    },
    tags: ['Health', 'Nutrition', 'Lifestyle'],
    language: 'English',
    status: 'private',
  },
  {
    name: 'ComedyCentral',
    description: 'Bringing you the best in stand-up comedy and sketches.',
    videoUrl: 'https://youtube.com/comedycentral',
    socials: {
      youtube: 'https://youtube.com/comedycentral',
      twitter: 'https://twitter.com/comedycentral',
    },
    tags: ['Comedy', 'Entertainment', 'Shows'],
    language: 'English',
    status: 'public',
  },
  {
    name: 'ArtOfWar',
    description: 'In-depth analysis and history of famous battles.',
    videoUrl: 'https://youtube.com/artofwar',
    socials: {
      youtube: 'https://youtube.com/artofwar',
      twitter: 'https://twitter.com/artofwar',
    },
    tags: ['History', 'Military', 'Education'],
    language: 'English',
    status: 'private',
  },
  {
    name: 'SculptingSoul',
    description: 'Showcasing the art of sculpture and 3D art.',
    videoUrl: 'https://youtube.com/sculptingsoul',
    socials: {
      youtube: 'https://youtube.com/sculptingsoul',
      instagram: 'https://instagram.com/sculptingsoul',
    },
    tags: ['Art', 'Sculpture', 'Design'],
    language: 'English',
    status: 'public',
  },
  {
    name: 'HikingHeights',
    description: 'Guides to the best hiking spots and outdoor adventures.',
    videoUrl: 'https://youtube.com/hikingheights',
    socials: {
      youtube: 'https://youtube.com/hikingheights',
      instagram: 'https://instagram.com/hikingheights',
    },
    tags: ['Travel', 'Adventure', 'Guides'],
    language: 'English',
    status: 'private',
  },
  {
    name: 'AstronomyAce',
    description: 'Exploring the universe one star at a time.',
    videoUrl: 'https://youtube.com/astronomyace',
    socials: {
      youtube: 'https://youtube.com/astronomyace',
      twitter: 'https://twitter.com/astronomyace',
    },
    tags: ['Science', 'Astronomy', 'Education'],
    language: 'English',
    status: 'public',
  },
  {
    name: 'FashionForward',
    description: 'Your guide to the latest fashion trends and styles.',
    videoUrl: 'https://youtube.com/fashionforward',
    socials: {
      youtube: 'https://youtube.com/fashionforward',
      instagram: 'https://instagram.com/fashionforward',
    },
    tags: ['Fashion', 'Lifestyle', 'Trends'],
    language: 'English',
    status: 'private',
  },
  {
    name: 'CryptoChronicles',
    description: 'Demystifying cryptocurrency and blockchain technology.',
    videoUrl: 'https://youtube.com/cryptochronicles',
    socials: {
      youtube: 'https://youtube.com/cryptochronicles',
      twitter: 'https://twitter.com/cryptochronicles',
    },
    tags: ['Technology', 'Finance', 'Cryptocurrency'],
    language: 'English',
    status: 'public',
  },
  {
    name: 'UrbanExplorer',
    description: 'Exploring the hidden gems of urban landscapes.',
    videoUrl: 'https://youtube.com/urbanexplorer',
    socials: {
      youtube: 'https://youtube.com/urbanexplorer',
      instagram: 'https://instagram.com/urbanexplorer',
    },
    tags: ['Travel', 'Adventure', 'Vlogs'],
    language: 'English',
    status: 'private',
  },
  {
    name: 'StartupStories',
    description: 'Inspiring stories from successful entrepreneurs.',
    videoUrl: 'https://youtube.com/startupstories',
    socials: {
      youtube: 'https://youtube.com/startupstories',
      twitter: 'https://twitter.com/startupstories',
    },
    tags: ['Business', 'Entrepreneurship', 'Motivation'],
    language: 'English',
    status: 'public',
  },
  {
    name: 'EpicEats',
    description: "Indulging in the world's most epic culinary creations.",
    videoUrl: 'https://youtube.com/epiceats',
    socials: {
      youtube: 'https://youtube.com/epiceats',
      instagram: 'https://instagram.com/epiceats',
    },
    tags: ['Food', 'Cooking', 'Reviews'],
    language: 'English',
    status: 'private',
  },
  {
    name: 'GuitarGenius',
    description: 'Teaching you how to master the guitar.',
    videoUrl: 'https://youtube.com/guitargenius',
    socials: {
      youtube: 'https://youtube.com/guitargenius',
      twitter: 'https://twitter.com/guitargenius',
    },
    tags: ['Music', 'Education', 'Guitar'],
    language: 'English',
    status: 'public',
  },
  {
    name: 'FilmFanatic',
    description:
      'Celebrating the magic of cinema with reviews and retrospectives.',
    videoUrl: 'https://youtube.com/filmfanatic',
    socials: {
      youtube: 'https://youtube.com/filmfanatic',
      twitter: 'https://twitter.com/filmfanatic',
    },
    tags: ['Movies', 'Reviews', 'Entertainment'],
    language: 'English',
    status: 'private',
  },
  {
    name: 'HomeChef',
    description: 'Easy-to-follow recipes for the home cook.',
    videoUrl: 'https://youtube.com/homechef',
    socials: {
      youtube: 'https://youtube.com/homechef',
      instagram: 'https://instagram.com/homechef',
    },
    tags: ['Food', 'Cooking', 'Recipes'],
    language: 'English',
    status: 'public',
  },
  {
    name: 'AutoAddict',
    description: 'The latest in cars, bikes, and all things automotive.',
    videoUrl: 'https://youtube.com/autoaddict',
    socials: {
      youtube: 'https://youtube.com/autoaddict',
      twitter: 'https://twitter.com/autoaddict',
    },
    tags: ['Automotive', 'Reviews', 'Technology'],
    language: 'English',
    status: 'private',
  },
  {
    name: 'GamingGladiator',
    description: 'The ultimate warrior in the world of gaming.',
    videoUrl: 'https://youtube.com/gaminggladiator',
    socials: {
      youtube: 'https://youtube.com/gaminggladiator',
      twitch: 'https://twitch.tv/gaminggladiator',
      twitter: 'https://twitter.com/gaminggladiator',
    },
    tags: ['Gaming', 'Walkthroughs', 'Reviews'],
    language: 'English',
    status: 'public',
  },
  {
    name: 'MeditationMaster',
    description: 'Achieving peace through guided meditation.',
    videoUrl: 'https://youtube.com/meditationmaster',
    socials: {
      youtube: 'https://youtube.com/meditationmaster',
      instagram: 'https://instagram.com/meditationmaster',
    },
    tags: ['Meditation', 'Health', 'Wellness'],
    language: 'English',
    status: 'private',
  },
  {
    name: 'ArtisticAura',
    description: 'Capturing the beauty of the world through art.',
    videoUrl: 'https://youtube.com/artisticaura',
    socials: {
      youtube: 'https://youtube.com/artisticaura',
      instagram: 'https://instagram.com/artisticaura',
    },
    tags: ['Art', 'Design', 'Creativity'],
    language: 'English',
    status: 'public',
  },
  {
    name: 'CyclingChampion',
    description: 'The ultimate guide to cycling and fitness.',
    videoUrl: 'https://youtube.com/cyclingchampion',
    socials: {
      youtube: 'https://youtube.com/cyclingchampion',
      twitter: 'https://twitter.com/cyclingchampion',
    },
    tags: ['Fitness', 'Cycling', 'Health'],
    language: 'English',
    status: 'private',
  },
  {
    name: 'RetroGamer',
    description: 'Celebrating the classics of video gaming.',
    videoUrl: 'https://youtube.com/retrogamer',
    socials: {
      youtube: 'https://youtube.com/retrogamer',
      twitter: 'https://twitter.com/retrogamer',
    },
    tags: ['Gaming', 'Retro', 'Reviews'],
    language: 'English',
    status: 'public',
  },
  {
    name: 'SpiritualSeeker',
    description: 'A journey into spirituality and self-discovery.',
    videoUrl: 'https://youtube.com/spiritualseeker',
    socials: {
      youtube: 'https://youtube.com/spiritualseeker',
      instagram: 'https://instagram.com/spiritualseeker',
    },
    tags: ['Spirituality', 'Self-Help', 'Wellness'],
    language: 'English',
    status: 'private',
  },
];

export default dummyCreators;

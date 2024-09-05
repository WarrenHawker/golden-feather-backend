import { GuildCreationData } from '../../types/guild';

const guilds: GuildCreationData[] = [
  {
    name: 'The Warriors of Light',
    description: 'A hardcore PvE guild focused on endgame content and raids.',
    guild_leader: 'Lunara',
    status: 'public',
    language: 'English',
    tags: ['pve', 'hardcore'],
    region: 'NA',
    socials: {
      discord: 'https://discord.gg/warriorsoflight',
      youtube: 'https://youtube.com/warriorsoflight',
      twitter: 'https://twitter.com/warriorsoflight',
    },
  },
  {
    name: 'Stormcallers',
    description:
      'A casual roleplaying guild with a focus on immersive storytelling.',
    guild_leader: 'Arcanis',
    status: 'private',
    language: 'German',
    tags: ['roleplaying', 'casual'],
    region: 'EU',
    socials: {
      discord: 'https://discord.gg/stormcallers',
      instagram: 'https://instagram.com/stormcallers_guild',
    },
  },
  {
    name: 'Bloodmoon Reavers',
    description: 'PvP-focused guild with regular organized battles and duels.',
    guild_leader: 'Thalric',
    status: 'public',
    language: 'Russian',
    tags: ['pvp', 'hardcore'],
    region: 'EU',
    socials: {
      discord: 'https://discord.gg/bloodmoonreavers',
      twitch: 'https://twitch.tv/bloodmoonreavers',
    },
  },
  {
    name: 'Mystic Vanguard',
    description:
      'A multi-purpose guild offering PvX activities and regular events.',
    guild_leader: 'Sylphira',
    status: 'public',
    language: 'French',
    tags: ['pvx', 'casual', 'roleplaying'],
    region: 'OCE',
    socials: {
      twitter: 'https://twitter.com/mysticvanguard',
      facebook: 'https://facebook.com/mysticvanguard',
    },
  },
  {
    name: 'Eternal Shadows',
    description:
      'A private guild focused on PvE progression and cooperative gameplay.',
    guild_leader: 'Ravenna',
    status: 'private',
    language: 'English',
    tags: ['pve', 'hardcore'],
    region: 'NA',
    socials: {
      youtube: 'https://youtube.com/eternalshadows',
      twitch: 'https://twitch.tv/eternalshadowsguild',
    },
  },
  {
    name: 'Frostguard Legion',
    description:
      'PvP guild known for its battleground dominance in the EU region.',
    guild_leader: 'Bjorn',
    status: 'public',
    language: 'German',
    tags: ['pvp', 'hardcore'],
    region: 'EU',
    socials: {
      discord: 'https://discord.gg/frostguardlegion',
      twitter: 'https://twitter.com/frostguardlegion',
    },
  },
  {
    name: 'Shadow Stalkers',
    description: 'A guild of elite assassins specializing in PvP.',
    guild_leader: 'Venom',
    status: 'private',
    language: 'English',
    tags: ['pvp', 'roleplaying'],
    region: 'NA',
    socials: {
      facebook: 'https://facebook.com/shadowstalkers',
      instagram: 'https://instagram.com/shadowstalkersguild',
    },
  },
  {
    name: 'The Ironclad Brotherhood',
    description: 'PvX guild with a focus on teamwork and community building.',
    guild_leader: 'Rurik',
    status: 'public',
    language: 'Russian',
    tags: ['pvx', 'casual'],
    region: 'EU',
    socials: {
      discord: 'https://discord.gg/ironcladbrotherhood',
      youtube: 'https://youtube.com/ironcladbrotherhood',
    },
  },
  {
    name: 'Phoenix Rising',
    description: 'Roleplaying guild with a strong focus on lore and immersion.',
    guild_leader: 'Aelion',
    status: 'private',
    language: 'French',
    tags: ['roleplaying', 'casual'],
    region: 'EU',
    socials: {
      twitter: 'https://twitter.com/phoenixrisingguild',
      instagram: 'https://instagram.com/phoenixrisingrp',
    },
  },
  {
    name: 'Dragon’s Maw',
    description:
      'PvE guild with high ambitions of completing every dungeon and raid.',
    guild_leader: 'Drakthul',
    status: 'public',
    language: 'English',
    tags: ['pve', 'hardcore'],
    region: 'NA',
    socials: {
      discord: 'https://discord.gg/dragonsmaw',
      youtube: 'https://youtube.com/dragonsmaw',
    },
  },
  {
    name: 'Nightfall Covenant',
    description: 'An exclusive PvE and roleplaying guild for serious players.',
    guild_leader: 'Sylara',
    status: 'private',
    language: 'German',
    tags: ['pve', 'roleplaying'],
    region: 'EU',
    socials: {
      twitch: 'https://twitch.tv/nightfallcovenant',
      discord: 'https://discord.gg/nightfallcovenant',
    },
  },
  {
    name: 'Oathbound Sentinels',
    description:
      'PvP guild focusing on large-scale battles and territory control.',
    guild_leader: 'Kael',
    status: 'public',
    language: 'Russian',
    tags: ['pvp', 'hardcore'],
    region: 'EU',
    socials: {
      facebook: 'https://facebook.com/oathboundsentinels',
      twitch: 'https://twitch.tv/oathboundsentinels',
    },
  },
  {
    name: 'Silverhand Vanguard',
    description:
      'PvX guild open to both casual and hardcore players with varied interests.',
    guild_leader: 'Thorne',
    status: 'public',
    language: 'English',
    tags: ['pvx', 'casual', 'roleplaying'],
    region: 'NA',
    socials: {
      twitter: 'https://twitter.com/silverhandvanguard',
      instagram: 'https://instagram.com/silverhandvanguard',
    },
  },
  {
    name: 'Crimson Banner',
    description:
      'A high-level PvE guild focused on achieving world-first raid clears.',
    guild_leader: 'Zarkon',
    status: 'private',
    language: 'French',
    tags: ['pve', 'hardcore'],
    region: 'EU',
    socials: {
      youtube: 'https://youtube.com/crimsonbanner',
      discord: 'https://discord.gg/crimsonbanner',
    },
  },
  {
    name: 'Forsaken Riders',
    description:
      'PvP guild known for organized raids and domination in battlegrounds.',
    guild_leader: 'Darkon',
    status: 'public',
    language: 'English',
    tags: ['pvp', 'hardcore'],
    region: 'NA',
    socials: {
      twitch: 'https://twitch.tv/forsakenriders',
      twitter: 'https://twitter.com/forsakenriders',
    },
  },
  {
    name: 'Everwatch',
    description:
      'A friendly PvX guild for all players, focusing on enjoying the game.',
    guild_leader: 'Galdor',
    status: 'public',
    language: 'German',
    tags: ['pvx', 'casual'],
    region: 'EU',
    socials: {
      discord: 'https://discord.gg/everwatch',
      facebook: 'https://facebook.com/everwatchguild',
    },
  },
  {
    name: 'Shadow Phoenix',
    description: 'A private guild for roleplayers who enjoy PvE content.',
    guild_leader: 'Vellara',
    status: 'private',
    language: 'French',
    tags: ['roleplaying', 'pve'],
    region: 'OCE',
    socials: {
      youtube: 'https://youtube.com/shadowphoenix',
      instagram: 'https://instagram.com/shadowphoenixguild',
    },
  },
  {
    name: 'Lionheart Crusaders',
    description:
      'Hardcore PvE guild focusing on high-end content and world-first clears.',
    guild_leader: 'Cedric',
    status: 'public',
    language: 'English',
    tags: ['pve', 'hardcore'],
    region: 'NA',
    socials: {
      discord: 'https://discord.gg/lionheartcrusaders',
      youtube: 'https://youtube.com/lionheartcrusaders',
    },
  },
  {
    name: 'Flameguard Order',
    description:
      'PvP guild focused on elite, high-level dueling and ranked matches.',
    guild_leader: 'Doran',
    status: 'private',
    language: 'Russian',
    tags: ['pvp', 'hardcore'],
    region: 'EU',
    socials: {
      twitter: 'https://twitter.com/flameguardorder',
      discord: 'https://discord.gg/flameguardorder',
    },
  },
  {
    name: 'The Azure Syndicate',
    description:
      'PvX guild offering both casual and competitive play for all players.',
    guild_leader: 'Aliera',
    status: 'public',
    language: 'French',
    tags: ['pvx', 'casual'],
    region: 'EU',
    socials: {
      twitch: 'https://twitch.tv/azuresyndicate',
      facebook: 'https://facebook.com/azuresyndicate',
    },
  },
];

export default guilds;

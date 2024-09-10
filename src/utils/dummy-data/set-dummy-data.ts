// import { createCreatorDB } from '../../services/db-services/creator-db-services/create-creator.service';
// import createGuildDB from '../../services/db-services/guild-db-services/create-guild.service';
// import createUserDB from '../../services/db-services/user-db-services/create-user.service';
// import creators from './data/dummy-creators-2';
// import guilds from './data/dummy-guilds';
// import users from './data/dummy-users';
// import bcrypt from 'bcrypt';

// export const setDummyUsers = async () => {
//   try {
//     for (const user of users) {
//       const hashedPassword = await bcrypt.hash(user.password, 10);
//       const userWithHashedPassword = {
//         ...user,
//         password: hashedPassword,
//       };
//       await createUserDB(userWithHashedPassword);
//     }
//   } catch (error) {
//     throw error;
//   }
// };

// export const setDummyCreators = async () => {
//   try {
//     for (const creator of creators) {
//       await createCreatorDB(creator);
//     }
//   } catch (error) {
//     throw error;
//   }
// };

// export const setDummyGuilds = async () => {
//   try {
//     for (const guild of guilds) {
//       await createGuildDB(guild);
//     }
//   } catch (error) {
//     throw error;
//   }
// };

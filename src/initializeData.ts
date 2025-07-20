import { collection, getDocs, addDoc, query, limit } from 'firebase/firestore';
import { db } from './firebaseConfig';
import lineupData from '../data/line_up.json';

export async function initializeLineupData() {
  try {
    // Check if the lineup collection already has data
    const lineupRef = collection(db, 'lineup');
    const snapshot = await getDocs(query(lineupRef, limit(1)));

    if (!snapshot.empty) {
      console.log('Lineup data already exists in Firestore');
      return;
    }

    console.log('Initializing lineup data in Firestore...');

    // Add each artist to the Firestore collection
    const promises = lineupData.lineup.map(async artist => {
      try {
        await addDoc(lineupRef, {
          id: artist.id,
          artist: artist.artist,
          genre: artist.genre,
          desc: artist.desc,
          day: artist.day,
          ratings: artist.ratings,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      } catch (error) {
        console.error(`Error adding artist ${artist.artist}:`, error);
      }
    });

    await Promise.all(promises);
    console.log(
      `Successfully added ${lineupData.lineup.length} artists to Firestore`,
    );
  } catch (error) {
    console.error('Error initializing lineup data:', error);
  }
}

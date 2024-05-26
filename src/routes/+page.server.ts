import { env } from '$env/dynamic/private';

export const load = async ({ fetch }) => {
  const response = await fetch("https://www.emfcamp.org/schedule/2024.json");
  const schedule = await response.json();
  console.log(`Fetched ${schedule.length} events.`);

  let faves: number[] = [];

  if (env.FAVES_URL) {
    const response = await fetch(env.FAVES_URL);
    try {
      faves = (await response.json()).map((f: { id: number }) => f.id);
      console.log(`Fetched ${faves.length} faves.`);
    } catch (e) {
      console.log(e);
    }
  }

  return {
    schedule,
    faves,
  };
};
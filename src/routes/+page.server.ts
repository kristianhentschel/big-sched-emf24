import { building } from '$app/environment';

export const load = async ({ fetch }) => {
  let faves: number[] = [];

  if (!building) {
    const { env } = await import('$env/dynamic/private');

    if (env.FAVES_URL) {
      const response = await fetch(env.FAVES_URL);
      try {
        faves = (await response.json()).map((f: { id: number }) => f.id);
        console.log(`Fetched ${faves.length} faves.`);
      } catch (e) {
        console.log(e);
      }
    } else {
      console.log("Not loading faves because FAVES_URL is not set");
    }
  } else {
    console.log("Not loading faves because rendering a static site");
  }

  return {
    faves,
  };
};
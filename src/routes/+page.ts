export const load = async ({ fetch }) => {
  const response = await fetch("https://www.emfcamp.org/schedule/2024.json");
  const schedule = await response.json();
  console.log(`fetched ${schedule.length} event`);
  return {
    schedule,
  };
};
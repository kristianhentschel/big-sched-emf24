<script lang="ts">
  import { browser } from "$app/environment";
  import ScheduleView from "$lib/ScheduleView.svelte";
  import { onMount } from "svelte";

  export let data;

  const { schedule } = data;
  let { faves } = data;

  type View = { [key: string]: { [key: string]: boolean } };

  let view: View = {
    venues: {
      "Stage A": true,
      "Stage B": true,
      "Stage C": true,
    },
    days: {
      "2024-05-30": true,
      "2024-05-31": true,
      "2024-06-01": true,
      "2024-06-02": true,
    },
    types: {
      performance: true,
      talk: true,
      workshop: true,
      youthworkshop: true,
    },
  };

  let mounted = false;
  const updateHash = (view: View) => {
    if (!browser || !mounted) return;

    const params = new URLSearchParams();

    for (const key of ["venues", "days", "types"]) {
      if (key in view) {
        params.set(
          key,
          Object.keys(view[key])
            .filter((v) => view[key][v])
            .join(","),
        );
      }
    }

    location.hash = params.toString();
  };

  $: updateHash(view);

  let liveFaves = false;
  onMount(() => {
    if (browser && location.hash) {
      try {
        const params = new URLSearchParams(`?${location.hash.slice(1)}`);
        const newView: typeof view = {};
        for (const key of ["venues", "days", "types"]) {
          if (params.has(key)) {
            newView[key] = {};
            for (const value of params.get(key)?.split(",") ?? []) {
              newView[key][value] = true;
            }
          }
        }
        view = newView;
      } catch (e) {
        console.log("failed to parse hash");
      }
    }
    mounted = true;
    updateHash(view);
  });

  let localFaves = false;
  const localFavesKey = "bigsched.faves";

  const clearLocalFaves = () => {
    window.localStorage.removeItem(localFavesKey);
    faves = [];
    localFaves = false;
  };

  onMount(async () => {
    if (faves?.length) {
      liveFaves = true;
    } else {
      try {
        const tmp = window.localStorage.getItem(localFavesKey);
        if (tmp) {
          faves = (JSON.parse(tmp) as number[]).filter((f) =>
            Number.isInteger(f),
          );
          localFaves = true;
          console.log(
            `Restored ${faves.length} favourites from local storage.`,
          );
        }
      } catch (e) {
        clearLocalFaves();
      }
    }
  });

  let favesFile: FileList;
  const handleLoadFaves = async (e: Event) => {
    e.preventDefault();

    if (!favesFile?.length) {
      return;
    }

    const result = (await new Promise((resolve, reject) => {
      const f = favesFile[0];
      console.log(favesFile);
      const reader = new FileReader();
      reader.readAsText(f);
      reader.addEventListener("load", () => {
        try {
          resolve(JSON.parse(reader.result as string));
        } catch (e) {
          reject(e);
        }
      });
    })) as { id: number }[];

    faves = result.map(({ id }) => id);
    window.localStorage.setItem(localFavesKey, JSON.stringify(faves));
    localFaves = true;
    console.log(`Imported ${faves.length} favourites from file.`);
  };
</script>

<svelte:head>
  <title>EMF 2024 BigSched</title>
</svelte:head>

<ScheduleView {schedule} {faves} bind:view />

<p>
  More info on <a href="https://github.com/kristianhentschel/big-sched-emf24"
    >GitHub</a
  >. Made by Kristian Hentschel. This is a quick hack - no warranties of any
  kind implied. I take no responsibility for the consequences or lack thereof of
  relying on this page. View the
  <a href="https://www.emfcamp.org/schedule/2024"
    >the official schedule at emfcamp.org</a
  >.
</p>

{#if !liveFaves}
  <h1>Favourites</h1>

  <form on:submit={handleLoadFaves}>
    <p>
      If you're logged in to the EMF site, go to <a
        href="https://www.emfcamp.org/favourites"
        target="_blank">Favourites</a
      > and download a copy of the JSON feed. Then load that file below. This step
      has to be repeated every time you add something to your favourites. This site
      remembers the IDs of your favourites in your browser local storage for next
      time.
    </p>
    <p>
      <label
        >Load favourites.json: <input
          type="file"
          bind:files={favesFile}
          on:change={handleLoadFaves}
          accept=".json"
        /></label
      >
    </p>
    <p>
      <button type="submit">Import</button>
      {#if localFaves}
        <button type="button">Clear</button>
      {/if}
    </p>
  </form>
{/if}

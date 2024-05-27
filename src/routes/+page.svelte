<script lang="ts">
  import { browser } from "$app/environment";
  import ScheduleView from "$lib/ScheduleView.svelte";
  import { onMount } from "svelte";

  export let data;

  const { schedule, faves } = data;

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
      mounted = true;
    }
  });

  /*
  let favUrl: string | undefined;
  let favourites: number[];

  const loadFavourites = async () => {
    if (!favUrl) return;

    const response = await fetch(favUrl);
    const favourites = (await response.json()).map((f: { id: number }) => f.id);
  };

  const clearFavUrl = () => {
    favUrl = undefined;
    favourites = [];

    window.localStorage.removeItem("favUrl");
  };

  const handleLoadFavourites = (e) => {
    e.preventDefault();

    loadFavourites();
  };

  onMount(async () => {
    try {
      const tmp = window.localStorage.getItem("favUrl");
      if (tmp && new URL(tmp)) {
        favUrl = favUrl;
        await loadFavourites();
      }
    } catch (e) {
      clearFavUrl();
    }
  });
  */
</script>

<svelte:head>
  <title>EMF 2024 BigSched</title>
</svelte:head>

<ScheduleView {schedule} {faves} {view} />

<!--
<h1>Favourites</h1>

<form on:submit={handleLoadFavourites}>
  <p>
    <label>Paste JSON feed URL: <input type="text" bind:value={favUrl} /></label
    >
    <button type="submit">load</button>
    {#if favUrl}
      <button type="button">clear</button>
    {/if}
  </p>
  <p>
    e.g. <code
      >https://www.emfcamp.org/favourites.json?token=xxxx-xxxxxxxxxxxx</code
    >
  </p>
</form>
-->

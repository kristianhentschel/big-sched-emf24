<script lang="ts">
  import ScheduleView from "$lib/ScheduleView.svelte";
  import { onMount } from "svelte";

  export let data;

  const { schedule, faves } = data;

  let view = {
    venues: {
      "Stage A": true,
      "Stage B": true,
      "Stage C": true,
    },
  };

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

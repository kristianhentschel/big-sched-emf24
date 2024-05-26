<script lang="ts">
  import { DateTime } from "luxon";
  import { readSchedule } from "./schedule";
  import { onMount } from "svelte";

  export let schedule;
  export let view;

  if (!view.venues) {
    view.venues = {};
  }

  if (!view.days) {
    view.days = {};
  }

  $: ({ days, venues, events } = readSchedule(schedule));

  $: filteredEvents = events.filter(
    (e) =>
      view?.days?.[e.start.toISODate() ?? "none"] && view?.venues?.[e.venue],
  );

  const dayStart: { [key: string]: number } = {};
  const dayEnd: { [key: string]: number } = {};

  $: filteredEvents.forEach((event) => {
    const day = event.start.toISODate() ?? "none";
    if (!dayStart[day] || event.start.toMillis() < dayStart[day]) {
      dayStart[day] = event.start.toMillis();
    }
    if (!dayEnd[day] || event.end.toMillis() > dayEnd[day]) {
      dayEnd[day] = event.end.toMillis();
    }
    // console.log(`${event.title} ${event.end_time}, ${event.end.toMillis()}`);
  });

  const formatDay = (day: string) =>
    DateTime.fromISO(day).toLocaleString({
      ...DateTime.DATE_SHORT,
      weekday: "long",
    });

  let now_millis = 0;

  onMount(() => {
    const updateNow = () => {
      now_millis = DateTime.now().plus({ days: 4 }).toMillis();
    };

    const t = setInterval(updateNow, 6000);

    return () => {
      clearInterval(t);
    };
  });
</script>

<h1>ScheduleView</h1>

<h2>Events</h2>

{#each days.filter((d) => view.days[d]) as day (day)}
  <h3>{formatDay(day)}</h3>
  <div
    class="day"
    style="--day-start-millis: {dayStart[day]}; --day-end-millis: {dayEnd[
      day
    ]}; now-millis: {now_millis}"
  >
    {#each venues.filter((v) => view.venues[v]) as venue (venue)}
      <div class="venue-wrapper">
        <h4>{venue}</h4>
        <div class="venue">
          {#if dayStart[day] <= now_millis && now_millis <= dayEnd[day]}
            <hr class="now" />
          {/if}
          {#each filteredEvents.filter((e) => e.venue === venue && e.start.toISODate() === day) as event (event.id)}
            <div
              class="event type-{event.type}"
              class:fave={event.is_fave}
              class:not-recorded={!event.may_record}
              style="--start-millis: {event.start.toMillis()}; --end-millis: {event.end.toMillis()}"
            >
              <h5 class="title">
                <a href={event.link} target="_blank" tabindex="0"
                  >{event.title}</a
                >
              </h5>
              <p class="times">
                {event.start.toLocaleString({ weekday: "short" })}
                {event.start_time}-{event.end_time}
              </p>

              <p class="speaker">{event.speaker}</p>
              <p class="description">{event.description}</p>
            </div>
          {/each}
        </div>
      </div>
    {/each}
  </div>
{/each}

<h2>Venues</h2>
<ul>
  {#each venues as venue (venue)}
    <li>
      <label>
        <input type="checkbox" name={venue} bind:checked={view.venues[venue]} />
        {venue}
      </label>
    </li>
  {/each}
</ul>

<h2>Days</h2>
<ul>
  {#each days as day (day)}
    <li>
      <label>
        <input type="checkbox" name={day} bind:checked={view.days[day]} />
        {formatDay(day)}
      </label>
    </li>
  {/each}
</ul>

<style lang="scss">
  :global(html, body) {
    font-family: sans-serif;
    font-size: 10pt;
  }

  $scale: calc(
    1.25 * 6rem / 3600 / 1000
  ); // 6 lines per hour, most talks need 2 lines and are 20 minutes long

  .day {
    display: flex;
    flex-direction: row;
    gap: 8px;
    width: 100%;
  }

  .venue-wrapper {
    width: 100%;
    flex-shrink: 1;
    max-width: 20em;
  }

  .venue {
    display: flex;
    flex-direction: column;
    position: relative;
    height: calc((var(--day-end-millis) - var(--day-start-millis)) * $scale);
  }

  .event {
    display: flex;
    flex-direction: column;
    padding: 4px;
    width: 100%;
    box-sizing: border-box;
    overflow: hidden;

    background: #fed;
    border: 1px solid #fc3;

    &.fave {
      background: #fcc;
      border: 2px double #f33;
    }

    &.not-recorded {
      background: #eee;
      border: 1px dashed #00f;
    }

    .title {
      margin: 0;
      font-size: 1rem;
      font-weight: bold;
      line-height: 1.2;
      margin-bottom: 0.2em;
    }

    p {
      margin: 0.2rem 0;
      font-size: 0.8rem;
    }

    .times {
      color: #333;
    }

    .speaker {
      font-weight: bold;
    }

    .description {
    }

    position: absolute;
    top: calc((var(--start-millis) - var(--day-start-millis)) * $scale);
    $height: calc((var(--end-millis) - var(--start-millis)) * $scale);
    height: $height;
    transform: scale(1);
    box-shadow: 4px 4px rgba(0, 0, 0, 0);

    transition: all 0.1s ease-out;

    &:hover,
    &:focus-within {
      z-index: 100;
      height: auto;
      min-height: $height;
      transform: scale(1.01);
      box-shadow: 4px 4px rgba(0, 0, 0, 0.5);
    }
  }

  .now {
    position: absolute;
    top: calc((var(--now-millis) - var(--day-start-millis)) * $scale);
    border: none;
    border-top: 1px solid red;
    margin: 0;
    margin-top: -1px;
  }
</style>

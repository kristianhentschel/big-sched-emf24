<script lang="ts">
  import ical from "ical";
  import { DateTime } from "luxon";
  import ScheduleView from "$lib/ScheduleView.svelte";

  export let data;

  const { schedule } = data;

  let view = {
    venues: {
      "Stage A": true,
      "Stage B": true,
      "Stage C": true,
    },
  };
</script>

<ScheduleView {schedule} {view} />

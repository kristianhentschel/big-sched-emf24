import { DateTime } from "luxon";

const zone = "Europe/London";
const format = "yyyy-MM-dd hh:mm:ss";

type ScheduleEvent = {
  id: number,
  slug: string,
  start_date: string,
  end_date: string,
  venue: string,
  latlon: number[],
  map_link: string,
  title: string,
  speaker: string,
  pronouns: string,
  user_id: number,
  description: string,
  type: string,
  // may_record: boolean,
  is_fave: boolean,
  is_family_friendly: boolean,
  is_from_cfp: boolean,
  content_note: string,
  source: string,
  link: string,
  video: {
    recording_lost: null
  },
  video_privacy: "none" | "public" | "review" | undefined,
  start_time: string,
  end_time: string,
};

type Schedule = ScheduleEvent[]

export const readSchedule = (data: Schedule): {
  days: string[],
  venues: string[],
  types: string[],
  events: (ScheduleEvent & {
    start: DateTime,
    end: DateTime,
    day: string,
  })[],
} => {
  const days: Set<string> = new Set();
  const venues: Set<string> = new Set();
  const types: Set<string> = new Set();
  const events = [];

  for (const event of data) {
    const { start_date, end_date, venue } = event;

    const start = DateTime.fromFormat(start_date, format, { zone });
    const end = DateTime.fromFormat(end_date, format, { zone });
    const day = start.minus({ hours: 2 }).toISODate() ?? 'none'; // assume that nothing is scheduled to start after 2am the next morning

    days.add(day);
    venues.add(venue);
    types.add(event.type);

    events.push({
      ...event,
      start,
      end,
      day,
    });
  }

  return {
    days: [...days].sort(),
    venues: [...venues].sort(),
    types: [...types].sort(),
    events: events.sort((a, b) => a.start.toMillis() - b.start.toMillis()),
  }
}
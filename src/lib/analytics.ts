type EventData = Record<string, string | number>;

export function track(event: string, data?: EventData) {
  if (typeof window !== "undefined" && typeof (window as any).umami !== "undefined") {
    (window as any).umami.track(event, data);
  }
}

import * as chrono from "chrono-node";

export const extractDateRange = (chronoQuery) => {
  if (!chronoQuery) {
    throw new Error("missing_date");
  }

  const results = chrono.parse(
    chronoQuery,
    new Date(),
    { forwardDate: true }
  );

  if (!results || results.length === 0) {
    throw new Error("invalid_date");
  }

  if (results.length > 1) {
    throw new Error("ambiguous_date");
  }

  const result = results[0];

  const fromDate = result.start.date();
  const toDate = result.end
    ? result.end.date()
    : result.start.date();

  return {
    from: fromDate,
    to: toDate,
    sqlFrom: fromDate.toISOString().split("T")[0],
    sqlTo: toDate.toISOString().split("T")[0],
    raw: chronoQuery,
    source: "chrono-node",
  };
};

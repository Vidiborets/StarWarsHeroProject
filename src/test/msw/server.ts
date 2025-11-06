import { setupServer } from "msw/node";
import { http, HttpResponse } from "msw";

const BASE = "https://sw-api.starnavi.io";

export const handlers = [
  http.get(`${BASE}/people/`, () =>
    HttpResponse.json({
      count: 1,
      next: null,
      previous: null,
      results: [
        {
          id: 1,
          name: "Luke Skywalker",
          films: ["/films/1/"],
          starships: ["/starships/12/"],
        },
      ],
    })
  ),
  http.get(`${BASE}/people/:id/`, ({ params }) =>
    HttpResponse.json({
      id: Number(params.id),
      name: "Luke Skywalker",
      films: ["/films/1/"],
      starships: ["/starships/12/"],
    })
  ),
  http.get(`${BASE}/films/1/`, () =>
    HttpResponse.json({ id: 1, title: "A New Hope", url: `${BASE}/films/1/` })
  ),
  http.get(`${BASE}/starships/12/`, () =>
    HttpResponse.json({ id: 12, name: "X-wing", url: `${BASE}/starships/12/` })
  ),
];

export const server = setupServer(...handlers);

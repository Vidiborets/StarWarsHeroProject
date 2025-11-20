import * as React from "react";
import { render } from "@testing-library/react";
import HeroCard from "@/features/people/components/HeroCard";
import type { Person } from "@/features/types/types";

// Use manual mocks from __mocks__
jest.mock("@/test/mocks/link");
jest.mock("@/test/mocks/LazyImage");

const basePerson: Person = {
  id: 21,
  name: "Palpatine",
  height: "170",
  mass: "75",
  hairColor: "grey",
  skinColor: "pale",
  eyeColor: "yellow",
  birthYear: "82BBY",
  gender: "male",
  homeworld: 8,
  films: [2, 3, 4, 5, 6],
  species: [1],
  starships: [],
  vehicles: [],
};

describe("HeroCard", () => {
  it("renders name below image and inside overlay", () => {
    const { getAllByText } = render(<HeroCard p={basePerson} />);

    const all = getAllByText("Palpatine");

    // Title under image
    expect(
      all.some(
        (n: {
          closest: (arg0: string) => {
            (): void;
            new (): void;
            className: string | string[];
          };
        }) => n.closest("strong")?.className.includes("text-lg")
      )
    ).toBe(true);

    // Name in overlay
    expect(
      all.some(
        (n: {
          closest: (arg0: string) => {
            (): void;
            new (): void;
            className: string | string[];
          };
        }) => n.closest("p")?.className.includes("font-semibold")
      )
    ).toBe(true);
  });

  it("links to /hero/{id}", () => {
    const { getByRole } = render(<HeroCard p={basePerson} />);
    const link = getByRole("link");
    expect(link).toHaveAttribute("href", "/hero/21");
  });

  it("builds correct image src and alt", () => {
    const { getByRole } = render(<HeroCard p={basePerson} />);

    const img = getByRole("img", {
      name: /Palpatine/i,
    }) as HTMLImageElement;

    const expectedSrc = `/api/images/character/21?name=${encodeURIComponent(
      "Palpatine"
    )}`;

    expect(img.src).toContain(expectedSrc);
    expect(img.alt).toBe("Palpatine");
  });

  it("shows attribute labels and values", () => {
    const { getByText } = render(<HeroCard p={basePerson} />);

    // labels
    [
      "Height:",
      "Mass:",
      "Hair:",
      "Skin:",
      "Eyes:",
      "Birth:",
      "Gender:",
      "Films:",
    ].forEach((l) => {
      expect(getByText(new RegExp(l, "i"))).toBeInTheDocument();
    });

    // values
    ["170", "75", "grey", "pale", "yellow", "82BBY", "male"].forEach((v) => {
      expect(getByText(v)).toBeInTheDocument();
    });

    expect(getByText(String(basePerson.films!.length))).toBeInTheDocument();
  });

  it("DataRow prints '—' for empty/undefined", () => {
    const p: Person = {
      id: 7,
      name: "Boba Fett",
      height: undefined,
      mass: "",
      hairColor: null as unknown as string,
      skinColor: "tan",
      eyeColor: "brown",
      birthYear: undefined,
      gender: "male",
      homeworld: 10,
      films: undefined,
      species: [],
      starships: [],
      vehicles: [],
    };

    const { getByText } = render(<HeroCard p={p} />);

    const emptyRows = ["Height:", "Mass:", "Hair:", "Birth:", "Films:"];
    emptyRows.forEach((label) => {
      const row = getByText(new RegExp(label, "i")).parentElement!;
      expect(row).toHaveTextContent("—");
    });

    expect(getByText(/Skin:/i).parentElement!).toHaveTextContent("tan");
    expect(getByText(/Eyes:/i).parentElement!).toHaveTextContent("brown");
  });

  it("root element has 'card' and 'group' classes", () => {
    const { getByRole } = render(<HeroCard p={basePerson} />);
    const listItem = getByRole("listitem");
    expect(listItem.className).toContain("card");
    expect(listItem.className).toContain("group");
  });
});

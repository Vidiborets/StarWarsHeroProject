import * as React from "react";
import { render, screen } from "@testing-library/react";
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
  hair_color: "grey",
  skin_color: "pale",
  eye_color: "yellow",
  birth_year: "82BBY",
  gender: "male",
  homeworld: 8,
  films: [2, 3, 4, 5, 6],
  species: [1],
};

describe("HeroCard", () => {
  it("renders name below image and inside overlay", () => {
    render(<HeroCard p={basePerson} />);
    // Title under image
    expect(
      screen
        .getAllByText("Palpatine")
        .some((n) => n.closest("strong")?.className.includes("text-lg"))
    ).toBe(true);
    expect(
      screen
        .getAllByText("Palpatine")
        .some((n) => n.closest("p")?.className.includes("font-semibold"))
    ).toBe(true);
  });

  it("links to /hero/{id}", () => {
    render(<HeroCard p={basePerson} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/hero/21");
  });

  it("builds correct image src and alt", () => {
    render(<HeroCard p={basePerson} />);
    const img = screen.getByRole("img", {
      name: /Palpatine/i,
    }) as HTMLImageElement;
    const expectedSrc = `/api/images/character/21?name=${encodeURIComponent(
      "Palpatine"
    )}`;
    expect(img.src).toContain(expectedSrc);
    expect(img.alt).toBe("Palpatine");
  });

  it("shows attribute labels and values", () => {
    render(<HeroCard p={basePerson} />);
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
      expect(screen.getByText(new RegExp(l, "i"))).toBeInTheDocument();
    });
    // values
    ["170", "75", "grey", "pale", "yellow", "82BBY", "male"].forEach((v) => {
      expect(screen.getByText(v)).toBeInTheDocument();
    });
    expect(
      screen.getByText(String(basePerson.films!.length))
    ).toBeInTheDocument();
  });

  it("DataRow prints '—' for empty/undefined", () => {
    const p: Person = {
      id: 7,
      name: "Boba Fett",
      height: undefined,
      mass: "",
      hair_color: null as unknown as string,
      skin_color: "tan",
      eye_color: "brown",
      birth_year: undefined,
      gender: "male",
      homeworld: 10,
      films: undefined,
      species: [],
    };

    render(<HeroCard p={p} />);

    const emptyRows = ["Height:", "Mass:", "Hair:", "Birth:", "Films:"];
    emptyRows.forEach((label) => {
      const row = screen.getByText(new RegExp(label, "i")).parentElement!;
      expect(row).toHaveTextContent("—");
    });

    expect(screen.getByText(/Skin:/i).parentElement!).toHaveTextContent("tan");
    expect(screen.getByText(/Eyes:/i).parentElement!).toHaveTextContent(
      "brown"
    );
  });

  it("root element has 'card' and 'group' classes", () => {
    render(<HeroCard p={basePerson} />);
    const listItem = screen.getByRole("listitem");
    expect(listItem.className).toContain("card");
    expect(listItem.className).toContain("group");
  });
});

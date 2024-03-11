export type Area = {
  id: number;
  name: string;
};

export type Level = {
  id: number;
  name: string;
  areas: Area[];
};

export type FullBuilding = {
  id: number;
  name: string;
  levels: Level[];
};

export type Building = {
  id: number;
  name: string;
};

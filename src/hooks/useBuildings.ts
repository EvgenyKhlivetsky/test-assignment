import { useEffect, useState } from "react";

import buildingsJson from "../example-data.json";
import { Area, Building, FullBuilding, Level } from "../types";

const fullBuildings = buildingsJson.buildings as FullBuilding[];
const fetchedBuildings = fullBuildings?.map((building) => {
  return {
    ...building,
    levels: undefined,
  };
});

const sleep = () => {
  const timeToSleep = Math.random() * 1000;
  return new Promise((resolve) => setTimeout(resolve, timeToSleep));
};
const failRandomly = () => {
  if (Math.random() < 0.25) {
    throw new Error("Random error");
  }
};
/*
 everything here is a bit messy, cause I'm trying to simulate a real-world scenario and thus I need
 to simulate data fetch in parts (buildings, levels, areas) and also simulate loading states
*/
export const useBuildings = () => {
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [levels, setLevels] = useState<Record<string, Level[]>>({});
  const [areas, setAreas] = useState<Record<string, Area[]>>({});

  const [loading, setLoading] = useState<{
    buildings: boolean;
    levels: Record<string, boolean>;
    areas: Record<string, boolean>;
  }>({
    buildings: false,
    levels: {},
    areas: {},
  });

  const fetchBuildings = async () => {
    setLoading({ ...loading, buildings: true });
    await sleep();
    setBuildings(fetchedBuildings);
    setLoading({ ...loading, buildings: false });
  };

  const fetchLevels = async (buildingId: number) => {
    try {
      setLoading((prev) => {
        return { ...prev, levels: { ...prev.levels, [buildingId]: true } };
      });
      await sleep();
      failRandomly();
      const building = fullBuildings.find((b) => b.id === buildingId);
      const buildingLevels = building?.levels;
      setLevels((prev) => {
        return { ...prev, [buildingId]: building?.levels };
      });
      setLoading((prev) => {
        return { ...prev, levels: { ...prev.levels, [buildingId]: false } };
      });
      return { success: true, levels: buildingLevels };
    } catch {
      alert("ooopsy, random error occured");
      setLoading((prev) => {
        return { ...prev, levels: { ...prev.levels, [buildingId]: false } };
      });
      return { success: false, levels: [] };
    }
  };

  const fetchAreas = async (levelId: number) => {
    try {
      setLoading((prev) => {
        return { ...prev, areas: { ...prev.levels, [levelId]: true } };
      });
      await sleep();
      failRandomly();
      const level = fullBuildings
        .map((b) => b.levels)
        .flat()
        .find((l) => l.id === levelId);

      setAreas((prev) => {
        return { ...prev, [levelId]: level?.areas || [] };
      });
      setLoading((prev) => {
        return { ...prev, areas: { ...prev.levels, [levelId]: false } };
      });
      return { success: true, areas: level?.areas || [] };
    } catch {
      alert("ooopsy, random error occured");
      setLoading((prev) => {
        return { ...prev, areas: { ...prev.levels, [levelId]: false } };
      });
      return { success: false, areas: [] };
    }
  };

  useEffect(() => {
    fetchBuildings();
  }, []);

  return {
    buildings,
    levels,
    areas,
    loading,
    fetchLevels,
    fetchAreas,
  };
};

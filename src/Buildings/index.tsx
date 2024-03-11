import { useCallback, useState } from "react";
import { FlatList, StyleSheet } from "react-native";

import { ExpandItem } from "./ExpandItem";
import { Input } from "../components/Input";
import { Spinner } from "../components/Spinner";
import { useBuildings } from "../hooks/useBuildings";
import { Area, Building } from "../types";

type CheckBoxes = Record<string, boolean>;

const Buildings = () => {
  const [expanded, setExpanded] = useState<number[]>([]);
  const [searchValue, setSearchValue] = useState<string>("");
  const { buildings, levels, areas, fetchAreas, fetchLevels, loading } =
    useBuildings();

  const [checked, setChecked] = useState<CheckBoxes>({});

  const onCheck = (id: number) => {
    const isBuilding = buildings.some((b) => b.id === id);
    const isLevel = Object.values(levels)
      ?.flat()
      .some((l) => l.id === id);
    if (isBuilding) {
      return setChecked((prev) => {
        const someLevelUnchecked = levels[id]?.some((l) => !prev[l.id]);
        const isChecked = prev[id];
        const newChecked = !(isChecked && !someLevelUnchecked);
        return {
          ...prev,
          [id]: newChecked,
          ...levels[id]?.reduce((acc, item) => {
            const curArr = areas[item.id];
            return {
              ...acc,
              ...curArr?.reduce((arrAcc, arrItem) => {
                return { ...arrAcc, [arrItem.id]: newChecked };
              }, {}),
              [item.id]: newChecked,
            };
          }, {}),
        };
      });
    }
    if (isLevel) {
      return setChecked((prev) => {
        const someAreaUnchecked = areas[id]?.some((a) => !prev[a.id]);
        const isChecked = prev[id];
        const newChecked = !(isChecked && !someAreaUnchecked);
        return {
          ...prev,
          [id]: newChecked,
          ...areas[id]?.reduce((acc, item) => {
            return { ...acc, [item.id]: newChecked };
          }, {}),
        };
      });
    }

    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const onExpandBuilding = async (id: number) => {
    if (expanded?.includes(id)) {
      setExpanded((prev) => prev?.filter((i) => i !== id));
      return;
    }
    // do not refetch levels if already fetched
    if (!levels[id]) {
      const { success, levels } = await fetchLevels(id);
      if (!success) {
        return;
      }
      if (checked[id] && levels) {
        setChecked((prev) => ({
          ...prev,
          ...levels.reduce((acc, item) => {
            return { ...acc, [item.id]: true };
          }, {}),
        }));
      }
    }
    setExpanded((prev) => {
      return prev?.includes(id)
        ? prev.filter((i) => i !== id)
        : [...(prev || []), id];
    });
  };

  const onExpandLevel = async (id: number) => {
    if (expanded?.includes(id)) {
      setExpanded((prev) => prev?.filter((i) => i !== id));
      return;
    }
    if (!areas[id]) {
      const { success, areas } = await fetchAreas(id);
      if (!success) {
        return;
      }
      if (checked[id]) {
        setChecked((prev) => ({
          ...prev,
          ...areas.reduce((acc, item) => {
            return { ...acc, [item.id]: true };
          }, {}),
        }));
      }
    }

    setExpanded((prev) => {
      return prev?.includes(id)
        ? prev.filter((i) => i !== id)
        : [...(prev || []), id];
    });
  };
  const onAreaPress = ({ name, id }: Area) => {
    alert(`Area ${name} with ID ${id} pressed`);
  };

  const onSearch = (text: string) => {
    setSearchValue(text);
  };

  const getCheckState = (
    id: number,
    field: "Building" | "Level" | "Area",
  ): "all" | "none" | "some" => {
    const isBuilding = field === "Building";
    const isLevel = field === "Level";
    if (isBuilding) {
      const someLevelUnchecked = levels[id]?.some((l) => !checked[l.id]);
      const everyLevelUnchecked = levels[id]?.every((l) => !checked[l.id]);
      const isChecked = checked[id];
      if (everyLevelUnchecked && levels[id]?.length > 0) {
        return "none";
      }
      if (someLevelUnchecked && levels[id]?.length > 0) {
        return "some";
      }
      return isChecked || (!someLevelUnchecked && levels[id]?.length > 0)
        ? "all"
        : "none";
    }
    if (isLevel) {
      const someAreaUnchecked = areas[id]?.some((a) => !checked[a.id]);
      const everyAreaUnchecked = areas[id]?.every((a) => !checked[a.id]);
      const isChecked = checked[id];
      if (everyAreaUnchecked && areas[id]?.length > 0) {
        return "none";
      }
      if (someAreaUnchecked && areas[id]?.length > 0) {
        return "some";
      }
      return isChecked || (!someAreaUnchecked && areas[id]?.length > 0)
        ? "all"
        : "none";
    }
    return checked[id] ? "all" : "none";
  };

  const renderItem = useCallback(
    ({ item }: { item: Building }) => {
      return (
        <ExpandItem
          onChangeCheck={() => onCheck(item.id)}
          checked={getCheckState(item.id, "Building")}
          isLoading={loading.levels[item.id]}
          name={item.name}
          onPress={() => onExpandBuilding(item.id)}
          backgroundColor="#FBC09380"
          spacingLeft={false}
        >
          {expanded?.includes(item.id) &&
            levels[item.id]?.map((level) => {
              return (
                <ExpandItem
                  onChangeCheck={() => {
                    onCheck(level.id);
                  }}
                  checked={getCheckState(level.id, "Level")}
                  backgroundColor="#FBC09366"
                  isLoading={loading.areas[level.id]}
                  key={level.id}
                  onPress={() => onExpandLevel(level.id)}
                  name={level.name}
                >
                  {expanded?.includes(level.id) &&
                    areas[level.id]?.map((area) => (
                      <ExpandItem
                        onChangeCheck={() => onCheck(area.id)}
                        checked={getCheckState(area.id, "Area")}
                        backgroundColor="#FBC093FF"
                        key={area.id}
                        name={area.name}
                        onPress={() => onAreaPress(area)}
                      />
                    ))}
                </ExpandItem>
              );
            })}
        </ExpandItem>
      );
    },
    [expanded, levels, areas, loading, checked],
  );

  if (loading.buildings) {
    return <Spinner />;
  }
  return (
    <>
      <FlatList
        ListHeaderComponent={
          <Input
            placeholder="Start typing building name"
            value={searchValue}
            onChangeText={onSearch}
          />
        }
        style={styles.container}
        contentContainerStyle={styles.contentContainerStyle}
        data={buildings.filter((b) => {
          // Assuming we have all buildings fetched already, we can simply filter here
          return b.name.toLowerCase().includes(searchValue.toLowerCase());
        })}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainerStyle: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
});

export default Buildings;

import * as d3 from 'd3';
import { STORM_EVENT_CATEGORIES } from '../data/constants';
import {
  GeoRegionUSType,
  SelectedDimensionsType,
  StateDataDimensions,
  StormDataType,
  StormEventCategoryType,
} from '../data/types';
import { fillMissingYears } from '../helpers';

export type RadarData = Array<
  {
    axis: string;
    value: number;
    state?: GeoRegionUSType;
    stormType?: StormEventCategoryType;
    formatFn?: (
      n:
        | number
        | {
            valueOf(): number;
          }
    ) => string;
  }[]
>;

type RadarWrangleProps = {
  data: StormDataType[];
  numberOfStates?: number;
  stateSelected?: GeoRegionUSType | 'ALL';
  selectedDimension: SelectedDimensionsType;
  yearFilter: [number, number] | null;
  eventFilter: StormEventCategoryType | 'ALL';
};
export const wrangleDataByTopXStates = ({
  data,
  numberOfStates = 3,
  stateSelected = null,
  selectedDimension = 'TOTAL_EVENTS',
  yearFilter = null,
  eventFilter = 'ALL',
}: RadarWrangleProps) => {
  // get the top states by selected metric

  const filteredData = filterData({ stormData: data, yearFilter });
  const dataGroupedByState = Array.from(
    d3.group(filteredData, (d) => d.STATE),
    ([key, value]) => ({ key, value })
  );

  const topStatesAggregateValues = getTopStatesByDimension({
    dataGroupedByState,
    selectedDimension,
    stateSelected,
    numberOfStates,
  });

  const radarData = formatStatesCountDataForRadarDisplay(topStatesAggregateValues);
  return radarData;
};

type FilterFnProps = {
  stormData: StormDataType[];
  yearFilter?: [number, number] | null;
  eventFilter?: StormEventCategoryType | 'ALL';
  stateSelected?: GeoRegionUSType | 'ALL';
};
export const filterData = ({
  stormData,
  yearFilter = null,
  eventFilter = 'ALL',
  stateSelected = 'ALL',
}: FilterFnProps) => {
  let filteredData: StormDataType[] = [];

  // if there is a region selected
  if (yearFilter || eventFilter || stateSelected) {
    stormData.forEach((row) => {
      const [yearMin, yearMax] = !!yearFilter ? yearFilter : [1950, 2022];

      // if 'ALL' then the condition is true ef not then check to see if we match
      const regionConditionIsTrue =
        stateSelected === 'ALL' ? true : row.STATE.toLowerCase() === stateSelected.toLowerCase();
      const eventConditionIsTrue = eventFilter === 'ALL' ? true : row.EVENT === eventFilter;
      const yearConditionIsTrue = yearMin <= row.YEAR && row.YEAR <= yearMax;

      if (yearConditionIsTrue && eventConditionIsTrue && regionConditionIsTrue) {
        filteredData.push(row);
      }
    });
  } else {
    filteredData = stormData;
  }

  return filteredData;
};

type GetTopStatesFnProps = {
  dataGroupedByState: {
    key: GeoRegionUSType;
    value: StormDataType[];
  }[];
  selectedDimension: SelectedDimensionsType;
  numberOfStates: number;
  stateSelected?: GeoRegionUSType | 'ALL';
};
export const getTopStatesByDimension = ({
  dataGroupedByState,
  selectedDimension,
  stateSelected,
  numberOfStates,
}: GetTopStatesFnProps): StateDataDimensions[] => {
  const stateData: StateDataDimensions[] = [];

  dataGroupedByState.forEach((state) => {
    const { key: stateName } = state;

    if (stateName as string === 'STATE') return;

    let DAMAGE_PROPERTY_EVENT_SUM = 0;
    let DEATHS_DIRECT_COUNT = 0;
    let DEATHS_INDIRECT_COUNT = 0;
    let DEATHS_TOTAL_COUNT = 0;
    let INJURIES_DIRECT_COUNT = 0;
    let TOTAL_EVENTS = 0;
    const COUNTS_BY_EVENT: Record<StormEventCategoryType, number> = {} as Record<
      StormEventCategoryType,
      number
    >;
    const DEATHS_BY_EVENT: Record<StormEventCategoryType, number> = {} as Record<
      StormEventCategoryType,
      number
    >;
    const DAMAGES_BY_EVENT: Record<StormEventCategoryType, number> = {} as Record<
      StormEventCategoryType,
      number
    >;

    // sum up the totals per state
    state.value.forEach((entry: StormDataType) => {
      const eventType = entry.EVENT || 'misc';

      DAMAGE_PROPERTY_EVENT_SUM += entry.DAMAGE_PROPERTY_EVENT_SUM;
      DEATHS_DIRECT_COUNT += entry.DEATHS_DIRECT_COUNT;
      DEATHS_INDIRECT_COUNT += entry.DEATHS_INDIRECT_COUNT;
      DEATHS_TOTAL_COUNT += entry.DEATHS_DIRECT_COUNT + entry.DEATHS_INDIRECT_COUNT;
      INJURIES_DIRECT_COUNT += entry.INJURIES_DIRECT_COUNT;
      TOTAL_EVENTS += entry.EVENT_COUNT;

      if (eventType in COUNTS_BY_EVENT) {
        COUNTS_BY_EVENT[eventType] += entry.EVENT_COUNT;
      } else {
        COUNTS_BY_EVENT[eventType] = entry.EVENT_COUNT;
      }

      if (eventType in DEATHS_BY_EVENT) {
        DEATHS_BY_EVENT[eventType] += entry.DEATHS_DIRECT_COUNT + entry.DEATHS_INDIRECT_COUNT;
      } else {
        DEATHS_BY_EVENT[eventType] = entry.DEATHS_DIRECT_COUNT + entry.DEATHS_INDIRECT_COUNT;
      }
      if (eventType in DAMAGES_BY_EVENT) {
        DAMAGES_BY_EVENT[eventType] += entry.DAMAGE_PROPERTY_EVENT_SUM;
      } else {
        DAMAGES_BY_EVENT[eventType] = entry.DAMAGE_PROPERTY_EVENT_SUM;
      }
    });

    stateData.push({
      STATE: stateName,
      DAMAGE_PROPERTY_EVENT_SUM,
      DEATHS_DIRECT_COUNT,
      DEATHS_INDIRECT_COUNT,
      DEATHS_TOTAL_COUNT,
      INJURIES_DIRECT_COUNT,
      TOTAL_EVENTS,
      // Aggregates of each storm type
      COUNTS_BY_EVENT,
      DEATHS_BY_EVENT,
      DAMAGES_BY_EVENT,
    });
  }); // end foreach

  stateData.sort((a, b) => b[selectedDimension] - a[selectedDimension]);

  // add in the selected state for comparision
  // regionSelected
  const isStateSelectedAccounted = stateData.some(
    (entry) => entry.STATE.toLowerCase() === stateSelected.toLowerCase()
  );

  const topStates = stateData.slice(0, numberOfStates); // top states cumulative values

  if (isStateSelectedAccounted && stateSelected !== 'ALL') {
    // if we dont have them accounted for find them and add them;
    const stateSelectedData = stateData.find(
      (entry) => entry.STATE.toLowerCase() === stateSelected.toLowerCase()
    );
    topStates.push(stateSelectedData);
  }

  return topStates;
};

export const formatStatesCountDataForRadarDisplay = (data: StateDataDimensions[]): RadarData => {
  const radarData = data.map((stateData) => {
    return [
      {
        axis: 'Total Storms',
        value: stateData.TOTAL_EVENTS,
        state: stateData.STATE,
        formatFn:
          stateData.TOTAL_EVENTS.toString().length > 5 ? d3.format('.2s') : d3.format('.0f'),
      },
      {
        axis: 'Deaths',
        value: stateData.DEATHS_TOTAL_COUNT,
        state: stateData.STATE,
        formatFn:
          stateData.DEATHS_TOTAL_COUNT.toString().length > 5 ? d3.format('.2s') : d3.format('.0f'),
      },
      {
        axis: 'Property Damage ',
        value: stateData.DAMAGE_PROPERTY_EVENT_SUM,
        state: stateData.STATE,
        formatFn:
          stateData.DAMAGE_PROPERTY_EVENT_SUM.toString().length > 5
            ? d3.format('.2s')
            : d3.format('.0f'),
      },
    ];
  });
  return radarData;
};

/**
 *
 * @param param0
 * @returns
 */
export const wrangleDataByStormEvents = ({
  data,
  stateSelected = null,
  selectedDimension = 'TOTAL_EVENTS',
  yearFilter = null,
  eventFilter = 'ALL',
  numberOfStates = 3,
}: RadarWrangleProps) => {
  // get the top states for selected metric
  console.log("here")

  const filteredData = filterData({ stormData: data, yearFilter });

  const dataGroupedByState = Array.from(
    d3.group(filteredData, (d) => d.STATE),
    ([key, value]) => ({ key, value })
  );

  const topStatesAggregateValues = getTopStatesByDimension({
    dataGroupedByState,
    selectedDimension,
    stateSelected,
    numberOfStates,
  });

  const radarData = formatStormEventsForRadar({
    data: topStatesAggregateValues,
    selectedDimension,
  });

  return radarData;
};

type AggregateEventFnProps = {
  stormDataGroupedByEvent: {
    key: StormEventCategoryType;
    value: StormDataType[];
  }[];
};
export const getAggregatedStormEventData = ({ stormDataGroupedByEvent }: AggregateEventFnProps) => {
  const aggregatedDataByStormEvent: {
    key: StormEventCategoryType;
    values: StateDataDimensions[];
  }[] = [];

  // Loop through each Event Category (tornado, hurricane, ...)
  stormDataGroupedByEvent.forEach((eventCategoryData) => {
    const { key: eventCategory } = eventCategoryData;

    if (!STORM_EVENT_CATEGORIES.includes(eventCategory)) return;

    // Group all of this event's data by year
    const eventsByYear = Array.from(
      d3.group(eventCategoryData.value, (d) => d.YEAR),
      ([year, value]) => ({ year, value })
    );

    const yearData: StateDataDimensions[] = [];

    // loop through each years data and aggregate the metrics/dimensions
    eventsByYear.forEach((entry) => {
      let DAMAGE_PROPERTY_EVENT_SUM = 0;
      let DEATHS_DIRECT_COUNT = 0;
      let DEATHS_INDIRECT_COUNT = 0;
      let DEATHS_TOTAL_COUNT = 0;
      let INJURIES_DIRECT_COUNT = 0;
      let TOTAL_EVENTS = 0;

      // entry.value is an array of all of the states that had a storm of X type and their count
      // now sum up the value of these counts from all of the state's entries
      entry.value.forEach((entry: StormDataType) => {
        DAMAGE_PROPERTY_EVENT_SUM += entry.DAMAGE_PROPERTY_EVENT_SUM;
        DEATHS_DIRECT_COUNT += entry.DEATHS_DIRECT_COUNT;
        DEATHS_INDIRECT_COUNT += entry.DEATHS_INDIRECT_COUNT;
        DEATHS_TOTAL_COUNT += entry.DEATHS_DIRECT_COUNT + entry.DEATHS_INDIRECT_COUNT;
        INJURIES_DIRECT_COUNT += entry.INJURIES_DIRECT_COUNT;
        TOTAL_EVENTS += entry.EVENT_COUNT;
      });

      yearData.push({
        EVENT_NAME: eventCategory,
        YEAR: entry.year,
        DAMAGE_PROPERTY_EVENT_SUM,
        DEATHS_DIRECT_COUNT,
        DEATHS_INDIRECT_COUNT,
        DEATHS_TOTAL_COUNT,
        INJURIES_DIRECT_COUNT,
        TOTAL_EVENTS,
      });
    }); // end event by year Loop

    // fill in missing values with 0's
    const [minYear, maxYear] = d3.extent(yearData, (d) => d.YEAR);
    const filledData = fillMissingYears(yearData, minYear, maxYear);

    const sortedData = [...filledData].sort((a, b) => b.YEAR - a.YEAR);

    aggregatedDataByStormEvent.push({
      key: eventCategory,
      values: sortedData,
    });
  }); // end events by category loop

  return aggregatedDataByStormEvent;
};

type FormatFnProps = {
  data: StateDataDimensions[];
  selectedDimension: SelectedDimensionsType;
};
const formatStormEventsForRadar = ({ data, selectedDimension }: FormatFnProps): RadarData => {
  const dimensionsPathMap: Record<SelectedDimensionsType, string> = {
    TOTAL_EVENTS: 'COUNTS_BY_EVENT',
    DEATHS_TOTAL_COUNT: 'DEATHS_BY_EVENT',
    DEATHS_DIRECT_COUNT: 'DEATHS_BY_EVENT',
    DEATHS_INDIRECT_COUNT: 'DEATHS_BY_EVENT',
    DAMAGE_PROPERTY_EVENT_SUM: 'DAMAGES_BY_EVENT',
    INJURIES_DIRECT_COUNT: 'DEATHS_BY_EVENT',
  };

  const radarData = data.map((d) => {
    const pathMap = dimensionsPathMap[selectedDimension];
    const ourMetrics = d[pathMap];

    STORM_EVENT_CATEGORIES.forEach((eventName) => {
      if (!ourMetrics[eventName]) ourMetrics[eventName] = 0;
    });

    return Object.entries(d[pathMap])
      .filter(([eventName, metric]) =>
        (STORM_EVENT_CATEGORIES as readonly string[]).includes(eventName)
      )
      .map(([eventName, metric]) => {
        return {
          axis: eventName,
          value: metric as number,
          state: d.STATE,
          formatFn: metric.toString().length > 5 ? d3.format('.2s') : d3.format('.0f'),
        };
      });
  });
  return radarData;
};

// get the top 3 states and plot their storms by selected metic

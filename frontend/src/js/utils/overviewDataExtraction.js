var moment = require("moment");

/**
 * This function extract and aggregate the overview data by type (confirmed, cured, etc), and
 * return them as a JSON array.
 *
 * @export
 * @param {*} overviewData Overview data.
 * @param {string} [targetState=""] Target state name (e.g. VIC), if it's national-wide, leave it as "".
 * @param {*} [datesRange=[]] An array of moment objects.
 * @param {boolean} [absoluteData=true] Flag indicating if we are extracting the absolute data, or just the relative data.
 * @param {boolean} [skipTested=true] Flag indicating if we are skipping the tested data.
 * @returns An json array containing the aggregated data.
 * @returns
 */
export function extractDataByTypeFromOverview(
  overviewData,
  targetState = "",
  datesRange = [],
  absoluteData = true,
  skipTested = true
) {
  const dataIndex = absoluteData ? 0 : 1;
  const extractedMapData = new Map();

  const [startDate, endDate] = extractStartAndEndDateFromArray(datesRange);

  const mostRecentDateObject = new Date(
    Math.max.apply(
      null,
      Object.keys(overviewData)
        .map((dateString) => new Date(dateString))
        .filter(
          (dateObj) =>
            true &&
            (startDate === null || dateObj >= startDate) &&
            (endDate === null || dateObj <= endDate)
        )
    )
  );

  const mostRecentDate = mostRecentDateObject
    ? moment(mostRecentDateObject.toString()).format("YYYY-MM-DD")
    : "";

  if (mostRecentDate) {
    for (let state in overviewData[mostRecentDate]) {
      if (targetState === "" || targetState === state) {
        for (let dataType in overviewData[mostRecentDate][state]) {
          if (skipTested && dataType === "Tested") {
            continue;
          }

          let dataOfTheType = 0;
          if (extractedMapData.has(dataType)) {
            dataOfTheType = extractedMapData.get(dataType);
          }

          if (dataType === "Tested") {
            dataOfTheType += overviewData[mostRecentDate][state][dataType];
          } else {
            dataOfTheType +=
              overviewData[mostRecentDate][state][dataType][dataIndex];
          }

          extractedMapData.set(dataType, dataOfTheType);
        }
      }
    }
  }

  const aggregatedData = [];
  extractedMapData.forEach((value, name) =>
    aggregatedData.push({ value, name })
  );

  // console.log("aggregatedData", aggregatedData);

  return aggregatedData;
}

/**
 * This function flatten the overview data, and return them as a JSON array.
 *
 * @export
 * @param {*} overviewData Overview data.
 * @param {string} [targetState=""] Target state name (e.g. VIC), if it's national-wide, leave it as "".
 * @param {*} [datesRange=[]] An array of moment objects.
 * @param {boolean} [absoluteData=true] Flag indicating if we are extracting the absolute data, or just the relative data.
 * @param {boolean} [skipTested=true] Flag indicating if we are skipping the tested data.
 * @returns
 */
export function extractAllDataByDateFromOverview(
  overviewData,
  targetState = "",
  datesRange = [],
  absoluteData = true,
  skipTested = true
) {
  const dataIndex = absoluteData ? 0 : 1;
  let flattenData = [];

  const [startDate, endDate] = extractStartAndEndDateFromArray(datesRange);

  for (let date in overviewData) {
    const dateObj = new Date(date);
    if (startDate && dateObj < startDate) {
      continue;
    }
    if (endDate && dateObj > endDate) {
      continue;
    }

    for (let state in overviewData[date]) {
      if (targetState === "" || targetState === state) {
        for (let type in overviewData[date][state]) {
          if (skipTested && type === "Tested") {
            continue;
          }

          const recordedObject = flattenData.find(
            (recordedData) => recordedData.date === date
          );

          const unchangedRecords = flattenData.filter(
            (recordedData) => recordedData.date !== date
          );

          let number = recordedObject ? recordedObject[type] || 0 : 0;
          if (type === "Tested") {
            number += overviewData[date][state][type];
          } else {
            number += overviewData[date][state][type][dataIndex];
          }

          flattenData = [
            ...unchangedRecords,
            { ...recordedObject, date, [type]: number },
          ];
        }
      }
    }
  }

  // console.log("flattenData =", flattenData);

  return flattenData;
}

/**
 * Given an array of moment objects, extract and parse it, to get an array
 * of Date objects, or null if the array is empty.
 *
 * @param {*} datesRange An array of moment objects.
 * @returns An array of Date objects.
 */
function extractStartAndEndDateFromArray(datesRange) {
  try {
    const startDate =
      datesRange.length === 2
        ? new Date(datesRange[0].format("YYYY-MM-DD"))
        : null;
    const endDate =
      datesRange.length === 2
        ? new Date(datesRange[1].format("YYYY-MM-DD"))
        : null;
    return [startDate, endDate];
  } catch {
    return [null, null];
  }
}

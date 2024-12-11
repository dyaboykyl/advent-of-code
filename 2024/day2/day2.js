

import { parse } from 'csv-parse/sync';
import fs from 'fs/promises';

const data = await fs.readFile("input");
const reports = parse(data, { delimiter: ' ', relax_column_count: true });

function getUnsafeLevel(report) {
  const sign = report[1] - report[0] > 0 ? 1 : -1;
  for (let i = 1; i < report.length; i++) {
    const d = report[i] - report[i - 1];
    const absD = Math.abs(d);
    if (absD < 1 || absD > 3 || d * sign <= 0) {
      return i;
    }
  }

  return -1;
}

function checkSafeIfRemoveIndex(report, index) {
  const modifiedReport = report.filter((_, i) => i !== index);
  // console.log(`Trying ${index}: ${modifiedReport}`)
  if (getUnsafeLevel(modifiedReport) == -1) {
    // console.log(`Report made safe by removing ${index}: ${report} - ${modifiedReport}`)
    return true;
  }
}

function part1() {
  let safeReportCount = reports.filter(report => getUnsafeLevel(report) === -1)
    .length;

  console.log(`Safe reports: ${safeReportCount}`);
}

function part2() {
  let safeReportCount = 0;

  reports.forEach(report => {
    const unsafeLevel = getUnsafeLevel(report);
    if (unsafeLevel === -1
      || checkSafeIfRemoveIndex(report, unsafeLevel)
      || (unsafeLevel > 0 && checkSafeIfRemoveIndex(report, unsafeLevel - 1))
      || (unsafeLevel > 1 && checkSafeIfRemoveIndex(report, unsafeLevel - 2))) {
      safeReportCount++;
    }
  });

  console.log(`Safe reports: ${safeReportCount}`);
}

part1();
part2();
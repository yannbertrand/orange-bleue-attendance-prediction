const visitDuration = 2 * 60 * 60 * 1000;

export function simulateOccupation(evolution) {
  const result = [];
  for (const [i, event] of Object.entries(evolution)) {
    const lastNbOfVisitors = result[i - 1] ?? 0;
    result.push(lastNbOfVisitors + event.arrived - event.left);
  }
  return result;
}

export function estimateEvolution(events) {
  let visitors = [];
  const result = [];
  for (const [i, event] of Object.entries(events)) {
    let arrived = 0;
    let leftOfTimeout = 0;
    let leftBeforeTimeout = 0;
    const targetNbVisitors = event.visitors;
    if (visitors.length === 0) {
      // Init
      const newVisitors = addVisitors(event.date, targetNbVisitors, visitors);
      arrived = newVisitors.count;
      visitors = newVisitors.visitors;
    } else {
      const previousNbOfVisitors = events[i - 1].visitors;
      const leftVisitors = makeVisitorsLeave(event.date, visitors);
      leftOfTimeout = leftVisitors.count;
      visitors = leftVisitors.visitors;

      const currentNbOfVisitors = previousNbOfVisitors - leftOfTimeout;
      if (currentNbOfVisitors < targetNbVisitors) {
        const newVisitors = addVisitors(
          event.date,
          targetNbVisitors - currentNbOfVisitors,
          visitors
        );
        arrived = newVisitors.count;
        visitors = newVisitors.visitors;
      } else if (currentNbOfVisitors > targetNbVisitors) {
        if (targetNbVisitors <= currentNbOfVisitors) {
          const probableNbOfVisitorsLeaving =
            currentNbOfVisitors - targetNbVisitors;
          const forcedLeftVisitors = forceVisitorsLeave(
            visitors,
            probableNbOfVisitorsLeaving
          );
          leftBeforeTimeout = forcedLeftVisitors.count;
          visitors = forcedLeftVisitors.visitors;
        }
      }
    }

    result.push({
      date: event.date,
      arrived,
      left: leftOfTimeout + leftBeforeTimeout,
      leftOfTimeout,
      leftBeforeTimeout,
    });
  }
  return result;
}

function addVisitors(date, nbOfNewVisitors, visitors) {
  const newVisitorsArray = [];
  for (let i = 0; i < nbOfNewVisitors; i++) {
    newVisitorsArray.push(new Visitor(date));
  }

  return {
    visitors: [...visitors, ...newVisitorsArray],
    count: newVisitorsArray.length,
  };
}

function makeVisitorsLeave(date, visitors) {
  const stayingVisitorsArray = [];
  for (const visitor of visitors) {
    if (!visitor.shouldLeave(date)) {
      stayingVisitorsArray.push(visitor);
    }
  }

  return {
    visitors: stayingVisitorsArray,
    count: visitors.length - stayingVisitorsArray.length,
  };
}

function forceVisitorsLeave(visitors, probableNbOfVisitorsLeaving) {
  const stayingVisitorsArray = [];
  for (let i = probableNbOfVisitorsLeaving; i < visitors.length; i++) {
    stayingVisitorsArray.push(visitors[i]);
  }

  return {
    visitors: stayingVisitorsArray,
    count: visitors.length - stayingVisitorsArray.length,
  };
}

class Visitor {
  #departure;
  constructor(arrival) {
    this.#departure = new Date(arrival.getTime() + visitDuration);
  }

  shouldLeave(date) {
    return date >= this.#departure;
  }
}

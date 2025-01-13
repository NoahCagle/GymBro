export const blankDate = { date: new Date().toLocaleDateString(), sets: [], sleepLog: null, cardioLogs: [], bodyWeightLogs: [] }
export const blankGroupsList = [{ id: 1, name: "No Group" }];
export const blankCardioTypesList = [{ id: 1, name: "No Type" }];
export const blankWorkoutsDoc = { groups: [...blankGroupsList], workouts: [], cardioTypes: [...blankCardioTypesList] };

export const cloneObject = (obj) => {
    return JSON.parse(JSON.stringify(obj));
}
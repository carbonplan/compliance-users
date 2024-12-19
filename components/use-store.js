import create from 'zustand'

const url =
  'https://raw.githubusercontent.com/carbonplan/compliance-users/main/data/outputs/user_data_v4.0.json'

const useStore = create((set) => ({
  search: '',
  searchId: null,
  searchBy: {
    project: true,
    user: false,
    facility: false,
  },
  showResultsBy: { project: true, facility: false },
  reportingPeriods: {
    '2013-2014': true,
    '2015-2017': true,
    '2018-2020': true,
    '2021-2023': true,
  },
  data: null,
  filtered: [],
  setSearch: (value) => {
    set({ search: value })
  },
  setSearchId: (value) => {
    set({ searchId: value })
  },
  setSearchBy: (value) => {
    set({ searchBy: value })
  },
  setShowResultsBy: (value) => {
    set({ showResultsBy: value })
  },
  setReportingPeriods: (value) => {
    set({ reportingPeriods: value })
  },
  setFiltered: (value) => {
    set({ filtered: value })
  },
  fetch: async () => {
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        data.project_targets = Object.keys(data.arb_to_users)
          .concat(Object.keys(data.opr_to_arbs))
          .concat(Object.keys(data.project_name_to_opr))
          .filter((d) => !data.combined_arbs.includes(d))
        data.user_targets = Object.keys(data.user_to_arbs).concat(
          Object.keys(data.user_name_to_id)
        )
        data.facility_targets = Object.keys(data.facility_to_user).concat(
          Object.keys(data.facility_name_to_id)
        )
        set({ data: data })
      })
  },
}))

export default useStore

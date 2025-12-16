# Update input and output data paths
issuance_table_path = "../../data/issuance-tables/nc-arboc_issuance_2025-12-15.xlsx"
compliance_report_path = "../../data/compliance-reports/"
mrr_data_path = "../../data/mrr-data/"
output_path = "../../data/outputs/user_data_v5.0.json"

# Update the years over which compliance data will be considered (Note: annual
# reporting periods will be replaced when data for the full compliance period
# is released.)
reporting_periods = ["2013-2014", "2015-2017", "2018-2020", "2021-2023", "2024"]
mrr_data_years = [
    "2013",
    "2014",
    "2015",
    "2016",
    "2017",
    "2018",
    "2019",
    "2020",
    "2021",
    "2022",
    "2023",
    "2024",
]

# Update dictionaries that are used to navigate and process the MRR data.
# (1) Add the date in the new MRR file name to the 'mrr_file_year' dictionary.
# (2) Map the MRR data years to the compliance period (full or annual) it corresponds to.
# (3) Check how many rows to skip at the top of the 'GHG data' tab.
mrr_file_year = {
    "2013": "2019-11-04",
    "2014": "2019-11-04",
    "2015": "2019-11-04",
    "2016": "2020-11-04",
    "2017": "2020-11-04",
    "2018": "2020-11-04",
    "2019": "2020-11-04",
    "2020": "2021-11-04",
    "2021": "2022-11-04",
    "2022": "2023-11-06",
    "2023": "2024-11-15",
    "2024": "2025-11-04",
}
reporting_period_map = {
    "2013": "2013-2014",
    "2014": "2013-2014",
    "2015": "2015-2017",
    "2016": "2015-2017",
    "2017": "2015-2017",
    "2018": "2018-2020",
    "2019": "2018-2020",
    "2020": "2018-2020",
    "2021": "2021-2023",
    "2022": "2021-2023",
    "2023": "2021-2023",
    "2024": "2024",
}

skiprows_by_year = {"2022": 9, "2023": 7, "2024": 7}


# Update the dictionay used navigate the new compliance report with
# the file and tab names.
file_config_by_year = {
    "2022": {
        "file": "nc-2022compliancereport.xlsx",
        "compliance_sheet": "2022 Compliance Summary",
        "offset_sheet": "2022 Offset Detail",
    },
    "2021-2023": {
        "file": "nc-CP4compliancereport.xlsx",
        "compliance_sheet": "CP4 Compliance Summary",
        "offset_sheet": "CP4 Offset Detail",
    },
    "2024": {
        "file": "nc-2024compliancereport.xlsx",
        "compliance_sheet": "2024 Compliance Summary",
        "offset_sheet": "2024 Offset Detail",
    },
}

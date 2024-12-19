import json

import facilities
import pandas as pd
import projects
import users_and_facilities
import users_and_projects

# Todo: address pandas warning w/out silencing
pd.options.mode.chained_assignment = None

# Define years over which compliance data will be considered and where to find it
# FOR UPDATES: add reporting and mrr data years
reporting_periods = ["2013-2014", "2015-2017", "2018-2020", "2021-2023"]
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
]

# FOR UPDATES: change to latest issuance table file name
issuance_table_path = "../data/nc-arboc_issuance_2024-12-10.xlsx"
compliance_report_path = "../data/compliance-reports/"
mrr_data_path = "../data/mrr-data/"


def prune_data(user_project_df, project_df, user_facility_df, facility_df):
    """Prunes dataframes such that the min-set of project, user and facility
    data needed to describe the use of offset credits. Compliance user data
    which does not align with corresponding issuance table data (i.e. project
    data) or MRR data (i.e. facility emissions data) is dropped with a printed
    report.

    As of 12/7/21, two arb project ids appear in compliance reports associated
    with a user, but do not appear in the ARB issuance tables: {'CAFR00029', 'CAFR-6339'}
    These appear to be typos, but this has not yet been confirmed. These arb-ids –
    and correspondingly, the offset usage associated with them – have been dropped
    from the output data.

    As of 12/7/21, four facility IDs appear in compliance reports associated
    with users, but nowhere in the MRR facility emission data. Two of these
    have been confirmed as non-relevant facility IDs by CARB ('5043'- a legacy ID used
    for fee purposes, not relevant to GHG reporting; '57555'- a typo waiting
    to be corrected.)
    """

    # only keep project data for projects used to meet compliance obligations
    p_df = project_df[project_df["arb_id"].isin(user_project_df["arb_id"])]

    # drop user/project data for arb_ids that don't appear in the issuance table
    print()
    print("ARB ids that appear in the compliance data but not the issuance table:")
    print("-----> " + str(set(user_project_df["arb_id"]) - set(project_df["arb_id"])))
    print()
    up_df = user_project_df[user_project_df["arb_id"].isin(project_df["arb_id"])]

    # only keep user/facility data for users who have turned in offset credits
    uf_df = user_facility_df[user_facility_df["user_id"].isin(up_df["user_id"])]

    # only keep facility data for facilities associated with a user who
    # has turned in offset credits
    f_df = facility_df[facility_df["facility_id"].isin(uf_df["facility_id"])]

    # drop user/facility data for facilities that don't appear in MRR data
    print()
    print("Facility ids that appear in the compliance data but not the MRR data:")
    print(
        "-----> "
        + str(set(user_facility_df["facility_id"]) - set(facility_df["facility_id"]))
    )
    print()
    uf_df = uf_df[uf_df["facility_id"].isin(f_df["facility_id"])]

    return up_df, p_df, uf_df, f_df


def write_json(collection, output):
    with open(output, "w") as f:
        f.write(json.dumps(collection, indent=2))


def main():
    # read data
    project_df = projects.read_project_data(issuance_table_path)
    facility_df = facilities.read_facility_data(mrr_data_path, mrr_data_years)
    user_project_df = users_and_projects.read_user_project_data(
        compliance_report_path, reporting_periods
    )
    user_facility_df = users_and_facilities.read_user_facility_data(
        compliance_report_path, reporting_periods
    )

    # prune data to min-set for representing offset use
    user_project_df, project_df, user_facility_df, facility_df = prune_data(
        user_project_df, project_df, user_facility_df, facility_df
    )

    # map ARB project ids to OPR project ids and project info
    opr_to_arbs, combined_arbs = projects.make_opr_to_arbs(project_df)
    arb_to_oprs = projects.make_arb_to_oprs(project_df, combined_arbs)
    project_name_to_opr, opr_to_project_info = projects.make_project_info(project_df)

    # map ARB project ids to users
    user_to_arbs = users_and_projects.make_user_to_arbs(user_project_df)
    arb_to_users = users_and_projects.make_arb_to_users(user_project_df, combined_arbs)

    # map users to facility ids
    user_to_facilities = users_and_facilities.make_user_to_facilities(user_facility_df)
    facility_to_user = users_and_facilities.make_facility_to_users(user_facility_df)

    # map user ids to user info
    user_name_to_id = users_and_facilities.make_user_name_to_id(user_facility_df)
    user_id_to_name = users_and_facilities.make_user_id_to_name(user_facility_df)

    # map facility id to facility info
    facility_name_to_id, facility_id_to_info = facilities.make_facility_info(
        facility_df, user_facility_df
    )

    # Create collection and write to json
    collection = {
        "opr_to_arbs": opr_to_arbs,
        "arb_to_oprs": arb_to_oprs,
        "opr_to_project_info": opr_to_project_info,
        "project_name_to_opr": project_name_to_opr,
        "user_to_arbs": user_to_arbs,
        "arb_to_users": arb_to_users,
        "user_to_facilities": user_to_facilities,
        "facility_to_user": facility_to_user,
        "user_name_to_id": user_name_to_id,
        "user_id_to_name": user_id_to_name,
        "facility_name_to_id": facility_name_to_id,
        "facility_id_to_info": facility_id_to_info,
        "combined_arbs": combined_arbs,
    }

    # FOR UPDATES: change json destination
    write_json(collection, "../data/outputs/user_data_v4.0.json")


if __name__ == "__main__":
    main()

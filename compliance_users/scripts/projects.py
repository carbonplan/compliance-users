import pandas as pd

project_types = {
    "Forest": "U.S. Forest Project",
    "ODS": "Ozone Depleting Substance Project",
    "Livestock": "Livestock Project",
    "MMC": "Mine Methane Capture Project",
    "Rice": "Rice Cultivation Project",
    "Urban": "Urban Forest Project",
}


def read_project_data(data_path):
    issuance = pd.read_excel(data_path, "ARB Offset Credit Issuance")
    # subset and rename columns of interest
    issuance_df = issuance[
        [
            "CARB Issuance ID",
            "OPR Project ID",
            "Offset Project Name",
            "Project Type",
            "State",
            "Project Documentation",
        ]
    ].copy()
    issuance_df.rename(
        columns={
            "CARB Issuance ID": "arb_id",
            "OPR Project ID": "opr_id",
            "Offset Project Name": "project_name",
            "Project Type": "project_type",
            "State": "state",
            "Project Documentation": "documentation",
        },
        inplace=True,
    )
    # standardize ids and clean up the table
    issuance_df["arb_id"] = issuance_df["arb_id"].str.strip()
    issuance_df["opr_id"] = issuance_df["opr_id"].astype(str).str.strip()

    issuance_df["project_type"] = issuance_df["project_type"].map(project_types)
    issuance_df["arb_id"] = issuance_df["arb_id"].str.split("-").apply(lambda x: x[0])

    # keep most recent project information associated with an arb/opr id pair
    issuance_df = issuance_df.drop_duplicates(["arb_id", "opr_id"], keep="last")
    return issuance_df


def make_opr_to_arbs(issuance_df):
    opr_ids = issuance_df["opr_id"].unique().tolist()
    opr_to_arbs = {}
    combined_arbs = []
    for opr_id in opr_ids:
        arbs = issuance_df.loc[issuance_df["opr_id"] == opr_id, "arb_id"].unique().tolist()

        # if an opr id maps to multiple arbs (as is the case with certain early
        # early action projects), concatenate into a combined opr id
        if len(arbs) > 1:
            combined_arb = "-".join(arbs)
            combined_arbs.append(combined_arb)
            arbs = [combined_arb]
        opr_to_arbs[opr_id] = arbs[0]
    return opr_to_arbs, combined_arbs


def make_arb_to_oprs(issuance_df, combined_arbs):
    arb_ids = issuance_df["arb_id"].unique().tolist()
    arb_to_oprs = {}
    for arb_id in arb_ids:
        oprs = issuance_df.loc[issuance_df["arb_id"] == arb_id, "opr_id"].unique().tolist()
        # currently, there are two arb ids (CAMM5244 & CALS5030) that map
        # to multiple opr ids; after confirming that the underlying project
        # information is the same, we simply map to the most recent opr id
        arb_to_oprs[arb_id] = oprs[-1]

    # add combined arbs to arb-->opr mapping as a new entry with the
    # combined_arb as the key
    for combined_arb in combined_arbs:
        arbs = combined_arb.split("-")
        arb_to_oprs[combined_arb] = arb_to_oprs[arbs[0]]
    return arb_to_oprs


def make_project_info(issuance_df):
    # drop duplicates from many arb_ids mapping to one opr_id
    opr_rows = issuance_df.drop_duplicates(
        ["opr_id", "project_name", "project_type", "state", "documentation"]
    )
    opr_rows = opr_rows[["opr_id", "project_name", "project_type", "state", "documentation"]]

    opr_to_project_info = opr_rows.set_index("opr_id").to_dict(orient="index")
    project_name_to_opr = opr_rows.set_index("project_name")["opr_id"].to_dict()

    return project_name_to_opr, opr_to_project_info

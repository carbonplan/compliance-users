<p align="left" >
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://carbonplan-assets.s3.amazonaws.com/monogram/light-small.png">
  <img alt="CarbonPlan monogram." height="48" src="https://carbonplan-assets.s3.amazonaws.com/monogram/dark-small.png">
</picture>
</p>

# carbonplan/compliance-users

Working repo to make a simple tool for querying CA compliance data.

![Checks status](https://github.com/carbonplan/compliance-users/actions/workflows/main.yml/badge.svg)
![GitHub deployments](https://img.shields.io/github/deployments/carbonplan/compliance-users/production?label=vercel&style=flat)
[![License](https://img.shields.io/github/license/carbonplan/compliance-users?style=flat)](https://github.com/carbonplan/compliance-users/blob/main/LICENSE)
[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.5819475.svg)](https://doi.org/10.5281/zenodo.5819475)

This repository is being used to develop a simple tool to query California Cap & Trade compliance data. Specifically, the tool allows a user to ask which regulated entities in California – whom we call users throughout the repo – have turned in credits from a particular offset project (project-->users) or which offset projects a particular user has used credits from (user-->projects).

## methods

### key terms

- _CARB / the regulator_: The California Air Resources Board (CARB) is the regulator in charge of California’s Cap & Trade program. CARB publicly releases Cap & Trade program data, including data on the use of offset credits to meet compliance obligations.

- _Projects_: Offset projects are qualified projects that purport to reduce or sequester greenhouse gases outside the scope of the Cap & Trade program. These projects are registered via an Offset Project Registry (OPR) under rules that have been approved by CARB. As such, projects can be identified both by an opr_id and an arb_id.

- _User / Regulated Entity_: Under the Cap & Trade Program, regulated entities – parties who are obligated to comply with Cap & Trade rules and turn in “compliance instruments” to cover their emissions – may currently use offset credits to satisfy 4% of their overall compliance obligation. We refer to these regulated entities as users.

- _Facilities_: Emitting facilities are the basis for a user’s compliance obligation. Multiple facilities may be associated with a regulated entity at any one time. Facilities may also change hands and be associated with multiple users through time.

### data sources

- [Compliance Reports](https://ww2.arb.ca.gov/our-work/programs/cap-and-trade-program/cap-and-trade-program-data): Specifically, we are using the reports published at the end of each full compliance period (2013-2014, 2015-2017, 2018-2020) detailing how regulated entities complied with their Cap & Trade Obligations, including their use of offset credits. We also use annual compliance reports (2021 and 2022) where no report for the full compliance period is available.

- [Offset Credit Issuance Table](https://ww2.arb.ca.gov/our-work/programs/cap-and-trade-program/cap-and-trade-program-data): This table spreadsheet provides information about the issuance of ARB offset credits, i.e. offset credits that are eligible for use in the Cap & Trade program. This table is typically updated multiple times a month; we are using the issuance table published on Dec 27, 2023.

- [Mandatory GHG Reporting Data (MRR)](https://ww2.arb.ca.gov/mrr-data): Annual MRR data provides details on the emissions from facilities who are covered by the Cap & Trade program.

All of these data sources are published by CARB as .xlsx files. Minor edits were needed to make some data machine-readable (e.g deleting values that were struck-through to indicate an edit to a value in the sheet). The slightly edited data sources can be found in this repo.

Note that based on the structure on the structure of public data, offset projects cannot be directly connected to facilities, but both facilities and offset projects can be connected to users.

### data processing

#### read & prune data

- _User / offset project data (compliance reports)_: The compliance reports have an “Offset Detail” tab which connects users to quantities of offset credits from different projects. The users are identified by a name and id. The projects are identified by an arb_id (a project id given by CARB).

- _User / facility data (compliance reports)_: The compliance reports have a “Compliance Summary” tab which associates users with facilities whose emissions they were responsible for covering during the compliance period. The users are identified by a name and id. The facilities are identified by a list of facility_ids called ARB GHG Ids.

- _Issuance table_: The issuance table has an “ARB Offset Credit Issuance” tab which associates an arb_id with an opr_id and underlying project information.

- _Facility data (MRR data)_: Facility data (MRR data): The MRR data have a “GHG Data” tab which associates facility ids with facility information, including name, location and sector.

- _Prune data_: For the purposes of this tool, we are only interested in projects and facilities associated with users who have turned in offset credits for compliance purposes. We drop project, facility, and user data for which this is not true.

#### map users <--> offset projects

- _users <-> arb_ids_: Using the compliance reports, we can create two-way mapping between users and the projects (represented by arb_ids) they've turned in credits from.

- _arb_ids <-> opr_ids / project information_: Using the issuance table, we can create two-way mappings between arb_ids (given to an offset project by CARB), opr_ids (given to a project by the registry that listed it), and project information (name, type, location).

#### map users <--> facilities

- _users <-> facility ids_: Using the compliance reports, we can create two-way mapping between users and the emitting facilities (represented by facility_ids) associated with that user.

- _facility ids <-> facility information_: Using the MRR data, we can create two-way mapping between facility_ids and facility information (name, sector, location).

#### handling edge cases

Full documentation of handling edge cases can be found in our [methods google doc](https://docs.google.com/document/d/1DZT6bWENq4EZ_BAnscwMWN-Tc1ketSiWeEQ3hhSmi10/edit#heading=h.2umnfgrdaf01). Edge case examples include facility_ids or arb_ids that appear in the compliance data, but not in the issuance table or MRR data.

## changelog

### 1.0.0 (Jan 4, 2022)

Initial release.

### 2.0.0 (Feb 21, 2023)

Update to reflect compliance data released in December 2022.

### 3.0.0 (Jan 8, 2024)

Update to reflect compliance data released in December 2023.

## license

All the code in this repository is [MIT](https://choosealicense.com/licenses/mit/) licensed, but we request that you please provide attribution if reusing any of our digital content (graphics, logo, articles, etc.).

## about us

CarbonPlan is a non-profit organization that uses data and science for climate action. We aim to improve the transparency and scientific integrity of climate solutions with open data and tools. Find out more at [carbonplan.org](https://carbonplan.org/) or get in touch by [opening an issue](https://github.com/carbonplan/compliance-users/issues/new) or [sending us an email](mailto:hello@carbonplan.org).

## Steps for annual data updates

- Get new data

  - https://ww2.arb.ca.gov/our-work/programs/cap-and-trade-program/cap-and-trade-program-data
  - Download new issuance table; if file name matches previous years', append download date (e.g.`nc-arboc_issuance_2024-12-10.xlsx`
  - Dowload new compliance report

  - https://ww2.arb.ca.gov/mrr-data
  - Download new emissions data; historically, name has matched `YYYY-ghg-emissions-YYYY-MM-DD.xlsx`

- In 'build_users_data.py':

  - Add new data years (if adding a reporting period rather than annaul compliance report, delete the annual reporting periods)
  - Change issuance table path to latest issuance table name
  - Change json output file name to the next file version

- In 'facilities.py':

  - Update file name dictionaries (if adding a reporting period rather than annual compliance report, change the years which previously pointed at an annual reporting period to a full reporting period)
  - Update skiprows for the new reporting period if different than default
  - Check to make the columns names in the new MRR sheet match the function (historically they have)

- In 'users_and_projects.py':

  - Add the file and Offsets Detail sheet name for the new compliance report to the dictionary if different than default pattern
  - Check that skiprows assumption still holds

- In 'users_and_facilities.py':
  - Add the file and Compliance Summary sheet name for the new compliance report to the dictionary if different than default pattern
  - Check that skiprows assumption still holds

Use the `sandbox.ipynb` to test these updates and make sure all the new data is successfully read in.

If all checks pass, run `build_users_data` from the `scripts` folder. You should see the new version of the data in the `data/outputs` folder. Do some spot check on the new output json.

If successful, update documentation:

- Indicate new data version in 'README.md'

- Update the "last updated" date and list of years included in 'methods.md', 'layout.js', and '.zenodo.json'.

- Update citation date in 'about.md'.

Update and test front-end:

- Add new year to the filters.

- Change pointer in 'components/use-store.js' to access the new data. (You'll have to temporarily point to the update branch version of the data to get a vercel preview of the new data before publication.)

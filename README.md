# dsOwnershipTransfer

Google Apps script and accompanying Google sheet template to bulk transfer ownership of Datastudio reports and data sources

Please take care when using this as it's not been tested to destruction

This sheet is a read only template make a copy to use
https://docs.google.com/spreadsheets/d/13RLS32-82zhBLFWhcJBUNkyOfEY1IwcD3381oLI6cbQ/edit?usp=sharing

You'll need to set up as explained here: https://github.com/99-metrics/ga-realtime-alerting#setup-guide

There are two menu options on load

1) Get all Datastudio Files in Drive
This will list all data studio data sources and reports that the user owns (i.e. ignores DS files that have been shared with the user) and prints them on the spreadsheet

User then needs to choose which files to transfer (if it's all then fill down with YES)
You can send emails (for every sheet) to person you're transferring to but this is overkill and if this sheet is used I'll convert this to one email with all the links that are being transferred

2) transfer ownserhip
This will transfer ownership and add a note to each line if it's been transfered and the error if it hasn't.

*if you transfer ownership to someone without access to the datasource underlying the DS datasources e.g. google sheet/GA this will break the data studio report*

If ownsership is transfer, the anyone that clicks 'edit' on the datastudio report that contains the data source will be shown an banner that says something like 'ownership has changed' and an option to fix it. Clicking fix it will just ask you to reconnect the dataset which should be easy.

*Use with care and test before you do a bulk transfer*

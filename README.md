# IRIS-project

-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
# Task: Build a Custom Data Table with Pagination and Sorting in LWC
Objective: Create a Lightning Web Component that displays a list of Accounts in a
custom data table format with the following functionality:
1. Users can navigate through the list in pages of 10 records.
2. Users can sort columns (e.g., Account Name, Industry, and Annual Revenue)
in ascending and descending order.
3. Include a search box to filter the records by Account Name.
4. Allow users to edit the Annual Revenue inline directly within the table.
5. After editing, the user should be able to save the updated records to
Salesforce using a button.
Requirements:
- Use LWC to implement the component.
- Fetch data from the Account object in Salesforce using Apex.
- Implement error handling for the data fetch and save operations.
- Ensure the component is responsive and user-friendly.
- Use CSS or SLDS for basic styling.
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

# Account Data Table LWC

This Lightning Web Component (LWC) provides a custom, paginated, editable data table for displaying and managing Salesforce Account records. 
Users can view Accounts in a paginated table, sort by columns, search by Account name, and edit the **Annual Revenue** and **Industry** fields directly in the table. The component is designed to enhance user interaction with Salesforce data by providing responsive design, inline editing, and data handling via Apex.

## Features

- **Pagination**: Displays Accounts in pages of 10 records, allowing easy navigation and page number.
- **Sorting**: Columns (e.g., Account Name, Industry, Annual Revenue) can be sorted.
- **Search**: Includes a search box to filter records by Account Name.
- **Inline Editing**: Users can edit the **Annual Revenue** (currency).
- **Save to Salesforce**: After editing, users can save the updated records to Salesforce with a single click.
- **Loading Overlay**: Disables the screen and displays a spinner while saving or loading data.
- **Error Handling**: Displays an error message as a toast notification if the save operation fails.

## Installation

1. Clone the repository to your local environment.
2. Deploy the following files to your Salesforce Org:
   - **AccountDataTable.html**
   - **AccountDataTable.js**
   - **AccountDataTable.css**
   - **AccountController.apxc** (Apex Controller)
3. Create a new Lightning Component Tab's with content as 'accountTable'. And add the tab to required App.

## File Structure

  ```
  accountTable/lwc/accountTable
    AccountDataTable.html      # HTML structure of the LWC component
    AccountDataTable.js        # JavaScript logic, data handling, and Apex calls
    AccountDataTable.css       # Custom styling for the component
    accountTable.js-meta.xml   # Defines the targets where LWC component can be used
  
  AccountController.apxc     # Apex Controller for handling data retrieval and save operations
  ```

## Apex Controller

The Apex Controller (`AccountController.apxc`) includes methods for:
    - Retrieving Account records based on search, sort, and pagination options.
    - Fetching picklist values for the Industry field.
    - Saving updated Account records back to Salesforce.

    ### Apex Methods
    
    - `@AuraEnabled(cacheable=true) public static List<Account> getAccounts(...)`: Retrieves Account records with search, sort, and pagination options.
    - `@AuraEnabled(cacheable=true) public static List<String> getIndustryPicklistValues()`: Returns available picklist values for the Industry field.
    - `@AuraEnabled public static void saveAccounts(List<Account> accounts)`: Saves the edited Account records Annual Revenue.

## LWC Component (AccountDataTable)

  The LWC (`AccountDataTable`) handles:
  - **Data Fetching**: Fetches Accounts and picklist values from the Apex controller.
  - **Sorting and Pagination**: Allows users to navigate and sort Account records.
  - **Inline Editing**: Updates the **Industry** (picklist) and **Annual Revenue** (currency) fields directly in the table.
  - **Save Operation**: Triggers save and displays a loading overlay with a spinner during the save process.
  - **Error Handling**: Displays errors at the top of the page in a toast notification if saving fails.

### JavaScript Key Points

  - **Spinner and Overlay**: Managed by the `isLoading` property to disable the screen during data fetch or save operations.
  - **Error Messages**: `errorMessage` displays errors in the UI and on toast notifications.

### CSS Styling

  - **Loading Overlay**: `.loading-overlay` is a full-screen overlay with a centered spinner.
  
## After deployment, use the following steps: ##

  1. Create a new Lightning Component Tabs with content as 'accountTable'. > Save
  2. Navigate to the desired app via Setup. And add the tab to required App.

### Component Attributes

  - **Pagination Size**: Defaults to 10 records per page.
  - **Editable Fields**: Annual Revenue.

## Error Handling and Debugging

  - **Debugging**: Console logs and Salesforce debug logs are used to troubleshoot Apex method responses.
  - **Error Display**: Errors encountered during save as toast notifications.

## Customization

  - Adjust pagination size by updating the `pageSize` variable.
  - To add more columns or fields, update the `columns` definition in `AccountDataTable.js` and modify the Apex `getAccounts` query accordingly.

## Assumptions
   1. Assuming the LWC component would be used as a tab along with other objects. Although, it can be modified to be triggered from any component. e.g: quick action.
   2. Assuming number of account records is nominal to handle via regulr SOQL and does not hit Governer limits.
   3. Assuming the user has appropriate permission to edit account records (ran via Admin for demo).
   4. Assuming errors are to be displaye in a tost on page.

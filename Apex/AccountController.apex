//Class to handle LWC calls for fethching and modyfying account data
public with sharing class AccountController {
    
    // Method to fetch and sort Account records
    @AuraEnabled(cacheable=true)
    public static List<Account> getAccounts(String searchKey, String sortedBy, String sortedDirection, Integer pageNumber, Integer pageSize) {
        String query = 'SELECT Id, Name, Industry, AnnualRevenue FROM Account';
        
        // Add search filter if searchKey is provided
        if (String.isNotBlank(searchKey)) {
            query += ' WHERE Name LIKE \'%' + String.escapeSingleQuotes(searchKey) + '%\'';
        }

        // Add sorting
        if (String.isNotBlank(sortedBy) && String.isNotBlank(sortedDirection)) {
            query += ' ORDER BY ' + sortedBy + ' ' + sortedDirection;
        } else {
            query += ' ORDER BY Name ASC'; // Default sorting ASC
        }

        // Implement pagination
        Integer offset = (pageNumber - 1) * pageSize;
        query += ' LIMIT :pageSize OFFSET :offset';

		try {
            return Database.query(query);
        } catch (DmlException e) {//handle fetching account data error
            throw new AuraHandledException('Error fetching accounts: ' + e.getMessage());
        }
    }
    
    // Method to save list of updated Account records
    @AuraEnabled
    public static void saveAccounts(List<Account> accounts) {
        if (accounts == null || accounts.isEmpty()) {
            throw new AuraHandledException('No accounts to save');
        }
        
        try {
            update accounts;
        } catch (DmlException e) {//handle saving account data error
            throw new AuraHandledException('Error saving accounts: ' + e.getMessage());
        }
    }

    // Method to fetch picklist values for the Industry field
    @AuraEnabled(cacheable=true)
    public static List<String> getIndustryPicklistValues() {
        List<String> industryOptions = new List<String>();
        
		try {
            Schema.DescribeFieldResult fieldResult = Account.Industry.getDescribe();
        
			for (Schema.PicklistEntry entry : fieldResult.getPicklistValues()) {
				industryOptions.add(entry.getLabel());
			}
			System.debug('Industry Picklist Values: ' + industryOptions);
			return industryOptions;
        } catch (DmlException e) {//handle fetching pikclist error
            throw new AuraHandledException('Error fetching Industry picklist data: ' + e.getMessage());
        }
    }
}

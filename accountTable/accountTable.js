import { LightningElement, wire, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getAccounts from '@salesforce/apex/AccountController.getAccounts';
import saveAccounts from '@salesforce/apex/AccountController.saveAccounts';
import getIndustryPicklistValues from '@salesforce/apex/AccountController.getIndustryPicklistValues';
import { refreshApex } from '@salesforce/apex';

export default class AccountDataTable extends LightningElement {
    @track accounts = [];
    @track industryOptions = [];
    @track draftValues = [];
    @track sortedBy = 'Name';
    @track sortedDirection = 'asc';
    @track searchKey = '';
    @track pageNumber = 1;
    @track pageSize = 10;
    @track isFirstPage = true;
    @track isLastPage = false;
    @track numOfRec = 0;
    @track isSaveDisabled = true;
    @track isLoading = false; // Track loading state for overlay
    @track errorMessage = ''; // error on saving

    wiredAccounts;
    
    // Fetch Accounts data based on sorting & search
    @wire(getAccounts, { searchKey: '$searchKey', sortedBy: '$sortedBy', sortedDirection: '$sortedDirection', pageNumber: '$pageNumber', pageSize: '$pageSize' })
    wiredAccounts(result) {
        this.wiredAccounts = result;
        if (result.data) {
            this.accounts = result.data;
            this.numOfRec = this.accounts.length;
        } else if (result.error) {
            console.error('Error fetching accounts:', result.error);
        }
        
        if(this.numOfRec < this.pageSize)
            this.isLastPage = true;
        else
            this.isLastPage = false;
        
    }

    // Fetch Industry picklist values
    connectedCallback() {
        getIndustryPicklistValues()
            .then(data => {
                this.industryOptions = data.map(value => ({ label: value, value: value }));
            })
            .catch(error => {
                console.error('Error fetching industry picklist values:', error);
            });
    }

    // Handle search input change and reset to first page
    handleSearchChange(event) {
        this.searchKey = event.target.value;
        this.pageNumber = 1;
    }

    // Sort columns
    sortByName() {
        this.sortedBy = 'Name';
        this.sortedDirection = this.sortedDirection === 'asc' ? 'desc' : 'asc';//revert the sort direction
    }
    sortByIndustry() {
        this.sortedBy = 'Industry';
        this.sortedDirection = this.sortedDirection === 'asc' ? 'desc' : 'asc';
    }
    sortByRevenue() {
        this.sortedBy = 'AnnualRevenue';
        this.sortedDirection = this.sortedDirection === 'asc' ? 'desc' : 'asc';
    }

    // Handle industry picklist change
    //commented since the column is disabled 
    /*handleIndustryChange(event) {
        const accountId = event.target.dataset.id;
        const value = event.target.value;
        this.updateDraftValues(accountId, 'Industry', value);
    }*/

    // Handle Annual Revenue change (currency field)
    handleRevenueChange(event) {
        const accountId = event.target.dataset.id;
        const value = event.target.value;
        const reg = new RegExp('^[0-9]+$');
        if(reg.test(value)){//check for numeric only values using regEx
            this.updateDraftValues(accountId, 'AnnualRevenue', value);
        }else{
            this.isSaveDisabled = true;//disables 'Save changes' when a non-numeric value is input
        }
    }

    // Update draft values array with inline edits
    updateDraftValues(id, field, value) {
        const existingDraft = this.draftValues.find(draft => draft.Id === id);
        if (existingDraft) {
            existingDraft[field] = value;
        } else {
            this.draftValues.push({ Id: id, [field]: value });
        }
        this.isSaveDisabled = false;
    }

    // Pagination
    handlePreviousPage() {
        if (this.pageNumber > 1) {
            this.pageNumber -= 1;
            if(this.pageNumber <= 1){//disables previous button on first page
                this.isFirstPage = true;
            }
        }
    }
    handleNextPage() {
        this.pageNumber += 1;
        if(this.pageNumber >= 1){
            this.isFirstPage = false;
        }
    }

    // Save changes to Salesforce
    handleSave() {
        this.isLoading = true; // Show loading overlay when saving
        //console.log('#105:'+JSON.stringify(this.draftValues));
        saveAccounts({ accounts: this.draftValues })
            .then(() => {
                this.draftValues = [];
                this.isSaveDisabled = true;
                this.isLoading = false; // Hide overlay after successful save
                return refreshApex(this.wiredAccounts);
            })
            .catch(error => {
                this.isLoading = false; // Hide overlay on error
                this.errorMessage = error.body.message;
                
                this.dispatchEvent(
                    new ShowToastEvent({// Show toast notification with error message
                        title: 'Error Saving Account Records:',
                        message: this.errorMessage,
                        variant: 'error',
                        mode: 'sticky'
                    })
                );
            });
    }
}
import { LightningElement, api, wire, track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import { getRecord, getFieldValue,getRecordNotifyChange  } from 'lightning/uiRecordApi';
	
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import NAME_FIELD from '@salesforce/schema/Account.Name';
import PRIMARYCONTACT_FIELD from '@salesforce/schema/Account.PrimaryContactFieldName__c';
import PHONE_FIELD from '@salesforce/schema/Account.Phone';
import PERSONASSISTANTPHONE from '@salesforce/schema/Account.PersonAssistantPhone';
import PERSONHOMEPHONE from '@salesforce/schema/Account.PersonHomePhone';
import PERSONMOBILE from '@salesforce/schema/Account.PersonMobilePhone';
import PERSONOTHER from '@salesforce/schema/Account.PersonOtherPhone';
import OWNER_FIELD from '@salesforce/schema/Account.Owner.Name';
import PERSON_MAILING_STREET from '@salesforce/schema/Account.PersonMailingStreet';
import ACCOUNT_SOURCE from '@salesforce/schema/Account.AccountSource';



const fields = [NAME_FIELD,PRIMARYCONTACT_FIELD,OWNER_FIELD, PERSONASSISTANTPHONE,PERSONHOMEPHONE,PERSONMOBILE,PERSONOTHER,PHONE_FIELD,PERSON_MAILING_STREET,ACCOUNT_SOURCE];
export default class DualRecordForm extends LightningElement {
    @api fieldList = ["DoB__c","GenderIdentity__c","PersonEmail","Permission_to_contact_date__c", "Phone","Status__c","Scope_of_appointment_date__c", "AccountSource","PersonMailingAddress","PersonMailingStreet","Appointment_Date_Time__c","Do_not_call__c"]; 

    @api title = NAME_FIELD;
    showEditField;
    showphonModal;
    @track primariContactField;
    @api primaryPhone = this.primariContactField;
    @api recordId;
    @api objectApiName = "Account";
    @track isModalOpen = false;
    @track isArchiveModalOpen = false;
    @track isSourceModalOpen = false;
    @track isPTCModalOpen = false;
    @track isAddressModalOpen = false;
    @track isMedModalOpen = false;
    @track isOtherModalOpen = false;
    @track areDetailsVisible=false;
    @api sourcePickValue;
    @api sourceOtherProviders;
    @track phoneDetail;
    @api ptcDetail;
    @api medDetail;
    @track sourceDetail;
    @api archiveDetail;
    @api addressDetail;
    @api otherDetail;

    
    isPhoneChanged;
    


    @wire(getRecord, { recordId: '$recordId', fields })
    account;

   // @wire(getRecord, { recordId: '$recordId', fields})
   // address;

    get nameValue() {
        return this.account.data ? getFieldValue(this.account.data, NAME_FIELD) : '';
    }
    get primaryContactValue() {
        return this.account.data ? getFieldValue(this.account.data, PRIMARYCONTACT_FIELD) : '';
    }
    get accountOwner() {
        return this.account.data ? getFieldValue(this.account.data, OWNER_FIELD) : '';
    }
    get accountPhone() {
        return this.account.data ? getFieldValue(this.account.data, PHONE_FIELD) : '';
    }

    get isDisabled() {
        return !this.showEditField;
    }
    openModal() {
        // to open modal set isModalOpen tarck value as true
        this.isModalOpen = true;
    }
    primeContact;
    closeModal() {
        // to close modal set isModalOpen tarck value as false
        this.isModalOpen = false;
        this.isArchiveModalOpen = false;
        this.isSourceModalOpen = false;
        this.isAddressModalOpen = false;
        this.isPTCModalOpen = false;
        this.isMedModalOpen = false;
        this.isOtherModalOpen =  false;
        console.log('bingoPhone' + this.showEditField);
    }

    handlePhoneClick(event) {
    console.log('bingoPhone');
   if(this.showEditField == true) {
    let tempPhDetail  = JSON.parse(JSON.stringify(this.phoneDetail)); 
        if(this.template.querySelector("lightning-input-field[data-id=phn]").value != tempPhDetail[this.phoneDetail['PrimaryContactFieldName__c']] || tempPhDetail['PrimaryContactFieldName__c']== null){
            this.primeContact = 'PersonHomePhone' ;
            //tempPhDetail['PrimaryContactFieldName__c'] =  'PersonHomePhone' ;
            tempPhDetail['Phone']=  this.template.querySelector("lightning-input-field[data-id=phn]").value;
            tempPhDetail['PersonHomePhone'] =  this.template.querySelector("lightning-input-field[data-id=phn]").value;
        }
        else{
        this.primeContact = this.phoneDetail['PrimaryContactFieldName__c'] ;
        }
        
        this.phoneDetail = tempPhDetail;

    }
    else {

        let temp = JSON.parse(JSON.stringify(this.account.data.fields));
        console.log('===>Temp' + temp);
        for (const key in temp) {
            temp[key] = temp[key].value;
        }
        this.phoneDetail = temp;

    }
        this.isModalOpen = true;
    }
    changePhoneNumber(event) {
        this.isPhoneChanged = true;
    }

    handleAddressClick(event) {
        console.log('addr1');
      
        this.isAddressModalOpen = true;
    }
    handlePTCClick(event) {
        this.isPTCModalOpen = true;
    }
    handleStatusClick(event) {
        if(event.target.value.includes("Archive"))
        this.isArchiveModalOpen = true;
    }
    handleMedDetailClick(event) {
      
        this.isMedModalOpen = true;
    }

    handleOtherDetailClick(event) {
      
        this.isOtherModalOpen = true;
    }
    handleFieldClick(event) {
       
        console.log('onfocus fired');
        console.log(event.target.name);
      debugger;
        if(event.target.fieldName=="Phone")
      {
        this.isModalOpen = true;
    }
    if(event.target.fieldName=="Status__c" )
    {
      this.isArchiveModalOpen = true;
  }
    }
    handleSourceClick(event) {
        if(this.showEditField == true)
        this.sourcePickValue = this.template.querySelector("lightning-input-field[data-id=source]").value;
        else
        this.sourcePickValue = this.account.data.fields["AccountSource"].value;

        if(this.sourcePickValue.includes("Aledade") || this.sourcePickValue.includes("Archwell") || this.sourcePickValue.includes("ChenM_Ded_Call center") || this.sourcePickValue.includes("ChenM / Ded MCG") || this.sourcePickValue.includes("Homeward") || this.sourcePickValue.includes("IORA")  ){
            this.sourceOtherProviders = true;
            this.isSourceModalOpen = true;
        }
        if(this.sourcePickValue.includes("Community") || this.sourcePickValue.includes("Provider") || this.sourcePickValue.includes("Referral") || this.sourcePickValue.includes("Event") ||  this.sourcePickValue.includes("Campaign")) 
        this.isSourceModalOpen = true;


    }
    handleSourceChange(event) {
        this.sourcePickValue = event.target.value;
        if(this.sourcePickValue.includes("Aledade") || this.sourcePickValue.includes("Archwell") || this.sourcePickValue.includes("ChenM_Ded_Call center") || this.sourcePickValue.includes("ChenM / Ded MCG") || this.sourcePickValue.includes("Homeward") || this.sourcePickValue.includes("IORA")  ){
            this.sourceOtherProviders = true;
            this.isSourceModalOpen = true;
        }
        if(this.sourcePickValue.includes("Community") || this.sourcePickValue.includes("Provider") || this.sourcePickValue.includes("Referral") || this.sourcePickValue.includes("Event") ||  this.sourcePickValue.includes("Campaign")) 
        this.isSourceModalOpen = true;
    }
    handleFieldChange(event) {

        if(event.target.fieldName=="Status__c" && event.target.value == "Keen Archive")
        {
          this.isArchiveModalOpen = true;
        }
        if(event.target.fieldName=="AccountSource")
        {
            console.log(event.target.name);
            debugger;
          this.sourcePickValue = event.target.value;
          if(this.sourcePickValue.includes("Community") || this.sourcePickValue.includes("Provider") || this.sourcePickValue.includes("Referral") || this.sourcePickValue.includes("Event") || this.sourcePickValue.includes("Phreesia"))
          this.isSourceModalOpen = true;
        }

        if(event.target.fieldName=="Permission_to_contact_date__c" )
        {
          
          this.isPTCModalOpen = true;
        }

    }
    handleSubmit(event){
        event.preventDefault();       // stop the form from submitting
        const fields = event.detail.fields;
        console.log('save---->');   
        if(this.phoneDetail!= undefined){
        fields['PersonAssistantPhone'] = this.phoneDetail['PersonAssistantPhone'];
        fields['PersonHomePhone'] = this.phoneDetail['PersonHomePhone'];
        fields['PersonMobilePhone'] = this.phoneDetail['PersonMobilePhone'];
        fields['PersonOtherPhone'] = this.phoneDetail['PersonOtherPhone'];
        fields['Phone'] = this.phoneDetail[this.phoneDetail['PrimaryContactFieldName__c']];
        fields['PrimaryContactFieldName__c']= this.phoneDetail['PrimaryContactFieldName__c'];
    }
    if(this.ptcDetail!= undefined){
        fields['Permission_to_contact_source__c']= this.ptcDetail['Permission_to_contact_source__c'];
        fields['Other_Permission_to_contact_Details__c']= this.ptcDetail['Other_Permission_to_contact_Details__c']; 
    }    
    if(this.sourceDetail!= undefined){
        fields['Source_Community_organization__c']= this.sourceDetail['Source_Community_organization__c'];
        fields['Practice_directory__c']= this.sourceDetail['Practice_directory__c'];
        fields['Source_Referring_member__c']= this.sourceDetail['Source_Referring_member__c'];
        fields['Referring_member_s_relationship__c']= this.sourceDetail['Referring_member_s_relationship__c'];
        fields['Event__c']= this.sourceDetail['Event__c'];
        fields['Source_Keen_campaign__c']= this.sourceDetail['Source_Keen_campaign__c'];
    }
    if(this.archiveDetail!= undefined){
  
        fields['Archive_reason__c']= this.archiveDetail['Archive_reason__c'];
        fields['Archive_Reason_Other__c']= this.archiveDetail['Archive_Reason_Other__c'];

    } 
    if(this.addressDetail!= undefined){
     fields["PersonMailingStreet"] = this.addressDetail['PersonMailingStreet'];
     fields['PersonMailingAddress']= this.addressDetail['PersonMailingAddress'];
     fields['PersonMailingCountry']= this.addressDetail['PersonMailingCountry'];
     fields['PersonMailingCity']= this.addressDetail['PersonMailingCity'];
     fields['PersonMailingStateCode']= this.addressDetail['PersonMailingStateCode'];
     fields['PersonMailingPostalCode']= this.addressDetail['PersonMailingPostalCode'];
    }

    if(this.medDetail != undefined){

        fields['MedicareID__c']=  this.medDetail['MedicareID__c'];
        fields['MedicareEligibilityDate__c']=this.medDetail['MedicareEligibilityDate__c'];
        fields['PlanEnrollmentDate__c']=this.medDetail['PlanEnrollmentDate__c'];
        fields['Part_A_enrollment_date__c']=this.medDetail['Part_A_enrollment_date__c'];
        fields['Part_B_enrollment_date__c']=this.medDetail['Part_B_enrollment_date__c']; 
        fields['MedcaidID__c']=this.medDetail['MedcaidID__c'];
        fields['MediaidEligibilityDate__c']=this.medDetail['MediaidEligibilityDate__c'];
        fields['SSN__c']=this.medDetail['SSN__c'];
        fields['Medicaid_status_verification_date__c']=this.medDetail['Medicaid_status_verification_date__c'];
    }

    if(this.otherDetail != undefined){
  
        fields['Preferred_Language__c']=  this.otherDetail['Preferred_Language__c'];
        fields['CountryOfOrigin__c']=this.otherDetail['CountryOfOrigin__c'];
        fields['Military_Vet__c']=this.otherDetail['Military_Vet__c'];
        
    }
        
        
        this.template.querySelector('lightning-record-edit-form').submit(fields);

    }

    handleSuccess(event) {
        console.log(event.target);
        debugger;
        this.recordId = event.detail.id;
        this.showEditField = false;
       // this.disabledFields = true;
        let temp = JSON.parse(JSON.stringify(this.account.data.fields));
        console.log('===>Temp' + temp);
        for (const key in temp) {
            temp[key] = temp[key].value;
        }
        this.phoneDetail = temp;

        const evt = new ShowToastEvent({
            title: 'Success',
            message: 'The record has been updated',
            variant: 'success',
            mode: 'dismissable'
        });
        this.dispatchEvent(evt);
   
    }
    handleCancel(event) {
        this.showEditField = false;
       // this.disabledFields = true;

    }
    handleEdit() {
        //this.phoneDetail = this.account.data.fields;

        let temp = JSON.parse(JSON.stringify(this.account.data.fields));
        console.log('===>Temp' + temp);
        for (const key in temp) {
            temp[key] = temp[key].value;
        }
        this.phoneDetail = temp;
        this.showEditField = true;
      //  this.disabledFields = false;
    }
    handleLoad(event) {
        this.areDetailsVisible=true; 
         window.console.time("LDS call");
         //details coming on the load of form
         // The LDS will take a few seconds to load the component.
         const recUi = event.detail;
         window.console.timeEnd("LDS call");
         //  window.console.log("OnLoadData-", JSON.stringify(recUi));
     }
     navigateToRecordPage() {

       window.location.href ='../lightning/r/Account/' +this.recordId+ '/view';
}

getPhoneDataFromModal(event){
    //this.phoneDetail = event.detail;
    let temPhnDetail = JSON.parse(JSON.stringify(event.detail)); 
    if (temPhnDetail.hasOwnProperty("Phone")) 
    this.phoneDetail["Phone"]  = temPhnDetail["Phone"];
    if (temPhnDetail.hasOwnProperty("PersonAssistantPhone")) 
    this.phoneDetail["PersonAssistantPhone"] = temPhnDetail["PersonAssistantPhone"];
    if (temPhnDetail.hasOwnProperty("PersonHomePhone")) 
    this.phoneDetail["PersonHomePhone"] = temPhnDetail["PersonHomePhone"];
    if (temPhnDetail.hasOwnProperty("PersonMobilePhone")) 
    this.phoneDetail["PersonMobilePhone"] = temPhnDetail["PersonMobilePhone"];
    if (temPhnDetail.hasOwnProperty("PersonOtherPhone")) 
    this.phoneDetail["PersonOtherPhone"] = temPhnDetail["PersonOtherPhone"];
    if (temPhnDetail.hasOwnProperty("PrimaryContactFieldName__c")) 
    this.phoneDetail["PrimaryContactFieldName__c"] = temPhnDetail["PrimaryContactFieldName__c"];
 
     console.log(this.phoneDetail);
     if(this.phoneDetail[this.phoneDetail["PrimaryContactFieldName__c"]] != null)
     this.template.querySelector(".primaryPhone").value = this.phoneDetail[this.phoneDetail["PrimaryContactFieldName__c"]];
     else
     this.template.querySelector(".primaryPhone").value = this.phoneDetail["Phone"];
     this.isModalOpen = false;
     this.isPhoneChanged = false;
}

getPTCDataFromModal(event){

    this.ptcDetail =  event.detail;
    console.log(this.ptcDetail);
    //this.template.querySelector(".primaryPhone").value = this.phoneDetail["Phone"];
    this.isModalOpen = false;
}
getSourceDataFromModal(event){

    this.sourceDetail =  event.detail;
    console.log(this.sourceDetail);
    //this.template.querySelector(".primaryPhone").value = this.phoneDetail["Phone"];
    this.isModalOpen = false;
}
getMeddataFromModal(event){
    console.log("bingo");
    debugger;

    this.medDetail =  event.detail;
    console.log(this.medDetail);
    //this.template.querySelector(".primaryPhone").value = this.phoneDetail["Phone"];
    this.isMedModalOpen = false;
}

getOtherDataFromModal(event){
    console.log("bingo");
    debugger;

    this.otherDetail =  event.detail;
    console.log(this.medDetail);
    //this.template.querySelector(".primaryPhone").value = this.phoneDetail["Phone"];
    this.isOtherModalOpen = false;
}

getArchiveDataFromModal(event){
    console.log("bingo");
    debugger;

    this.archiveDetail =  event.detail;
    console.log(this.archiveDetail);
    //this.template.querySelector(".primaryPhone").value = this.phoneDetail["Phone"];
    this.isModalOpen = false;
}

getAddressdataFromModal(event){
    console.log("bingo");
    debugger;

    this.addressDetail =  event.detail;

   let tempAddr = JSON.parse(JSON.stringify( this.addressDetail));
    console.log(this.addressDetail);
    this.template.querySelector("lightning-input-field[data-id=addressOutput]").value =  tempAddr.PersonMailingStreet;
  
   // this.template.querySelector("lightning-output-field[data-id=addressOutput]").value.PersonMailingStreet = tempAddr.PersonMailingStreet;
   // this.template.querySelector("lightning-output-field[data-id=addressOutput]").value.PersonMailingCity = tempAddr.PersonMailingCity;
   // this.template.querySelector("lightning-output-field[data-id=addressOutput]").value.PersonMailingCountry = tempAddr.PersonMailingCountry;
   // this.template.querySelector("lightning-output-field[data-id=addressOutput]").value.PersonMailingStateCode = tempAddr.PersonMailingStateCode;
   // this.template.querySelector("lightning-output-field[data-id=addressOutput]").value.PersonMailingPostalCode = tempAddr.PersonMailingPostalCode;


    //this.template.querySelector(".primaryPhone").value = this.phoneDetail["Phone"];
    this.isModalOpen = false;
}

}
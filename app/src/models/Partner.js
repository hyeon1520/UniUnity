"use strict";

const PartnerStorage = require("./PartnerStorage");

class Partner{
    async getUniversityID(university_name){
        try{
            const response = await PartnerStorage.getUniversityID(university_name);
            return response;
        }catch(err){
            return{success:false,msg:err};
        }
    }
    async getPartnerStores(university_id){
        try{
            const response = await PartnerStorage.getPartnerStores(university_id);
            return response;
        }catch(err){
            return{success:false,msg:err};
        }
    }
};

module.exports = Partner;
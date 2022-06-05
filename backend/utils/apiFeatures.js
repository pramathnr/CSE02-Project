class ApiFeatures {
    constructor(query, queryStr){
        this.query = query;
        this.queryStr = queryStr;
    }

    //search feature
    search(){
        const keyword = this.queryStr.keyword ? {
            name:{
                $regex:this.queryStr.keyword,
                $options: "i",
            }
        } : {}

        this.query = this.query.find({...keyword});
        return this;
    }

    //filter feature
    filter(){
        const queryCopy = {...this.queryStr};

        //Removing some field for categories
        const removeFields = ["keyword","page","limit"];
        removeFields.forEach(key=>delete queryCopy[key])

        //filter for price and rating
        let queryStr = JSON.stringify(queryCopy);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);


        this.query = this.query.find(JSON.parse(queryStr));

        return this;
    }

    //products per page
    pagination(resultPerPage){
        const currentPage = Number(this.queryStr.page) || 1;

        const skip = resultPerPage * (currentPage-1);

        this.query = this.query.limit(resultPerPage).skip(skip);

        return this;
    }
}



module.exports = ApiFeatures
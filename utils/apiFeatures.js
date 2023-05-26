class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
    // this.filter().sort().limitFeilds().pagination();
  }
  filter() {
    const queryObj = { ...this.queryString };
    const excludedFeilds = ['page', 'limit', 'sort', 'feilds'];
    excludedFeilds.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);

    this.query.find(JSON.parse(queryStr));

    return this;
  }
  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }
  limitFeilds() {
    if (this.queryString.feilds) {
      const feilds = this.queryString.feilds.split(',').join(' ');
      this.query = this.query.select(feilds);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }
  pagination() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

module.exports = APIFeatures;

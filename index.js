const moment = require("moment");
async function paginate(model, params) {
    const options = params.options || {};
    let query = params.query || {};
    const search = params.search || [];
    const range = params.range || {};
    let populate = options.populate;
    let $or = [];
    let pagination = options.pagination;
    let page = 1, limit = 5, skip;
    let select = options.select || [];
    let order = options.order || {};
    if (Array.isArray(search) && search.length) {
        search.forEach((element) => {
            $or.push({ [element[0]]: new RegExp(element[1], 'i') })
        });
        Object.assign(query, { $or });
    }
    if (Object.getOwnPropertyNames(range).length > 0) {
        let $and = [];
        for (let key in range) {
            let upperRange, lowerRange;
            if (range[key][0]) {
                if (typeof range[key][0] !== "number") upperRange = moment(range[key][0]).toISOString();
                else upperRange = range[key][0];
                $and.push({ [key]: { $gte: upperRange } })
            }
            if (range[key][1]) {
                if (typeof range[key][1] !== "number") lowerRange = moment(range[key][1]).toISOString();
                else lowerRange = range[key][1];
                $and.push({ [key]: { $lte: lowerRange } })
            }
        }
        Object.assign(query, { $and });
    }
    if (!Array.isArray(populate)) populate = [];
    const records = await model.countDocuments(query);
    if (pagination) {
        page = Number(options.page) || 1;
        limit = Number(options.limit) || 5;
        skip = (page - 1) * limit;
    }
    if (!pagination) limit = records;
    if (pagination === undefined) limit = 5;
    skip = (page - 1) * limit;
    const docs = await model.find(query).lean().sort(order).populate(populate).select(select).limit(limit).skip(skip);
    return { docs, paginate: { totalRecords: records, page } };
}
module.exports = paginate;
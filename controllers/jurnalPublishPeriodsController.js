import Jurnal from "../models/Jurnal.js";
import JurnalPublishPeriods from "../models/JurnalPublishPeriods.js";

const createJurnalPublishPeriods = async (req, res, next) => {
    try {
        const { month } = req.body;

        const jurnalPublishPeriod = await JurnalPublishPeriods.findOne({ month });

        if (jurnalPublishPeriod) {
            const error = new Error("Publish Periods already exists");
            return next(error);
        }

        const newJurnalPublishPeriod = new JurnalPublishPeriods({
            month
        });

        const savedJurnalPublishPeriod = await newJurnalPublishPeriod.save();
        return res.status(201).json(savedJurnalPublishPeriod);

    } catch (error) {
        next(error);
    }
}

const getSinglePublishPeriod = async (req, res, next) => {
    try {
        const jurnalPublishPeriod = await JurnalPublishPeriods.findById(
            req.params.jurnalPublishPeriodId
        ); 

        if(!jurnalPublishPeriod) {
            const error = new Error("Publish Period was not found!");
            return next(error);
        }

        return res.json(jurnalPublishPeriod);
    } catch (error) {
        next(error)
    }
}

const getAllJurnalPublishPeriods = async (req, res, next) => {
    try {
        const filter = req.query.searchKeyword;
        let where = {};
        if(filter) {
            where.month = { $regex: filter, $options: "i"};
        }
        let query = JurnalPublishPeriods.find(where);
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * pageSize;
        const total = await JurnalPublishPeriods.find(where).countDocuments();
        const pages = Math.ceil(total / pageSize);

        res.header({
            "x-filter" : filter,
            "x-totalcount" : JSON.stringify(total),
            "x-currentpage" : JSON.stringify(page),
            "x-pagesize" : JSON.stringify(pageSize),
            "x-totalpagecount" : JSON.stringify(pages)
        })

        if (page > pages) {
            return res.json([])
        }

        const result = await query
            .skip(skip)
            .limit(pageSize)
            .sort({ updatedAt: "desc" })
        
        return res.json(result)
    } catch (error) {
        next(error)
    }
}

const getAllJurnalPublishPeriodsWithoutLimit = async (req, res, next) => {
  try {
    const filter = req.query.searchKeyword;
    let where = {};

    if (filter) {
      where.month = { $regex: filter, $options: "i" };
    }

    const result = await JurnalPublishPeriods.find(where).sort({ updatedAt: "desc" });

    res.header({
      "x-filter": filter || "",
      "x-totalcount": JSON.stringify(result.length),
    });

    return res.json(result);
  } catch (error) {
    next(error);
  }
};


const updateJurnalPublishPeriod = async (req, res, next) => {
    try {
        const { month } = req.body;

        const jurnalPublishPeriod = await JurnalPublishPeriods.findByIdAndUpdate(
            req.params.jurnalPublishPeriodId,
            {
                month,
            },
            {
                new: true
            }
        )

        if(!jurnalPublishPeriod) {
            const error = new Error("Track was not found");
            return next(error)
        }

        return res.json(jurnalPublishPeriod)
    } catch (error) {
        next(error)
    }
}

const deleteJurnaPublishPeriods = async (req, res, next) => {
    try {
        const publishPeriodId  = req.params.jurnalPublishPeriodId;

        await Jurnal.updateMany(
                { publishperiods: { $in: [publishPeriodId] } },
                { $pull: { publishperiods: publishPeriodId } }
        );
      
        await JurnalPublishPeriods.deleteOne({ _id: publishPeriodId });

        res.send({
            message: "Jurnal publish period is successfully deleted!"
        });

    } catch (error) {
        next(error)
    }
}

export {
    createJurnalPublishPeriods,
    getSinglePublishPeriod,
    getAllJurnalPublishPeriods,
    updateJurnalPublishPeriod,
    deleteJurnaPublishPeriods,
    getAllJurnalPublishPeriodsWithoutLimit
}
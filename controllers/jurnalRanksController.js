import Jurnal from "../models/Jurnal.js";
import JurnalRanks from "../models/JurnalRanks.js";

const createJurnalRank = async (req, res, next) => {
    try {
        const { name, description } = req.body;

        const jurnalRank = await JurnalRanks.findOne({ name });

        if (jurnalRank) {
            const error = new Error("Rank already exists");
            return next(error);
        }

        const newJurnalRank = new JurnalRanks({
            name, description
        });

        const savedJurnalRank = await newJurnalRank.save();
        return res.status(201).json(savedJurnalRank);

    } catch (error) {
        next(error);
    }
}

const getSingleRank = async (req, res, next) => {
    try {
        const jurnalRank = await JurnalRanks.findById(
            req.params.jurnalRankId
        ); 

        if(!jurnalRank) {
            const error = new Error("Rank was not found!");
            return next(error);
        }

        return res.json(jurnalRank);
    } catch (error) {
        next(error)
    }
}

const getAllJurnalRanks = async (req, res, next) => {
    try {
        const filter = req.query.searchKeyword;
        let where = {};
        if(filter) {
            where.name = { $regex: filter, $options: "i"};
        }
        let query = JurnalRanks.find(where);
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * pageSize;
        const total = await JurnalRanks.find(where).countDocuments();
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

const getAllJurnalRanksWithoutLimit = async (req, res, next) => {
  try {
    const filter = req.query.searchKeyword;
    let where = {};

    if (filter) {
      where.name = { $regex: filter, $options: "i" };
    }

    const result = await JurnalRanks.find(where).sort({ updatedAt: "desc" });

    res.header({
      "x-filter": filter || "",
      "x-totalcount": JSON.stringify(result.length),
    });

    return res.json(result);
  } catch (error) {
    next(error);
  }
};


const updateJurnalRank = async (req, res, next) => {
    try {
        const { name } = req.body;
        const { description } = req.body;

        const jurnalRank = await JurnalRanks.findByIdAndUpdate(
            req.params.jurnalRankId,
            {
                name,
                description
            },
            {
                new: true
            }
        )

        if(!jurnalRank) {
            const error = new Error("Rank was not found");
            return next(error)
        }

        return res.json(jurnalRank)
    } catch (error) {
        next(error)
    }
}

const deleteJurnalRanks = async (req, res, next) => {
    try {
        const rankId  = req.params.jurnalRankId;

        await Jurnal.updateMany(
                { ranks: { $in: [rankId] } },
                { $pull: { ranks: rankId } }
        );
      
        await JurnalRanks.deleteOne({ _id: rankId });

        res.send({
            message: "Jurnal rank is successfully deleted!"
        });

    } catch (error) {
        next(error)
    }
}

export {
    createJurnalRank,
    getSingleRank,
    getAllJurnalRanks,
    updateJurnalRank,
    deleteJurnalRanks,
    getAllJurnalRanksWithoutLimit
}
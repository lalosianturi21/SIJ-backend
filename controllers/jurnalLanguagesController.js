import Jurnal from "../models/Jurnal.js";
import JurnalLanguages from "../models/JurnalLanguages.js";


const createJurnalLanguage = async (req, res, next) => {
    try {
        const { name } = req.body;

        const jurnalLanguage = await JurnalLanguages.findOne({ name });

        if (jurnalLanguage) {
            const error = new Error("Language already exists");
            return next(error);
        }

        const newJurnalLanguage = new JurnalLanguages({
            name,
        });

        const savedJurnalLanguage = await newJurnalLanguage.save();

        return res.status(201).json(savedJurnalLanguage);
    } catch (error) {
        next(error);
    }
};

const getSingleLanguage = async (req, res, next) => {
    try {
        const jurnalLanguage = await JurnalLanguages.findById(
            req.params.jurnalLanguageId
        );

        if (!jurnalLanguage) {
            const error = new Error("Language not found");
            return next(error);
        }

        return res.json(jurnalLanguage)
    } catch (error) {
        next(error);
    }
}

const getAllJurnalLanguages = async (req, res, next) => {
    try {
        const filter = req.query.searchKeyword;
        let where = {};
        if (filter) {
            where.name = { $regex: filter, $options: "i" };
        }
        let query = JurnalLanguages.find(where);
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * pageSize;
        const total = await JurnalLanguages.find(where).countDocuments();
        const pages = Math.ceil(total / pageSize);

        res.header({
            "x-filter": filter,
            "x-totalcount": JSON.stringify(total),
            "x-currentpage": JSON.stringify(page),
            "x-pagesize": JSON.stringify(pageSize),
            "x-totalpagecount": JSON.stringify(pages),
        })

        if (page > pages) {
            return res.json([])
        };

        const result = await query
            .skip(skip)
            .limit(pageSize)
            .sort({ updatedAt: "desc" });

        return res.json(result)

    } catch (error) {
        next(error);
    }

}

const getAllJurnalLanguagesWithoutLimit = async (req, res, next) => {
  try {
    const filter = req.query.searchKeyword;
    let where = {};

    if (filter) {
      where.name = { $regex: filter, $options: "i" };
    }

    const result = await JurnalLanguages.find(where).sort({ updatedAt: "desc" });

    res.header({
      "x-filter": filter || "",
      "x-totalcount": JSON.stringify(result.length),
    });

    return res.json(result);
  } catch (error) {
    next(error);
  }
};



const updateJurnalLanguage = async (req, res, next) => {
    try {
        const { name } = req.body;
        const jurnalLanguage = await JurnalLanguages.findByIdAndUpdate(
            req.params.jurnalLanguageId,
            {
                name,
            },
            { 
                new: true 
            }
        );

        if (!jurnalLanguage) {
            const error = new Error("Language not found");
            return next(error);
        }

        return res.json(jurnalLanguage)
    } catch (error) {
        next(error);
    }
}


const deleteJurnalLanguages = async (req, res, next) => {
    try {
        const languageId  = req.params.jurnalLanguageId;

        await Jurnal.updateMany(
                { languages: { $in: [languageId] } },
                { $pull: { languages: languageId } }
        );
      
        await JurnalLanguages.deleteOne({ _id: languageId });

        res.send({
            message: "Jurnal language is successfully deleted!"
        });

    } catch (error) {
        next(error)
    }
}

export {
    createJurnalLanguage,
    getSingleLanguage,
    getAllJurnalLanguages,
    updateJurnalLanguage,
    deleteJurnalLanguages,
    getAllJurnalLanguagesWithoutLimit
}
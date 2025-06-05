import Jurnal from "../models/Jurnal.js";
import JurnalCountries from "../models/JurnalCountries.js";


const createJurnalCountry = async (req, res, next) => {
    try {
        const { name }  = req.body;

        const jurnalCountry = await JurnalCountries.findOne({ name });

        if(jurnalCountry) {
            const error = new Error("Country already exists");
            return next(error);
        }

        const newJurnalCountry = new JurnalCountries({
            name,
        })

        const savedJurnalCountry = await newJurnalCountry.save();

        return res.status(201).json(savedJurnalCountry);

    } catch (error) {
        next(error);
    }
}

const getSingleCountry = async (req, res, next) => {
    try {
        const jurnalCountry = await JurnalCountries.findById(
            req.params.jurnalCountryId
        );

        if (!jurnalCountry) {
            const error = new Error("Country not found");
            return next(error)
        }

        return res.json(jurnalCountry);
    } catch (error) {
        next(error);
    }
}

const getAllJurnalCountries = async (req, res, next) => {
    try {
        const filter = req.query.searchKeyword;
        let where = {};
        if(filter) {
            where.name = {$regex: filter, $options: "i"};
        }
        let query = JurnalCountries.find(where);
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * pageSize;
        const total = await JurnalCountries.find(where).countDocuments();
        const pages = Math.ceil(total / pageSize);

        res.header({
            "x-filter" : filter,
            "x-totalcount" : JSON.stringify(total),
            "x-currentpage" : JSON.stringify(page),
            "x-pagesize" : JSON.stringify(pageSize),
            "x-totalpagecount" : JSON.stringify(pages),
        });

        if (page > pages) {
            return res.json([])
        }

        const result = await query 
            .skip(skip)
            .limit(pageSize)
            .sort({ updatedAt: "desc" })
        
            return res.json(result);
    } catch (error) {
        next(error)
    }
}

const getAllJurnalCountriesWithoutLimit = async (req, res, next) => {
  try {
    const filter = req.query.searchKeyword;
    let where = {};

    if (filter) {
      where.name = { $regex: filter, $options: "i" };
    }

    const result = await JurnalCountries.find(where).sort({ updatedAt: "desc" });

    res.header({
      "x-filter": filter || "",
      "x-totalcount": JSON.stringify(result.length),
    });

    return res.json(result);
  } catch (error) {
    next(error);
  }
};


const updateJurnalCountry = async (req, res, next) => {
    try {
        const { name } = req.body;

        const jurnalCountry = await JurnalCountries.findByIdAndUpdate(
            req.params.jurnalCountryId,
            {
                name,
            },
            {
                new: true,
            }
        );

        if(!jurnalCountry) {
            const error = new Error("Country was not found");
            return next(error)
        }

        return res.json(jurnalCountry);
    } catch (error) {
        next(error)
    }
}

const deleteJurnalCountries = async (req, res, next) => {
    try {
        const countryId  = req.params.jurnalCountryId;

        await Jurnal.updateMany(
                { countries: { $in: [countryId] } },
                { $pull: { countries: countryId } }
        );
      
        await JurnalCountries.deleteOne({ _id: countryId });

        res.send({
            message: "Jurnal country is successfully deleted!"
        });

    } catch (error) {
        next(error)
    }
}

export {
    createJurnalCountry,
    getSingleCountry,
    getAllJurnalCountries,
    updateJurnalCountry,
    deleteJurnalCountries
}
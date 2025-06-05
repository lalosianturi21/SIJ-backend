import Jurnal from "../models/Jurnal.js";
import JurnalCurrencies from "../models/JurnalCurrencies.js";

const createJurnalCurrency = async (req, res, next) => {
    try {
        const { name, symbol } = req.body;

        const jurnalCurrency = await JurnalCurrencies.findOne({ name, symbol });

        if (jurnalCurrency) {
            const error = new Error("Currency already exists");
            return next(error);
        }

        const newJurnalCurrency = new JurnalCurrencies({
            name,
            symbol,
        });

        const savedJurnalCurrency = await newJurnalCurrency.save();

        return res.status(201).json(savedJurnalCurrency);

    } catch (error) {
        next(error);
    }
}

const getSingleCurrency = async (req, res, next) => {
    try {
        const jurnalCurrency = await JurnalCurrencies.findById(
            req.params.jurnalCurrencyId
        );

        if (!jurnalCurrency) {
            const error = new Error("Currency not found");
            return next(error);
        }

        return res.json(jurnalCurrency)
    } catch (error) {
        next(error);
    }
}

const getAllJurnalCurrencies = async (req, res, next) => {
    try {
        const filter = req.query.searchKeyword;
        let where = {};
        if(filter) {
            where.name = { $regex: filter, $options: "i"};
        }
        let query = JurnalCurrencies.find(where);
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * pageSize;
        const total = await JurnalCurrencies.find(where).countDocuments();  
        const pages = Math.ceil(total / pageSize);

        res.header({
            "x-filter" : filter,
            "x-totalcount" : JSON.stringify(total),
            "x-currentpage" : JSON.stringify(page),
            "x-pagesize" : JSON.stringify(pageSize),
            "x-totalpagecount" : JSON.stringify(pages)
        });

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

const getAllJurnalCurrenciesWithoutLimit = async (req, res, next) => {
  try {
    const filter = req.query.searchKeyword;
    let where = {};

    if (filter) {
      where.name = { $regex: filter, $options: "i" };
    }

    const result = await JurnalCurrencies.find(where).sort({ updatedAt: "desc" });

    res.header({
      "x-filter": filter || "",
      "x-totalcount": JSON.stringify(result.length),
    });

    return res.json(result);
  } catch (error) {
    next(error);
  }
};


const updateJurnalCurrency = async (req, res, next) => {
    try {
        const { name, symbol } = req.body;

        const jurnalCurrency = await JurnalCurrencies.findByIdAndUpdate(
            req.params.jurnalCurrencyId,
            {
                name, symbol,
            },
            {
                new: true,
            }
        )

        if(!jurnalCurrency) {
            const error = new Error("Currency not found");
            return next(error);
        }

        return res.json(jurnalCurrency);
    } catch (error) {
        next(error);
    }
}

const deleteJurnalCurrencies = async (req, res, next) => {
    try {
        const currencyId  = req.params.jurnalCurrencyId;

        await Jurnal.updateMany(
                { currencies: { $in: [currencyId] } },
                { $pull: { currencies: currencyId } }
        );
      
        await JurnalCurrencies.deleteOne({ _id: currencyId });

        res.send({
            message: "Jurnal currency is successfully deleted!"
        });

    } catch (error) {
        next(error)
    }
}


export {
    createJurnalCurrency,
    getSingleCurrency,
    getAllJurnalCurrencies,
    updateJurnalCurrency,
    deleteJurnalCurrencies,
    getAllJurnalCurrenciesWithoutLimit
}
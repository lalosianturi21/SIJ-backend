import Jurnal from "../models/Jurnal.js";
import JurnalInstitutions from "../models/JurnalInstitutions.js";

const createJurnalInstitution = async (req, res, next) => {
    try {
        const { name } = req.body;

        const jurnalInstitution = await JurnalInstitutions.findOne({ name });

        if (jurnalInstitution) {
            const error = new Error("Institution already exists");
            return next(error);
        }

        const newJurnalInstitution = new JurnalInstitutions({
            name,
        });

        const savedJurnalInstitution = await newJurnalInstitution.save();
        return res.status(201).json(savedJurnalInstitution);

    } catch (error) {
        next(error);
    }
}

const getSingleInstitution = async (req, res, next) => {
    try {
        const jurnalInstitution = await JurnalInstitutions.findById(
            req.params.jurnalInstitutionId
        ); 

        if(!jurnalInstitution) {
            const error = new Error("Institution was not found!");
            return next(error);
        }

        return res.json(jurnalInstitution);
    } catch (error) {
        next(error)
    }
}

const getAllJurnalInstitutions = async (req, res, next) => {
    try {
        const filter = req.query.searchKeyword;
        let where = {};
        if(filter) {
            where.name = { $regex: filter, $options: "i"};
        }
        let query = JurnalInstitutions.find(where);
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * pageSize;
        const total = await JurnalInstitutions.find(where).countDocuments();
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

const updateJurnalInstitution = async (req, res, next) => {
    try {
        const { name } = req.body;

        const jurnalInstitution = await JurnalInstitutions.findByIdAndUpdate(
            req.params.jurnalInstitutionId,
            {
                name,
            },
            {
                new: true
            }
        )

        if(!jurnalInstitution) {
            const error = new Error("Institution was not found");
            return next(error)
        }

        return res.json(jurnalInstitution)
    } catch (error) {
        next(error)
    }
}


const deleteJurnalInstitutions = async (req, res, next) => {
    try {
        const institutionId  = req.params.jurnalInstitutionId;

        await Jurnal.updateMany(
                { institutions: { $in: [institutionId] } },
                { $pull: { institutions: institutionId } }
        );
      
        await JurnalInstitutions.deleteOne({ _id: institutionId });

        res.send({
            message: "Jurnal institution is successfully deleted!"
        });

    } catch (error) {
        next(error)
    }
}


export {
    createJurnalInstitution,
    getSingleInstitution,
    getAllJurnalInstitutions,
    updateJurnalInstitution,
    deleteJurnalInstitutions
}
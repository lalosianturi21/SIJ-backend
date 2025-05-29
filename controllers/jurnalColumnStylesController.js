import Jurnal from "../models/Jurnal.js";
import JurnalColumnStyles from "../models/JurnalColumnStyles.js";

const createJurnalColumnStyle = async (req, res, next) => {
    try {
        const { name, description } = req.body;

        const JurnalColumnStyle = await JurnalColumnStyles.findOne({ name });

        if (JurnalColumnStyle) {
            const error = new Error("Column Style already exists");
            return next(error);
        }

        const newJurnalColumnStyle = new JurnalColumnStyles({
            name, description
        });

        const savedJurnalColumnStyle = await newJurnalColumnStyle.save();
        return res.status(201).json(savedJurnalColumnStyle);

    } catch (error) {
        next(error);
    }
}

const getSingleColumnStyle = async (req, res, next) => {
    try {
        const jurnalColumnStyle = await JurnalColumnStyles.findById(
            req.params.jurnalColumnStyleId
        ); 

        if(!jurnalColumnStyle) {
            const error = new Error("Column Style was not found!");
            return next(error);
        }

        return res.json(jurnalColumnStyle);
    } catch (error) {
        next(error)
    }
}

const getAllJurnalColumnStyles = async (req, res, next) => {
    try {
        const filter = req.query.searchKeyword;
        let where = {};
        if(filter) {
            where.name = { $regex: filter, $options: "i"};
        }
        let query = JurnalColumnStyles.find(where);
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * pageSize;
        const total = await JurnalColumnStyles.find(where).countDocuments();
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

const updateJurnalColumnStyle = async (req, res, next) => {
    try {
        const { name } = req.body;
        const { description } = req.body;

        const jurnalColumnStyle = await JurnalColumnStyles.findByIdAndUpdate(
            req.params.jurnalColumnStyleId,
            {
                name,
                description
            },
            {
                new: true
            }
        )

        if(!jurnalColumnStyle) {
            const error = new Error("Column Style was not found");
            return next(error)
        }

        return res.json(jurnalColumnStyle)
    } catch (error) {
        next(error)
    }
}


const deleteJurnalColumnStyles = async (req, res, next) => {
    try {
        const columnStyleId  = req.params.jurnalColumnStyleId;

        await Jurnal.updateMany(
                { columnstyles: { $in: [columnStyleId] } },
                { $pull: { columnstyles: columnStyleId } }
        );
      
        await JurnalColumnStyles.deleteOne({ _id: columnStyleId });

        res.send({
            message: "Jurnal column style is successfully deleted!"
        });

    } catch (error) {
        next(error)
    }
}

export {
    createJurnalColumnStyle,
    getSingleColumnStyle,
    getAllJurnalColumnStyles,
    updateJurnalColumnStyle,
    deleteJurnalColumnStyles
}
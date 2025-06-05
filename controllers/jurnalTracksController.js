import Jurnal from "../models/Jurnal.js";
import JurnalTracks from "../models/JurnalTracks.js";

const createJurnalTrack = async (req, res, next) => {
    try {
        const { name, description } = req.body;

        const jurnalTrack = await JurnalTracks.findOne({ name });

        if (jurnalTrack) {
            const error = new Error("Track already exists");
            return next(error);
        }

        const newJurnalTrack = new JurnalTracks({
            name, description
        });

        const savedJurnalTrack = await newJurnalTrack.save();
        return res.status(201).json(savedJurnalTrack);

    } catch (error) {
        next(error);
    }
}

const getSingleTrack = async (req, res, next) => {
    try {
        const jurnalTrack = await JurnalTracks.findById(
            req.params.jurnalTrackId
        ); 

        if(!jurnalTrack) {
            const error = new Error("Track was not found!");
            return next(error);
        }

        return res.json(jurnalTrack);
    } catch (error) {
        next(error)
    }
}

const getAllJurnalTracks = async (req, res, next) => {
    try {
        const filter = req.query.searchKeyword;
        let where = {};
        if(filter) {
            where.name = { $regex: filter, $options: "i"};
        }
        let query = JurnalTracks.find(where);
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * pageSize;
        const total = await JurnalTracks.find(where).countDocuments();
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


const getAllJurnalTracksWithoutLimit = async (req, res, next) => {
  try {
    const filter = req.query.searchKeyword;
    let where = {};

    if (filter) {
      where.name = { $regex: filter, $options: "i" };
    }

    const result = await JurnalTracks.find(where).sort({ updatedAt: "desc" });

    res.header({
      "x-filter": filter || "",
      "x-totalcount": JSON.stringify(result.length),
    });

    return res.json(result);
  } catch (error) {
    next(error);
  }
};


const updateJurnalTrack = async (req, res, next) => {
    try {
        const { name } = req.body;
        const { description } = req.body;

        const jurnalTrack = await JurnalTracks.findByIdAndUpdate(
            req.params.jurnalTrackId,
            {
                name,
                description
            },
            {
                new: true
            }
        )

        if(!jurnalTrack) {
            const error = new Error("Track was not found");
            return next(error)
        }

        return res.json(jurnalTrack)
    } catch (error) {
        next(error)
    }
}

const deleteJurnalTracks = async (req, res, next) => {
    try {
        const trackId  = req.params.jurnalTrackId;

        await Jurnal.updateMany(
                { tracks: { $in: [trackId] } },
                { $pull: { tracks: trackId } }
        );
      
        await JurnalTracks.deleteOne({ _id: trackId });

        res.send({
            message: "Jurnal track is successfully deleted!"
        });

    } catch (error) {
        next(error)
    }
}

export {
    createJurnalTrack,
    getSingleTrack,
    getAllJurnalTracks,
    updateJurnalTrack,
    deleteJurnalTracks
}
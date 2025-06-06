import { cloudinary } from "../middleware/uploadPictureMiddleware.js";
import Comment from "../models/Comment.js";
import Jurnal from "../models/Jurnal.js";
import { v4 as uuidv4} from "uuid";
import { Parser } from 'json2csv'; // Tambahkan ini di atas


const createJurnal = async (req, res, next) => {
    try {
        const { name = "NEW JURNAL" } = req.body;
        const slug = uuidv4();

        // Auto rename if duplicate
        let finalName = name;
        let counter = 1;
        while (await Jurnal.findOne({ name: finalName })) {
            finalName = `${name} ${counter}`;
            counter++;
        }

        const jurnal = new Jurnal({
            name: finalName,
            url: "https://www.com",
            apc: 100000,
            rating_avg: 5,
            slug,
            contact: "08521608",
            email: "@gmail.com",
            cover: "",
            user: req.user._id
        });

        const createdJurnal = await jurnal.save();
        return res.status(201).json(createdJurnal);

    } catch (error) {
        next(error);
    }
};

const updateJurnal = async (req, res, next) => {
    try {
        console.log("Request file:", req.file);

        const jurnal = await Jurnal.findOne({ slug: req.params.slug });
        if (!jurnal) {
            return next(new Error("Jurnal not found"));
        }

        let requestData;
        try {
            requestData = JSON.parse(req.body.document);
        } catch (error) {
            return next(new Error("Invalid JSON format in request body"));
        }

        const {
            name, url, apc, rating_avg, slug,
            contact, email, institutions, columnstyles,
            countries, currencies, languages, publishperiods,
            ranks, tracks
        } = requestData;

        // ✅ Validasi: Cek duplikat name (case-insensitive), kecuali milik sendiri
        if (name && name.toLowerCase() !== jurnal.name.toLowerCase()) {
            const existingJurnal = await Jurnal.findOne({
                name: { $regex: `^${name}$`, $options: 'i' }
            });

            if (existingJurnal && existingJurnal._id.toString() !== jurnal._id.toString()) {
                return next(new Error("Jurnal name already exists"));
            }
        }

        // 📝 Update fields jika ada
        jurnal.name = name || jurnal.name;
        jurnal.url = url || jurnal.url;
        jurnal.apc = apc || jurnal.apc;
        jurnal.rating_avg = rating_avg || jurnal.rating_avg;
        jurnal.slug = slug || jurnal.slug;
        jurnal.contact = contact || jurnal.contact;
        jurnal.email = email || jurnal.email;
        jurnal.institutions = institutions || jurnal.institutions;
        jurnal.columnstyles = columnstyles || jurnal.columnstyles;
        jurnal.countries = countries || jurnal.countries;
        jurnal.currencies = currencies || jurnal.currencies;
        jurnal.languages = languages || jurnal.languages;
        jurnal.publishperiods = publishperiods || jurnal.publishperiods;
        jurnal.ranks = ranks || jurnal.ranks;
        jurnal.tracks = tracks || jurnal.tracks;

        // 🖼️ Handle image upload ke Cloudinary
        if (req.file) {
            console.log("Uploading new image to Cloudinary...");
            try {
                if (jurnal.cover) {
                    console.log("Deleting old image: ", jurnal.cover);
                    const publicId = jurnal.cover.split("/").pop().split(".")[0];
                    await cloudinary.uploader.destroy(`post_images/${publicId}`);
                }
                jurnal.cover = req.file.path;
                console.log("New image uploaded:", jurnal.cover);
            } catch (uploadError) {
                return next(new Error(`Cloudinary error: ${uploadError.message}`));
            }
        } else {
            console.log("No new image uploaded.");
        }

        const updatedJurnal = await jurnal.save();
        return res.json(updatedJurnal);

    } catch (error) {
        next(error);
    }
};



const getAllJurnals = async (req, res, next) => {
  try {
    const filter = req.query.searchKeyword || "";
    const institutions = req.query.institutions ? req.query.institutions.split(",") : [];
    const countries = req.query.countries ? req.query.countries.split(",") : [];
    const currencies = req.query.currencies ? req.query.currencies.split(",") : [];
    const languages = req.query.languages ? req.query.languages.split(",") : [];
    const publishperiods = req.query.publishperiods ? req.query.publishperiods.split(",") : [];
    const ranks = req.query.ranks ? req.query.ranks.split(",") : [];
    const tracks = req.query.tracks ? req.query.tracks.split(",") : [];
    const columnstyles = req.query.columnstyles ? req.query.columnstyles.split(",") : [];

    let where = {};

    if (filter) {
      where.$or = [
        { name: { $regex: filter, $options: "i" } },
      ];
    }

    if (institutions.length > 0) where.institutions = { $in: institutions };
    if (columnstyles.length > 0) where.columnstyles = { $in: columnstyles }; // ObjectId langsung
    if (countries.length > 0) where.countries = { $in: countries };
    if (currencies.length > 0) where.currencies = { $in: currencies };
    if (languages.length > 0) where.languages = { $in: languages };
    if (publishperiods.length > 0) where.publishperiods = { $in: publishperiods };
    if (ranks.length > 0) where.ranks = { $in: ranks };
    if (tracks.length > 0) where.tracks = { $in: tracks };

    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * pageSize;

    const total = await Jurnal.countDocuments(where);
    const pages = Math.ceil(total / pageSize);

    res.header({
      "x-filter": filter,
      "x-totalcount": JSON.stringify(total),
      "x-currentpage": JSON.stringify(page),
      "x-pagesize": JSON.stringify(pageSize),
      "x-totalpagecount": JSON.stringify(pages),
    });

    if (page > pages) return res.json([]);

    const result = await Jurnal.find(where)
      .skip(skip)
      .limit(pageSize)
      .populate([
        { path: "user", select: ["avatar", "name", "verified"] },
        { path: "institutions", select: ["name"] },
        { path: "columnstyles", select: ["name"] }, 
        { path: "countries", select: ["name"] },
        { path: "currencies", select: ["name"] },
        { path: "languages", select: ["name"] },
        { path: "publishperiods", select: ["month"] },
        { path: "ranks", select: ["name"] },
        { path: "tracks", select: ["name"] },
      ])
      .sort({ updatedAt: "desc" });

    return res.json(result);
  } catch (error) {
    next(error);
  }
};


const getAllJurnalsWithoutLimit = async (req, res, next) => {
  try {
    const filter = req.query.searchKeyword || "";
    const institutions = req.query.institutions ? req.query.institutions.split(",") : [];
    const countries = req.query.countries ? req.query.countries.split(",") : [];
    const currencies = req.query.currencies ? req.query.currencies.split(",") : [];
    const languages = req.query.languages ? req.query.languages.split(",") : [];
    const publishperiods = req.query.publishperiods ? req.query.publishperiods.split(",") : [];
    const ranks = req.query.ranks ? req.query.ranks.split(",") : [];
    const tracks = req.query.tracks ? req.query.tracks.split(",") : [];
    const columnstyles = req.query.columnstyles ? req.query.columnstyles.split(",") : [];

    let where = {};

    if (filter) {
      where.$or = [
        { name: { $regex: filter, $options: "i" } },
      ];
    }

    if (institutions.length > 0) where.institutions = { $in: institutions };
    if (columnstyles.length > 0) where.columnstyles = { $in: columnstyles };
    if (countries.length > 0) where.countries = { $in: countries };
    if (currencies.length > 0) where.currencies = { $in: currencies };
    if (languages.length > 0) where.languages = { $in: languages };
    if (publishperiods.length > 0) where.publishperiods = { $in: publishperiods };
    if (ranks.length > 0) where.ranks = { $in: ranks };
    if (tracks.length > 0) where.tracks = { $in: tracks };

    const result = await Jurnal.find(where)
      .populate([
        { path: "user", select: ["avatar", "name", "verified"] },
        { path: "institutions", select: ["name"] },
        { path: "columnstyles", select: ["name"] },
        { path: "countries", select: ["name"] },
        { path: "currencies", select: ["name"] },
        { path: "languages", select: ["name"] },
        { path: "publishperiods", select: ["month"] },
        { path: "ranks", select: ["name"] },
        { path: "tracks", select: ["name"] },
      ])
      .sort({ updatedAt: "desc" });

    res.header({
      "x-totalcount": JSON.stringify(result.length),
    });

    return res.json(result);
  } catch (error) {
    next(error);
  }
};


const deleteJurnal = async (req, res, next) => {
    try {
        const jurnal = await Jurnal.findOneAndDelete({ slug: req.params.slug })

        if (!jurnal) {
            return next(new Error("Jurnal not found"));
        }

        if (jurnal.cover) {
            const publicId = jurnal.cover.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(`post_images/${publicId}`);
        }

        await Comment.deleteMany({ jurnal: jurnal._id });

        return res.json({ message: "Jurnal successfully deleted"})

    } catch (error) {
        next(error)
    }
}

const getJurnal = async (req, res, next) => {
    try {
        const jurnal = await Jurnal.findOne({ slug: req.params.slug }).populate([
            { path: "user", select: ["avatar", "name"] },
            { path: "institutions", select: ["name"] },
            { path: "columnstyles", select: ["name", "description"] }, 
            { path: "countries", select: ["name"] }, 
            { path: "currencies", select: ["name", "symbol"] }, 
            { path: "languages", select: ["name"] }, 
            { path: "publishperiods", select: ["month"] },
            { path: "ranks", select: ["name", "description"] },
            { path: "tracks", select: ["name", "description"] },
            {
                path: "comments",
                match: { check: true, parent: null },
                populate: [
                    { path: "user", select: ["avatar", "name"] },
                    {
                        path: "replies",
                        match: { check: true },
                        populate: [{ path: "user", select: ["avatar", "name"] }],
                    },
                ],
            },
        ]);

        if (!jurnal) return next(new Error("Jurnal not found"));

        return res.json(jurnal);
    } catch (error) {
        next(error);
    }
}

const exportJurnalCSV = async (req, res, next) => {
  try {
    // Fetch data from the database (you can add any necessary filters here)
    const jurnals = await Jurnal.find({}).populate([
      { path: "user", select: "name" },
      { path: "institutions", select: "name" },
      { path: "columnstyles", select: "name" },
      { path: "countries", select: "name" },
      { path: "currencies", select: "name" },
      { path: "languages", select: "name" },
      { path: "publishperiods", select: "month" },
      { path: "ranks", select: "name" },
      { path: "tracks", select: "name" },
    ]);

    // Format the data for CSV
    const data = jurnals.map((j) => ({
      name: j.name,
      url: j.url,
      apc: j.apc,
      rating_avg: j.rating_avg,
      contact: j.contact,
      email: j.email,
      tracks: j.tracks.map(t => t.name).join(", "),
      columnstyles: j.columnstyles.map(c => c.name).join(", "),
      countries: j.countries.map(c => c.name).join(", "),
      currencies: j.currencies.map(c => c.name).join(", "),
      institutions: j.institutions.map(i => i.name).join(", "),
      languages: j.languages.map(l => l.name).join(", "),
      publishperiods: j.publishperiods.map(p => p.month).join(", "),
      ranks: j.ranks.map(r => r.name).join(", "),
      createdAt: new Date(j.createdAt).toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
    }));

    // Convert data to CSV
    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(data);

    // Send the CSV file in the response
    res.header("Content-Type", "text/csv");
    res.attachment("jurnals.csv");
    res.send(csv);
  } catch (error) {
    next(error);
  }
};


export {
    createJurnal,
    updateJurnal,
    getAllJurnals,
    deleteJurnal,
    getJurnal,
    exportJurnalCSV,
    getAllJurnalsWithoutLimit
}
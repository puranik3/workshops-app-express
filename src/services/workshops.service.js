const mongoose = require("mongoose");
const Workshop = mongoose.model("Workshop");
const pdf = require("pdf-creator-node");
const fs = require("fs");

const getAllWorkshops = async (page, sortField) => {
    // const startIndex = 10 * ( page - 1 );
    // const endIndex = 10 * page;

    // if we do not await, the query does not execute immediately (it will only execute when the function pauses/completes without pausing) - this allows us to customize the query (Add sorting, pagination etc.)
    const query = Workshop.find();

    if (sortField) {
        query.sort({
            [sortField]: 1,
        });
    }

    // pagination (assuming 10 per page)
    query.skip(10 * (page - 1)).limit(10);

    const workshops = await query.exec();
    return workshops;
};

const getWorkshopById = async (id) => {
    try {
        const workshop = await Workshop.findById(id).populate("topics");

        if (workshop === null) {
            const error = new Error("No such workshop");
            error.type = "NotFound";
            throw error;
        }

        return workshop;
    } catch (error) {
        if (error.name === "CastError") {
            const dbError = new Error(`Data type error : ${error.message}`);
            dbError.type = "CastError";
            throw dbError;
        }

        if (error.type === "NotFound") {
            throw error;
        }
    }
};

const addWorkshop = async (workshop) => {
    try {
        const insertedWorkshop = await Workshop.create(workshop);
        return insertedWorkshop;
    } catch (error) {
        if (error.name === "ValidationError") {
            const dbError = new Error(`Validation error : ${error.message}`);
            dbError.type = "ValidationError";
            throw dbError;
        }

        if (error.name === "CastError") {
            const dbError = new Error(`Data type error : ${error.message}`);
            dbError.type = "CastError";
            throw dbError;
        }
    }
};

const updateWorkshop = async (id, workshop) => {
    // by default, $set is applied to the fields
    /**
     *  {
            $set: {
                "name": "Vue JS v2",
                "category": "frontend"
            }
        }
     */
    // by default Mongoose will not perform schema validations on update
    try {
        const updatedWorkshop = await Workshop.findByIdAndUpdate(
            id,
            workshop /*, {
            // returnOriginal: false
            new: true
        } */
        );
        return updatedWorkshop;
    } catch (error) {
        if (error.name === "CastError") {
            const dbError = new Error(`Data type error : ${error.message}`);
            dbError.type = "CastError";
            throw dbError;
        } else if (error.name === "ValidationError") {
            const dbError = new Error(`Validation error : ${error.message}`);
            dbError.type = "ValidationError";
            throw dbError;
        } else {
            throw error;
        }
    }
};

const addSpeakers = async (id, speakers) => {
    // by default, $set is applied to the fields
    // Therefore we ned to construct the update clause ourselves
    const updateClause = {
        $addToSet: {
            speakers: {
                $each: speakers,
            },
        },
    };

    try {
        const updatedWorkshop = await Workshop.findByIdAndUpdate(
            id,
            updateClause
        );
        return updatedWorkshop;
    } catch (error) {
        if (error.name === "CastError") {
            const dbError = new Error(`Data type error : ${error.message}`);
            dbError.type = "CastError";
            throw dbError;
        } else if (error.name === "ValidationError") {
            const dbError = new Error(`Validation error : ${error.message}`);
            dbError.type = "ValidationError";
            throw dbError;
        } else {
            throw error;
        }
    }
};

const deleteWorkshop = async (id) => {
    const deletedWorkshop = await Workshop.findByIdAndRemove(id);

    if (deletedWorkshop === null) {
        const error = new Error("No such workshop");
        error.type = "NotFound";
        throw error;
    }

    return deletedWorkshop;
};

const generateWorkshopsPdf = async () => {
    // Read HTML Template
    const html = fs.readFileSync(
        "templates/workshops-list.template.html",
        "utf8"
    );

    const options = {
        format: "A4",
        orientation: "portrait",
        border: "10mm",
        header: {
            height: "45mm",
            contents:
                '<div style="text-align: center;">Workshops App | List of Workshops</div>',
        },
        footer: {
            height: "28mm",
            contents: {
                first: "Cover page",
                2: "Second page", // Any page number is working. 1-based index
                default:
                    '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
                last: "Last Page",
            },
        },
    };

    // const workshops = await getAllWorkshops();

    var users = [
        {
          name: "Shyam",
          age: "26",
        },
        {
          name: "Navjot",
          age: "26",
        },
        {
          name: "Vitthal",
          age: "26",
        },
      ];
      var document = {
        html: html,
        data: {
          users: users,
        },
        path: "./output.pdf",
        type: "",
      };

    // const document = {
    //     html: html,
    //     data: {
    //         workshops,
    //     },
    //     path: "./output.pdf",
    //     type: "",
    // };

    try {
        const res = await pdf.create(document, options)
        console.log(res);
    } catch( error ) {
        console.error(error);
    }
};

module.exports = {
    getAllWorkshops,
    getWorkshopById,
    addWorkshop,
    updateWorkshop,
    addSpeakers,
    deleteWorkshop,
    generateWorkshopsPdf
};

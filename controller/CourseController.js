import express from "express";
import CourseModel from "../model/CourseModel.js";

const router = express.Router();

// Create a new course
router.post("/courses", async (req, res) => {
    try {
        const { title, description  } = req.body;
        const newCourse = new CourseModel({ title, description });
        const savedCourse = await newCourse.save();
        res.status(201).json(savedCourse);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all courses
router.get("/courses", async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; // Get the page number from the query parameters
        const limit = parseInt(req.query.limit) || 100; // Get the limit (number of courses per page) from the query parameters

        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        const coursesCount = await CourseModel.countDocuments();
        const totalPages = Math.ceil(coursesCount / limit);

        const courses = await CourseModel.find().skip(startIndex).limit(limit).lean();
        const modifiedCourses = courses.map((course) => {
            const { _id, ...rest } = course;
            return { id: _id, ...rest };
        });

        const paginationInfo = {
            currentPage: page,
            totalPages: totalPages,
            totalCourses: coursesCount,
        };

        res.json( modifiedCourses );
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// Get a course by ID
router.get("/courses/:id", async (req, res) => {
    try {
        const courseId = req.params.id;
        const course = await CourseModel.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }
        res.json(course);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.get("/courses/title/:title", async (req, res) => {
    try {
        const courseTitle = req.params.title;
        const course = await CourseModel.findOne({ title: courseTitle });
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }
        res.json(course);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update a course
router.put("/courses/:id", async (req, res) => {
    try {
        const courseId = req.params.id;
        const { title, description } = req.body;
        const updatedCourse = await CourseModel.findByIdAndUpdate(
            courseId,
            { title, description },
            { new: true }
        );
        if (!updatedCourse) {
            return res.status(404).json({ message: "Course not found" });
        }
        res.json(updatedCourse);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.put("/courses/title/:title", async (req, res) => {
    try {
        const courseTitle = req.params.title;
        const { title, description } = req.body;
        const updatedCourse = await CourseModel.findOneAndUpdate(
            { title: courseTitle },
            { title, description },
            { new: true }
        );
        if (!updatedCourse) {
            return res.status(404).json({ message: "Course not found" });
        }
        res.json(updatedCourse);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Delete a course
router.delete("/courses/:id", async (req, res) => {
    try {
        const courseId = req.params.id;
        const deletedCourse = await CourseModel.findByIdAndDelete(courseId);
        if (!deletedCourse) {
            return res.status(404).json({ message: "Course not found" });
        }
        res.json({ message: "Course deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.delete("/courses/title/:title", async (req, res) => {
    try {
        const courseTitle = req.params.title;
        const deletedCourse = await CourseModel.findOneAndDelete({ title: courseTitle });
        if (!deletedCourse) {
            return res.status(404).json({ message: "Course not found" });
        }
        res.json({ message: "Course deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
export default router;

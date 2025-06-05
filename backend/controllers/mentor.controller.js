const ApiError = require("../helper/apiError");
const mentorService = require("../services/mentor.service");
const httpStatus = require("../util/httpStatus");

const getAllMentors = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;
    const skip = (page - 1) * limit;

    const mentors = await mentorService.getAllMentors(skip, limit);

    const totalMentors = await mentorService.getMentorsCount;

    res.status(200).json({
      success: true,
      mentors,
      total: totalMentors,
      page,
      limit,
      totalPages: Math.ceil(totalMentors / limit),
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Something went wrong!" });
  }
};

const getMentorInfoByUsername = async (req, res, next) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(200).json({ success: true, suggestions: [] });
    }
    
    const suggestions = await mentorService.getMentorSuggestions(q);

    if (!suggestions || suggestions.length === 0) {
      return res.status(httpStatus.ok).json({
        success: true,
        suggestions: [],
      });
    }

    return res.status(httpStatus.ok).json({
      success: true,
      suggestions,
    });
  } catch (error) {
    console.error("Error in getMentorsSuggestion:", error);
    next(error);
  }
};

const getMentorProfile = async(req,res)=>{
  try {
    const {username} = req.params;

    if (!username) {
      return res.status(httpStatus.badRequest).json({ success: false, message: "Username is required in params" });
    }

    const mentor = await mentorService.getMentorByUsername(username);

    if (!mentor) {
      return res.status(httpStatus.ok).json({
        success: true,
        message: "Mentor not found",
      });
    }
    const services = await mentorService.getMentorServices(mentor._id);

    return res.status(httpStatus.ok).json({
      success:true,
      mentor,
      services
    })
    
  } catch (error) {
    console.error("Error fetching mentor profile:", error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

const getTopMentors = async (req, res, next) => {
  try {
    const mentors = await mentorService.getMentors();

    const topSelectedMentors = [];
    const totalMentors = mentors.length;

    while (topSelectedMentors.length < 4 && topSelectedMentors.length < totalMentors) {
      const randomIndex = Math.floor(Math.random() * totalMentors);
      const randomMentor = mentors[randomIndex];
      if (!topSelectedMentors.includes(randomMentor)) {
        topSelectedMentors.push(randomMentor);
      }
    }
    
    
    return res.status(httpStatus.ok).json({
      success: true,
      topSelectedMentors,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Something went wrong!" });
  }
};

module.exports = {
  getAllMentors,
  getMentorInfoByUsername,
  getTopMentors,
  getMentorProfile
};

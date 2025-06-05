import mentorApi from "@/apiManager/mentor";
import MentorCard from "@/components/MentorCard";
import Nav from "@/components/Nav";
import { Spin } from "antd";
import React, { useEffect, useState } from "react";
import debounce from "lodash.debounce";
import MentorProfile from "./MentorProfile";
import { useNavigate } from "react-router-dom";

const AllMentors = () => {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const navigate = useNavigate();

  const fetchAllMentors = async () => {
    try {
      setLoading(true);
      const response = await mentorApi.getAllMentors({ page, limit: 9 });

      const newMentors = (await response?.data?.mentors) || [];
      setMentors((prev) => {
        const existingIds = new Set(prev.map((m) => m._id));
        const uniqueNew = newMentors.filter((m) => !existingIds.has(m._id));
        return [...prev, ...uniqueNew];
      });

      if (newMentors.length < 9) {
        setHasMore(false);
      } else {
        setPage((prev) => prev + 1);
      }

      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllMentors();
  }, []);

  const fetchSuggestions = debounce(async (input) => {
    if (input.length < 1) {
      setSuggestions([]);
      return;
    }

    try {
      const res = await mentorApi.getMentorsBySuggestion(input);

      if (!res?.data?.suggestions || res.data.suggestions.length === 0) {
        setSuggestions([]);
      } else {
        setSuggestions(res.data.suggestions);
      }
    } catch (error) {
      console.log(error);
    }
  }, 400);

  const handleSearchQuery = (e) => {
    const input = e.target.value;
    setQuery(input);
    fetchSuggestions(input);
  };

  const handleSelectedMentor = (mentor) => {
    navigate(`/mentor/profile/${mentor?.username}`);
  };

  return (
    <>
      <Nav />

      {/* All Mentors Section Container */}
      <div className='max-w-6xl mx-auto max-h-fit'>
        {/* Heading Section for All Mentors */}
        <div className='w-full flex flex-col items-center justify-center h-[300px] bg-gray-100'>
          <h1 className='text-center text-2xl md:text-4xl font-semibold py-5'>
            Find your <span className='text-teal-900 text-bold'>Mentor</span> here
          </h1>

          <div className='relative w-4/5 md:w-3/5'>
            <input
              type='text'
              placeholder='Type name, skill, or title to find mentors...'
              className='relative w-full border-2 border-slate-400 p-2 md:p-3 focus:ring-black rounded hover:border-slate-500'
              value={query}
              onChange={handleSearchQuery}
            />

            {query.length > 0 && (
              <ul className='absolute top-full left-0 w-full border bg-white z-50 shadow-md'>
                {suggestions.length > 0 ? (
                  suggestions.map((mentor) => (
                    <li
                      key={mentor._id}
                      className='p-3 hover:bg-teal-200 cursor-pointer'
                      onClick={() => handleSelectedMentor(mentor)}
                    >
                      {mentor.name} - {mentor?.profile?.title || ""}
                    </li>
                  ))
                ) : (
                  <li className='p-3 text-gray-500'>No record found!</li>
                )}
              </ul>
            )}
          </div>
        </div>

        {/* All Mentors Data Display */}
        <div className='max-w-6xl mx-auto max-h-fit text-center mt-8'>
          {!loading ? (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 p-5 px-5 md:px-20'>
            {mentors.map((mentor) => (
                <MentorCard
                  mentor={mentor}
                  key={mentor?._id}
                  handleClick={() => handleSelectedMentor(mentor)}
                />
              ))}
            </div>
          ) : (
            
              <Spin size={"large"}/>
            
          )}

          {hasMore && (
            <button
              onClick={fetchAllMentors}
              className='mt-6 px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700'
              disabled={loading}
            >
              {loading ? "Loading..." : "Load More"}
            </button>
          )}
          {!hasMore && <p className='mt-4 text-gray-500 py-8'>No more mentors to load.</p>}
        </div>
      </div>

      {/* Footer */}
      <footer className='w-full px-8 py-12 text-white bg-black'>
        <div className='max-w-6xl mx-auto flex flex-col-reverse gap-5  justify-between items-center text-center'>
          <div>
            <p className='text-md text-gray-300'>© 2025 EduHub. All Rights Reserved.</p>
          </div>
          <div className='flex flex-row gap-3 text-gray-300 items-center flex-wrap justify-center'>
            <a
              href='/'
              className='hover:text-gray-500 transition-colors duration-500'
            >
              Terms of service
            </a>
            <a
              href='/'
              className='hover:text-gray-500 transition-colors duration-500'
            >
              Privacy Policy
            </a>
            <a
              href='/'
              className='hover:text-gray-500 transition-colors duration-500'
            >
              License
            </a>
          </div>
        </div>
      </footer>
    </>
  );
};

export default AllMentors;

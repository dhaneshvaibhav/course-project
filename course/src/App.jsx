import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  const [courseTypes, setCourseTypes] = useState([]);
  const [courses, setCourses] = useState([]);
  const [finalCourses, setFinalCourses] = useState([]);
  const [registrations, setRegistrations] = useState([]);

  const [newCourseType, setNewCourseType] = useState('');
  const [newCourse, setNewCourse] = useState('');
  const [selectedCourseType, setSelectedCourseType] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [filterCourseType, setFilterCourseType] = useState('');

  // Handlers for Course Types
  const handleAddCourseType = () => {
    if (newCourseType) {
      setCourseTypes([...courseTypes, newCourseType]);
      setNewCourseType('');
    }
  };

  const handleDeleteCourseType = (type) => {
    setCourseTypes(courseTypes.filter((t) => t !== type));
  };

  // Handlers for Courses
  const handleAddCourse = () => {
    if (newCourse) {
      setCourses([...courses, newCourse]);
      setNewCourse('');
    }
  };

  const handleDeleteCourse = (course) => {
    setCourses(courses.filter((c) => c !== course));
  };

  // Handlers for Final Courses
  const handleAddFinalCourse = () => {
    if (selectedCourseType && selectedCourse) {
      const finalCourse = `${selectedCourseType}, ${selectedCourse}`;
      setFinalCourses([...finalCourses, finalCourse]);
    }
  };

  const handleDeleteFinalCourse = (finalCourse) => {
    setFinalCourses(finalCourses.filter((fc) => fc !== finalCourse));
  };

  // Handlers for Student Registrations
  const handleAddRegistration = (finalCourse) => {
    setRegistrations([...registrations, finalCourse]);
  };

  const filteredFinalCourses = filterCourseType
    ? finalCourses.filter((fc) => fc.startsWith(filterCourseType))
    : finalCourses;

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="w-75">
        <h1 className="text-center">Course Management</h1>

        {/* Course Types */}
        <section className="mt-4">
          <h3>Course Types</h3>
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Enter course type"
              value={newCourseType}
              onChange={(e) => setNewCourseType(e.target.value)}
            />
            <button className="btn btn-primary" onClick={handleAddCourseType}>
              Add
            </button>
          </div>
          <ul className="list-group">
            {courseTypes.map((type, index) => (
              <li className="list-group-item d-flex justify-content-between align-items-center" key={index}>
                {type}
                <button className="btn btn-danger btn-sm" onClick={() => handleDeleteCourseType(type)}>
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </section>

        {/* Courses */}
        <section className="mt-4">
          <h3>Courses</h3>
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Enter course name"
              value={newCourse}
              onChange={(e) => setNewCourse(e.target.value)}
            />
            <button className="btn btn-primary" onClick={handleAddCourse}>
              Add
            </button>
          </div>
          <ul className="list-group">
            {courses.map((course, index) => (
              <li className="list-group-item d-flex justify-content-between align-items-center" key={index}>
                {course}
                <button className="btn btn-danger btn-sm" onClick={() => handleDeleteCourse(course)}>
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </section>

        {/* Final Courses */}
        <section className="mt-4">
          <h3>Final Courses</h3>
          <div className="input-group mb-3">
            <select
              className="form-select"
              value={selectedCourseType}
              onChange={(e) => setSelectedCourseType(e.target.value)}
            >
              <option value="">Select Course Type</option>
              {courseTypes.map((type, index) => (
                <option key={index} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <select
              className="form-select"
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
            >
              <option value="">Select Course</option>
              {courses.map((course, index) => (
                <option key={index} value={course}>
                  {course}
                </option>
              ))}
            </select>
            <button className="btn btn-primary" onClick={handleAddFinalCourse}>
              Add
            </button>
          </div>
          <ul className="list-group">
            {finalCourses.map((fc, index) => (
              <li className="list-group-item d-flex justify-content-between align-items-center" key={index}>
                {fc}
                <button className="btn btn-danger btn-sm" onClick={() => handleDeleteFinalCourse(fc)}>
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </section>

        {/* Registrations */}
        <section className="mt-4">
          <h3>Student Registrations</h3>
          <div className="input-group mb-3">
            <select
              className="form-select"
              value={filterCourseType}
              onChange={(e) => setFilterCourseType(e.target.value)}
            >
              <option value="">Filter by Course Type</option>
              {courseTypes.map((type, index) => (
                <option key={index} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <ul className="list-group">
            {filteredFinalCourses.map((fc, index) => (
              <li className="list-group-item d-flex justify-content-between align-items-center" key={index}>
                {fc}
                <button className="btn btn-success btn-sm" onClick={() => handleAddRegistration(fc)}>
                  Register
                </button>
              </li>
            ))}
          </ul>
          <h4 className="mt-4">Registered Courses</h4>
          <ul className="list-group">
            {registrations.map((registration, index) => (
              <li className="list-group-item" key={index}>
                {registration}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
};

export default App;

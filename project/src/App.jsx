import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { BookOpen, Users, GraduationCap, Layout } from 'lucide-react';
import CourseTypes from './components/CourseTypes';
import Courses from './components/Courses';
import CourseOfferings from './components/CourseOfferings';
import Registrations from './components/Registrations';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-white shadow-md">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-8">
                <Link to="/" className="flex items-center gap-2 font-bold text-xl text-blue-600">
                  <GraduationCap size={24} />
                  Course Manager
                </Link>
                
                <div className="flex items-center gap-4">
                  <Link
                    to="/course-types"
                    className="flex items-center gap-2 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
                  >
                    <Layout size={20} />
                    Course Types
                  </Link>
                  <Link
                    to="/courses"
                    className="flex items-center gap-2 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
                  >
                    <BookOpen size={20} />
                    Courses
                  </Link>
                  <Link
                    to="/course-offerings"
                    className="flex items-center gap-2 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
                  >
                    <Users size={20} />
                    Course Offerings
                  </Link>
                  <Link
                    to="/registrations"
                    className="flex items-center gap-2 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
                  >
                    <GraduationCap size={20} />
                    Registrations
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </nav>

        <main className="py-8">
          <Routes>
            <Route path="/" element={<Registrations />} />
            <Route path="/course-types" element={<CourseTypes />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/course-offerings" element={<CourseOfferings />} />
            <Route path="/registrations" element={<Registrations />} />
          </Routes>
        </main>

        <Toaster position="top-right" />
      </div>
    </BrowserRouter>
  );
}

export default App;
import React, { useEffect, useState } from 'react';
import { PlusCircle, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Course, CourseType, CourseOffering } from '../types';
import toast from 'react-hot-toast';

export default function CourseOfferings() {
  const [courseOfferings, setCourseOfferings] = useState<CourseOffering[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [courseTypes, setCourseTypes] = useState<CourseType[]>([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedType, setSelectedType] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const [coursesRes, typesRes, offeringsRes] = await Promise.all([
      supabase.from('courses').select('*').order('name'),
      supabase.from('course_types').select('*').order('name'),
      supabase.from('course_offerings').select(`
        *,
        course:courses(*),
        course_type:course_types(*)
      `).order('created_at')
    ]);

    if (coursesRes.error) toast.error('Failed to load courses');
    if (typesRes.error) toast.error('Failed to load course types');
    if (offeringsRes.error) toast.error('Failed to load course offerings');

    setCourses(coursesRes.data || []);
    setCourseTypes(typesRes.data || []);
    setCourseOfferings(offeringsRes.data || []);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    const { error } = await supabase
      .from('course_offerings')
      .insert([{
        course_id: selectedCourse,
        course_type_id: selectedType
      }]);

    if (error) {
      toast.error('Failed to create course offering');
      return;
    }

    toast.success('Course offering created successfully');
    setSelectedCourse('');
    setSelectedType('');
    loadData();
  }

  async function handleDelete(id: string) {
    const { error } = await supabase
      .from('course_offerings')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Failed to delete course offering');
      return;
    }

    toast.success('Course offering deleted successfully');
    loadData();
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Course Offerings</h1>
      
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex gap-4">
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="flex-1 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select Course</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.name}
              </option>
            ))}
          </select>
          
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="flex-1 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select Type</option>
            {courseTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <PlusCircle size={20} />
            Add Offering
          </button>
        </div>
      </form>

      <div className="bg-white rounded-lg shadow">
        <ul className="divide-y">
          {courseOfferings.map((offering) => (
            <li key={offering.id} className="flex items-center justify-between p-4">
              <div>
                <span className="text-lg font-medium">
                  {offering.course?.name}
                </span>
                <span className="mx-2">-</span>
                <span className="text-gray-600">
                  {offering.course_type?.name}
                </span>
              </div>
              <button
                onClick={() => handleDelete(offering.id)}
                className="p-2 text-red-500 hover:bg-red-50 rounded"
              >
                <Trash2 size={20} />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
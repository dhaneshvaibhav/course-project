import React, { useEffect, useState } from 'react';
import { PlusCircle, Trash2, Edit2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Course } from '../types';
import toast from 'react-hot-toast';

export default function Courses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [newCourseName, setNewCourseName] = useState('');
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  useEffect(() => {
    loadCourses();
  }, []);

  async function loadCourses() {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .order('name');
    
    if (error) {
      toast.error('Failed to load courses');
      return;
    }
    
    setCourses(data);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (editingCourse) {
      const { error } = await supabase
        .from('courses')
        .update({ name: newCourseName })
        .eq('id', editingCourse.id);

      if (error) {
        toast.error('Failed to update course');
        return;
      }

      toast.success('Course updated successfully');
      setEditingCourse(null);
    } else {
      const { error } = await supabase
        .from('courses')
        .insert([{ name: newCourseName }]);

      if (error) {
        toast.error('Failed to create course');
        return;
      }

      toast.success('Course created successfully');
    }

    setNewCourseName('');
    loadCourses();
  }

  async function handleDelete(id: string) {
    const { error } = await supabase
      .from('courses')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Failed to delete course');
      return;
    }

    toast.success('Course deleted successfully');
    loadCourses();
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Courses</h1>
      
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex gap-4">
          <input
            type="text"
            value={newCourseName}
            onChange={(e) => setNewCourseName(e.target.value)}
            placeholder="Enter course name"
            className="flex-1 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <PlusCircle size={20} />
            {editingCourse ? 'Update' : 'Add'} Course
          </button>
        </div>
      </form>

      <div className="bg-white rounded-lg shadow">
        <ul className="divide-y">
          {courses.map((course) => (
            <li key={course.id} className="flex items-center justify-between p-4">
              <span className="text-lg">{course.name}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditingCourse(course);
                    setNewCourseName(course.name);
                  }}
                  className="p-2 text-blue-500 hover:bg-blue-50 rounded"
                >
                  <Edit2 size={20} />
                </button>
                <button
                  onClick={() => handleDelete(course.id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
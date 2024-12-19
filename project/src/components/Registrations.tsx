import React, { useEffect, useState } from 'react';
import { PlusCircle, Trash2, Filter } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { CourseType, CourseOffering, Registration } from '../types';
import toast from 'react-hot-toast';

export default function Registrations() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [courseOfferings, setCourseOfferings] = useState<CourseOffering[]>([]);
  const [courseTypes, setCourseTypes] = useState<CourseType[]>([]);
  const [selectedOffering, setSelectedOffering] = useState('');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState('');
  const [studentName, setStudentName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const [typesRes, offeringsRes, registrationsRes] = await Promise.all([
      supabase.from('course_types').select('*').order('name'),
      supabase.from('course_offerings').select(`
        *,
        course:courses(*),
        course_type:course_types(*)
      `).order('created_at'),
      supabase.from('registrations').select(`
        *,
        course_offering:course_offerings(
          *,
          course:courses(*),
          course_type:course_types(*)
        )
      `).order('created_at', { ascending: false })
    ]);

    if (typesRes.error) toast.error('Failed to load course types');
    if (offeringsRes.error) toast.error('Failed to load course offerings');
    if (registrationsRes.error) toast.error('Failed to load registrations');

    setCourseTypes(typesRes.data || []);
    setCourseOfferings(offeringsRes.data || []);
    setRegistrations(registrationsRes.data || []);
  }

  const filteredOfferings = selectedTypeFilter
    ? courseOfferings.filter(o => o.course_type?.id === selectedTypeFilter)
    : courseOfferings;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    const { error } = await supabase
      .from('registrations')
      .insert([{
        course_offering_id: selectedOffering,
        student_name: studentName,
        email
      }]);

    if (error) {
      toast.error('Failed to create registration');
      return;
    }

    toast.success('Registration created successfully');
    setSelectedOffering('');
    setStudentName('');
    setEmail('');
    loadData();
  }

  async function handleDelete(id: string) {
    const { error } = await supabase
      .from('registrations')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Failed to delete registration');
      return;
    }

    toast.success('Registration deleted successfully');
    loadData();
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Course Registrations</h1>
      
      <div className="mb-8 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-2 mb-4">
          <Filter size={20} className="text-gray-500" />
          <h2 className="text-lg font-medium">Filter Courses</h2>
        </div>
        <select
          value={selectedTypeFilter}
          onChange={(e) => setSelectedTypeFilter(e.target.value)}
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Course Types</option>
          {courseTypes.map((type) => (
            <option key={type.id} value={type.id}>
              {type.name}
            </option>
          ))}
        </select>
      </div>
      
      <form onSubmit={handleSubmit} className="mb-8 space-y-4">
        <select
          value={selectedOffering}
          onChange={(e) => setSelectedOffering(e.target.value)}
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="">Select Course</option>
          {filteredOfferings.map((offering) => (
            <option key={offering.id} value={offering.id}>
              {offering.course?.name} - {offering.course_type?.name}
            </option>
          ))}
        </select>

        <input
          type="text"
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
          placeholder="Student Name"
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email Address"
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <PlusCircle size={20} />
          Register for Course
        </button>
      </form>

      <div className="bg-white rounded-lg shadow">
        <ul className="divide-y">
          {registrations.map((registration) => (
            <li key={registration.id} className="flex items-center justify-between p-4">
              <div>
                <div className="font-medium">
                  {registration.course_offering?.course?.name} - {registration.course_offering?.course_type?.name}
                </div>
                <div className="text-sm text-gray-600">
                  {registration.student_name} ({registration.email})
                </div>
              </div>
              <button
                onClick={() => handleDelete(registration.id)}
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